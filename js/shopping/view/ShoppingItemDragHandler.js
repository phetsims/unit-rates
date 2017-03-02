// Copyright 2017, University of Colorado Boulder

/**
 * Drag handler for shopping items.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // radius of the scale's surface in scale.png, determined by inspection
  var SCALE_RADIUS = 10;

  /**
   * @param {ShoppingItemNode} itemNode
   * @param {item} item
   * @param {Shelf} shelf
   * @param {Scale} scale
   * @constructor
   */
  function ShoppingItemDragHandler( itemNode, item, shelf, scale ) {

    // {Vector2} where the drag started relative to locationProperty, in parent view coordinates
    var startDragOffset;

    SimpleDragHandler.call( this, {

      // allow touch swipes across an item to pick it up
      allowTouchSnag: true,

      /**
       * Called when a drag sequence starts.
       * @param {Event} event
       * @param {Trail} trail
       */
      start: function( event, trail ) {

        // prerequisites for the drag sequence
        assert && assert( !( shelf.itemRowBack.containsMovable( item ) && scale.itemRowBack.containsMovable( item ) ),
          'item should not be on both shelf and scale' );

        item.dragging = true;
        itemNode.moveToFront();

        // remove item from shelf or scale
        if ( shelf.itemRowBack.containsMovable( item ) ) {
          shelf.itemRowBack.remove( item );
        }
        else if ( shelf.itemRowFront.containsMovable( item ) ) {
          shelf.itemRowFront.remove( item );
        }
        else if ( scale.itemRowBack.containsMovable( item ) ) {
          scale.itemRowBack.remove( item );
        }
        else if ( scale.itemRowFront.containsMovable( item ) ) {
          scale.itemRowFront.remove( item );
        }
        else {
          throw new Error( 'item is not on shelf or scale' );
        }

        // compute the offset between the pointer and the item's location
        startDragOffset = itemNode.globalToParentPoint( event.pointer.point ).minus( item.locationProperty.value );
      },

      /**
       * Called when the pointer moves during a drag sequence.
       * @param {Event} event
       * @param {Trail} trail
       */
      drag: function( event, trail ) {

        // move the item immediately while dragging
        item.moveTo( itemNode.globalToParentPoint( event.pointer.point ).minus( startDragOffset ) );
      },

      /**
       * Called when a drag sequence ends.
       * @param {Event} event
       * @param {Trail} trail
       */
      end: function( event, trail ) {

        item.dragging = false;

        // if the item is released above the scale's surface ...
        if ( item.locationProperty.value.y < scale.location.y + SCALE_RADIUS ) {

          // find closest cell on the scale
          var backScaleCellIndex = scale.itemRowBack.getClosestUnoccupiedCell( item.locationProperty.value );
          var frontScaleCellIndex = scale.itemRowFront.getClosestUnoccupiedCell( item.locationProperty.value );
          assert && assert( !( backScaleCellIndex === -1 && frontScaleCellIndex === -1 ), 'scale is full' );

          var scaleCellIndex = -1;
          var scaleItemRow = null;
          if ( backScaleCellIndex === -1 ) {
            scaleCellIndex = frontScaleCellIndex;
            scaleItemRow = scale.itemRowFront;
          }
          else if ( frontScaleCellIndex === -1 ) {
            scaleCellIndex = backScaleCellIndex;
            scaleItemRow = scale.itemRowBack;
          }
          else {
            var backScaleCellDistance = item.locationProperty.value.distance( scale.itemRowBack.getCellLocation( backScaleCellIndex ) );
            var frontScaleCellDistance = item.locationProperty.value.distance( scale.itemRowFront.getCellLocation( frontScaleCellIndex ) );
            if ( backScaleCellDistance <= frontScaleCellDistance ) {
              scaleCellIndex = backScaleCellIndex;
              scaleItemRow = scale.itemRowBack;
            }
            else {
              scaleCellIndex = frontScaleCellIndex;
              scaleItemRow = scale.itemRowFront;
            }
          }

          if ( scaleItemRow === scale.itemRowBack ) {
            itemNode.moveToBack();
          }
          else {
            itemNode.moveToFront();
          }

          // animate to scale
          unitRates.log && unitRates.log( 'animating to scale cell ' + scaleCellIndex );
          beginAnimation( item, scaleCellIndex, scale, scaleItemRow );
        }
        else {

          // find closest cell on the shelf
          var backShelfCellIndex = shelf.itemRowBack.getClosestUnoccupiedCell( item.locationProperty.value );
          var frontShelfCellIndex = shelf.itemRowFront.getClosestUnoccupiedCell( item.locationProperty.value );
          assert && assert( backShelfCellIndex !== -1 || frontShelfCellIndex !== 1 , 'shelf is full' );

          var shelfCellIndex = -1;
          var shelfItemRow = null;
          if ( backShelfCellIndex === -1 ) {
            shelfCellIndex = frontShelfCellIndex;
            shelfItemRow = shelf.itemRowFront;
          }
          else if ( frontShelfCellIndex === -1 ) {
            shelfCellIndex = backShelfCellIndex;
            shelfItemRow = shelf.itemRowBack;
          }
          else {
            var backShelfCellDistance = item.locationProperty.value.distance( shelf.itemRowBack.getCellLocation( backShelfCellIndex ) );
            var frontShelfCellDistance = item.locationProperty.value.distance( shelf.itemRowFront.getCellLocation( frontShelfCellIndex ) );
            if ( backShelfCellDistance <= frontShelfCellDistance ) {
              shelfCellIndex = backShelfCellIndex;
              shelfItemRow = shelf.itemRowBack;
            }
            else {
              shelfCellIndex = frontShelfCellIndex;
              shelfItemRow = shelf.itemRowFront;
            }
          }

          if ( shelfItemRow === scale.itemRowBack ) {
            itemNode.moveToBack();
          }
          else {
            itemNode.moveToFront();
          }

          // animate to shelf
          unitRates.log && unitRates.log( 'animating to shelf cell ' + shelfCellIndex );
          beginAnimation( item, shelfCellIndex, shelf, shelfItemRow );
        }
      }
    } );
  }

  unitRates.register( 'ShoppingItemDragHandler', ShoppingItemDragHandler );

  /**
   * Begins the animation of an item to a specified cell (on shelf or scale).
   * The animation will change course immediately if the specified cell becomes occupied.
   * @param {ShoppingItem} item
   * @param {number} cellIndex
   * @param {Scale|Shelf} scaleOrShelf
   * @param {MovableRow} itemRow
   * @private
   */
  function beginAnimation( item, cellIndex, scaleOrShelf, itemRow ) {

    var cellLocation = itemRow.getCellLocation( cellIndex );

    // This function changes course to the next closest unoccupied cell.
    var changeCourse = function() {

      // find another unoccupied cell
      unitRates.log && unitRates.log( 'cell ' + cellIndex + ' is occupied, trying another cell' );
      itemRow = scaleOrShelf.itemRowBack;
      cellIndex = itemRow.getClosestUnoccupiedCell( item.locationProperty.value );
      if ( cellIndex === -1 ) {
        itemRow = scaleOrShelf.itemRowFront;
        cellIndex = itemRow.getClosestUnoccupiedCell( item.locationProperty.value );
      }
      assert && assert( cellIndex !== -1, 'all cells are occupied' );

      beginAnimation( item, cellIndex, scaleOrShelf, itemRow );
    };

    // This function is called on each animation step.
    // If the target cell becomes occupied, change course immediately.
    var animationStepCallback = function() {
      if ( !itemRow.isEmptyCell( cellIndex ) ) {
        changeCourse();
      }
    };

    // This function is called when animation completes.
    // If the target cell is still empty, add the item. Otherwise animate to an unoccupied cell.
    var animationCompletedCallback = function() {
      if ( itemRow.isEmptyCell( cellIndex ) ) {

        // the cell is still empty when we reach it, put the item in that cell
        itemRow.put( item, cellIndex );
      }
      else {

        // the cell is occupied, try another cell
        changeCourse();
      }
    };

    // begin the animation
    item.animateTo( cellLocation, {
      animationStepCallback: animationStepCallback,
      animationCompletedCallback: animationCompletedCallback
    } );
  }

  return inherit( SimpleDragHandler, ShoppingItemDragHandler );
} );
