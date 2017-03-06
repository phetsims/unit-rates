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

        // is the item above the scale's top surface?
        var isAboveScale = ( item.locationProperty.value.y < scale.location.y + ( scale.depth / 2 ) );

        // if the item is released above the scale, item falls to scale, otherwise to shelf.
        var shoppingContainer = isAboveScale ? scale : shelf;

        // get the closest row and unoccupied cell, returns {itemRow: RowOfMovables, cellIndex: number}
        var rowAndCell = getClosestRowAndUnoccupiedCell( shoppingContainer, item.locationProperty.value );

        animateItemToContainer( shoppingContainer, item, itemNode, rowAndCell.itemRow, rowAndCell.cellIndex,
          frontItemLayer, backItemLayer );
      }
    } );
  }

  unitRates.register( 'ShoppingItemDragHandler', ShoppingItemDragHandler );

  /**
   * Gets the row and unoccupied cell that are closest to the specified location.
   * @param {ShoppingContainer} shoppingContainer
   * @param {Vector2} location
   * @returns {{itemRow: RowOfMovables, cellIndex: number}}
   */
  function getClosestRowAndUnoccupiedCell( shoppingContainer, location ) {

    // to improve readability
    var backItemRow = shoppingContainer.backItemRow;
    var frontItemRow = shoppingContainer.frontItemRow;

    // find closest cell in each row
    var backCellIndex = backItemRow.getClosestUnoccupiedCell( location );
    var frontCellIndex = frontItemRow.getClosestUnoccupiedCell( location );
    assert && assert( !( backCellIndex === -1 && frontCellIndex === -1 ), 'container is full' );

    var itemRow = null;
    var cellIndex = -1;

    if ( backCellIndex === -1 ) {

      // back row is full, use front row
      itemRow = frontItemRow;
      cellIndex = frontCellIndex;
    }
    else if ( frontCellIndex === -1 ) {

      // front row is full, use back row
      itemRow = backItemRow;
      cellIndex = backCellIndex;
    }
    else {

      // front and back rows both have unoccupied cells, choose the closest one
      var backCellDistance = location.distance( backItemRow.getCellLocation( backCellIndex ) );
      var frontCellDistance = location.distance( frontItemRow.getCellLocation( frontCellIndex ) );
      if ( backCellDistance <= frontCellDistance ) {
        itemRow = backItemRow;
        cellIndex = backCellIndex;
      }
      else {
        itemRow = frontItemRow;
        cellIndex = frontCellIndex;
      }
    }

    return {
      itemRow: itemRow, // {RowOfMovables} the front or back row of items
      cellIndex: cellIndex // {number} a cell in itemRow
    };
  }

  /**
   * Animates an item to a specified row and cell in a container.
   * The animation will change course immediately if the specified cell becomes occupied.
   * @param {ShoppingContainer} shoppingContainer
   * @param {ShoppingItem} item
   * @param {Node} itemNode
   * @param {RowOfMovables} itemRow
   * @param {number} cellIndex
   * @param {Node} frontItemLayer
   * @param {Node} backItemLayer
   * @private
   */
  function animateItemToContainer( shoppingContainer, item, itemNode, itemRow, cellIndex, frontItemLayer, backItemLayer ) {

    var cellLocation = itemRow.getCellLocation( cellIndex );

    // This function changes course to the next closest unoccupied cell.
    var changeCourse = function() {
      unitRates.log && unitRates.log( 'cell ' + cellIndex + ' is occupied, trying another cell' );

      // get the closest row and unoccupied cell, returns {itemRow: RowOfMovables, cellIndex: number}
      var rowAndCell = getClosestRowAndUnoccupiedCell( shoppingContainer, item.locationProperty.value );

      animateItemToContainer( shoppingContainer, item, itemNode, rowAndCell.itemRow, rowAndCell.cellIndex,
        frontItemLayer, backItemLayer );
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

        // the cell is still unoccupied when we reached it, put the item in that cell
        itemRow.put( item, cellIndex );

        // move Node to front or back item layer
       itemNode.getParent() && itemNode.getParent().removeChild( itemNode );
       if ( itemRow === shoppingContainer.backItemRow ) {
         backItemLayer.addChild( itemNode );
       }
       else {
         frontItemLayer.addChild( itemNode );
       }
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
