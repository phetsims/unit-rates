// Copyright 2017-2019, University of Colorado Boulder

/**
 * Drag handler for shopping items.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

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

    // {Vector2} where the drag started relative to the item's position, in parent view coordinates
    let startDragOffset;

    SimpleDragHandler.call( this, {

      // allow touch swipes across an item to pick it up
      allowTouchSnag: true,

      /**
       * Called when a drag sequence starts.
       * @param {SceneryEvent} event
       * @param {Trail} trail
       */
      start: function( event, trail ) {

        // move Node to the drag layer, so that it pops to the front
        item.dragging = true;
        itemNode.getParent() && itemNode.getParent().removeChild( itemNode );
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

        // compute the offset between the pointer and the item's position
        startDragOffset = itemNode.globalToParentPoint( event.pointer.point ).minus( item.positionProperty.value );
      },

      /**
       * Called when the pointer moves during a drag sequence.
       * @param {SceneryEvent} event
       * @param {Trail} trail
       */
      drag: function( event, trail ) {

        // move the item immediately while dragging
        item.moveTo( itemNode.globalToParentPoint( event.pointer.point ).minus( startDragOffset ) );
      },

      /**
       * Called when a drag sequence ends.
       * @param {SceneryEvent} event
       * @param {Trail} trail
       */
      end: function( event, trail ) {

        item.dragging = false;

        // if the item is released above the scale, item falls to scale, otherwise to shelf.
        const shoppingContainer = ( item.positionProperty.value.y < scale.yAboveScale ) ? scale : shelf;

        // get the closest row and unoccupied cell, returns {itemRow: RowOfMovables, cellIndex: number}
        const rowAndCell = getClosestRowAndUnoccupiedCell( shoppingContainer, item.positionProperty.value );

        if ( !itemNode.isDisposed ) {
          animateItemToContainer( shoppingContainer, item, itemNode, rowAndCell.itemRow, rowAndCell.cellIndex,
            frontItemLayer, backItemLayer );
        }
      }
    } );
  }

  unitRates.register( 'ShoppingItemDragHandler', ShoppingItemDragHandler );

  /**
   * Gets the row and unoccupied cell that are closest to the specified position.
   * @param {ShoppingContainer} shoppingContainer
   * @param {Vector2} position
   * @returns {{itemRow: RowOfMovables, cellIndex: number}}
   */
  function getClosestRowAndUnoccupiedCell( shoppingContainer, position ) {

    // to improve readability
    const backItemRow = shoppingContainer.backItemRow;
    const frontItemRow = shoppingContainer.frontItemRow;

    // find closest cell in each row
    const backCellIndex = backItemRow.getClosestUnoccupiedCell( position );
    const frontCellIndex = frontItemRow.getClosestUnoccupiedCell( position );
    assert && assert( !( backCellIndex === -1 && frontCellIndex === -1 ), 'container is full' );

    let itemRow = null;
    let cellIndex = -1;

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
      const backCellDistance = position.distance( backItemRow.getCellPosition( backCellIndex ) );
      const frontCellDistance = position.distance( frontItemRow.getCellPosition( frontCellIndex ) );
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

    // This function changes course to the next closest unoccupied cell.
    const changeCourse = function() {
      unitRates.log && unitRates.log( 'cell ' + cellIndex + ' is occupied, trying another cell' );

      // get the closest row and unoccupied cell, returns {itemRow: RowOfMovables, cellIndex: number}
      const rowAndCell = getClosestRowAndUnoccupiedCell( shoppingContainer, item.positionProperty.value );

      animateItemToContainer( shoppingContainer, item, itemNode, rowAndCell.itemRow, rowAndCell.cellIndex,
        frontItemLayer, backItemLayer );
    };

    // This function is called on each animation step.
    // If the target cell becomes occupied, change course immediately.
    const animationStepCallback = function() {
      if ( !itemRow.isEmptyCell( cellIndex ) ) {
        changeCourse();
      }
    };

    // This function is called when animation completes.
    // If the target cell is still empty, add the item. Otherwise animate to an unoccupied cell.
    const animationCompletedCallback = function() {
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

    const destination = itemRow.getCellPosition( cellIndex ); // {Vector2}

    // begin the animation
    item.animateTo( destination, {
      animationStepCallback: animationStepCallback,
      animationCompletedCallback: animationCompletedCallback
    } );
  }

  return inherit( SimpleDragHandler, ShoppingItemDragHandler );
} );
