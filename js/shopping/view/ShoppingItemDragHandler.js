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

  /**
   * @param {ShoppingItemNode} itemNode
   * @param {item} item
   * @param {Shelf} shelf
   * @param {Scale} scale
   * @param {Node} frontItemLayer
   * @param {Node} backItemLayer
   * @param {Node} dragLayer
   * @constructor
   */
  function ShoppingItemDragHandler( itemNode, item, shelf, scale, frontItemLayer, backItemLayer, dragLayer ) {

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
        assert && assert( frontItemLayer.hasChild( itemNode ) || backItemLayer.hasChild( itemNode ) );
        assert && assert( !( shelf.containsItem( item ) && scale.containsItem( item ) ),
          'item should not be on both shelf and scale' );

        // move Node to the drag layer
        item.dragging = true;
        frontItemLayer.hasChild( itemNode ) && frontItemLayer.removeChild( itemNode );
        backItemLayer.hasChild( itemNode ) && backItemLayer.removeChild( itemNode );
        dragLayer.addChild( itemNode );

        // remove item from shelf or scale
        if ( shelf.containsItem( item ) ) {
          shelf.removeItem( item );
        }
        else if ( scale.containsItem( item ) ) {
          scale.removeItem( item );
        }
        else {
          // item was grabbed while animating
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

        // if the item is released above the scale's surface, item falls to scale, otherwise to shelf.
        var shoppingContainer = ( item.locationProperty.value.y < scale.location.y + ( scale.depth / 2 ) ) ? scale : shelf;

        // find closest cell
        var backCellIndex = shoppingContainer.backItemRow.getClosestUnoccupiedCell( item.locationProperty.value );
        var frontCellIndex = shoppingContainer.frontItemRow.getClosestUnoccupiedCell( item.locationProperty.value );
        assert && assert( !( backCellIndex === -1 && frontCellIndex === -1 ), 'scale or shelf is full' );

        var cellIndex = -1;
        var itemRow = null;
        if ( backCellIndex === -1 ) {
          cellIndex = frontCellIndex;
          itemRow = shoppingContainer.frontItemRow;
        }
        else if ( frontCellIndex === -1 ) {
          cellIndex = backCellIndex;
          itemRow = shoppingContainer.backItemRow;
        }
        else {
          var backCellDistance = item.locationProperty.value.distance( shoppingContainer.backItemRow.getCellLocation( backCellIndex ) );
          var frontCellDistance = item.locationProperty.value.distance( shoppingContainer.frontItemRow.getCellLocation( frontCellIndex ) );
          if ( backCellDistance <= frontCellDistance ) {
            cellIndex = backCellIndex;
            itemRow = shoppingContainer.backItemRow;
          }
          else {
            cellIndex = frontCellIndex;
            itemRow = shoppingContainer.frontItemRow;
          }
        }

        // move Node to front or back item layer
        dragLayer.removeChild( itemNode );
        if ( itemRow === shoppingContainer.backItemRow ) {
          backItemLayer.addChild( itemNode );
        }
        else {
          frontItemLayer.addChild( itemNode );
        }

        // animate to scale
        unitRates.log && unitRates.log( 'animating to cell ' + cellIndex );
        beginAnimation( item, cellIndex, shoppingContainer, itemRow );
      }
    } );
  }

  unitRates.register( 'ShoppingItemDragHandler', ShoppingItemDragHandler );

  /**
   * Begins the animation of an item to a specified cell (on shelf or scale).
   * The animation will change course immediately if the specified cell becomes occupied.
   * @param {ShoppingItem} item
   * @param {number} cellIndex
   * @param {ShoppingContainer} shoppingContainer
   * @param {RowOfMovables} itemRow
   * @private
   */
  function beginAnimation( item, cellIndex, shoppingContainer, itemRow ) {

    var cellLocation = itemRow.getCellLocation( cellIndex );

    // This function changes course to the next closest unoccupied cell.
    var changeCourse = function() {

      // find another unoccupied cell
      unitRates.log && unitRates.log( 'cell ' + cellIndex + ' is occupied, trying another cell' );
      itemRow = shoppingContainer.backItemRow;
      cellIndex = itemRow.getClosestUnoccupiedCell( item.locationProperty.value );
      if ( cellIndex === -1 ) {
        itemRow = shoppingContainer.frontItemRow;
        cellIndex = itemRow.getClosestUnoccupiedCell( item.locationProperty.value );
      }
      assert && assert( cellIndex !== -1, 'all cells are occupied' );

      beginAnimation( item, cellIndex, shoppingContainer, itemRow );
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
