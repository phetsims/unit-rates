// Copyright 2017, University of Colorado Boulder

/**
 * Drag handler for bags.
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
   * @param {BagNode} bagNode
   * @param {Bag} bag
   * @param {Shelf} shelf
   * @param {Scale} scale
   * @constructor
   */
  function BagDragHandler( bagNode, bag, shelf, scale ) {

    // {Vector2} where the drag started relative to locationProperty, in parent view coordinates
    var startDragOffset;

    SimpleDragHandler.call( this, {

      // allow touch swipes across a bag to pick it up
      allowTouchSnag: true,

      /**
       * Called when a drag sequence starts.
       * @param {Event} event
       * @param {Trail} trail
       */
      start: function( event, trail ) {

        // prerequisites for the drag sequence
        assert && assert( !( shelf.bagRow.containsMovable( bag ) && scale.bagRow.containsMovable( bag ) ),
          'bag should not be on both shelf and scale' );

        bag.dragging = true;
        bagNode.moveToFront();

        // remove bag from shelf or scale
        if ( shelf.bagRow.containsMovable( bag ) ) {
          shelf.bagRow.remove( bag );
        }
        else if ( scale.bagRow.containsMovable( bag ) ) {
          scale.bagRow.remove( bag );
        }

        // compute the offset between the pointer and the bag's location
        startDragOffset = bagNode.globalToParentPoint( event.pointer.point ).minus( bag.locationProperty.value );
      },

      /**
       * Called when the pointer moves during a drag sequence.
       * @param {Event} event
       * @param {Trail} trail
       */
      drag: function( event, trail ) {

        // move the bag immediately while dragging
        bag.moveTo( bagNode.globalToParentPoint( event.pointer.point ).minus( startDragOffset ) );
      },

      /**
       * Called when a drag sequence ends.
       * @param {Event} event
       * @param {Trail} trail
       */
      end: function( event, trail ) {

        bag.dragging = false;

        // if the bag is released above the scale's surface ...
        if ( bag.locationProperty.value.y < scale.location.y + ( scale.depth / 2 ) ) {

          // find closest cell on the scale
          var scaleCellIndex = scale.bagRow.getClosestUnoccupiedCell( bag.locationProperty.value );
          assert && assert( scaleCellIndex !== -1, 'scale is full' );

          // animate to scale
          unitRates.log && unitRates.log( 'animating to scale cell ' +  scaleCellIndex );
          beginAnimation( bag, scaleCellIndex, scale.bagRow );
        }
        else {

          // find closest cell on the shelf
          var shelfCellIndex = shelf.bagRow.getClosestUnoccupiedCell( bag.locationProperty.value );
          assert && assert( shelfCellIndex !== -1, 'shelf is full' );

          // animate to shelf
          unitRates.log && unitRates.log( 'animating to shelf cell ' + shelfCellIndex );
          beginAnimation( bag, shelfCellIndex, shelf.bagRow );
        }
      }
    } );
  }

  unitRates.register( 'BagDragHandler', BagDragHandler );

  /**
   * Begins the animation of a bag to a specified cell (on shelf or scale).
   * The animation will change course immediately if the specified cell becomes occupied.
   * @param {Bag} bag
   * @param {number} cellIndex
   * @param {MovableRow} bagRow
   * @private
   */
  function beginAnimation( bag, cellIndex, bagRow ) {

    var cellLocation = bagRow.getCellLocation( cellIndex );

    // This function changes course to the next closest unoccupied cell.
    var changeCourse = function() {

      // find another unoccupied cell
      unitRates.log && unitRates.log( 'cell ' + cellIndex + ' is occupied, trying another cell' );
      var newCellIndex = bagRow.getClosestUnoccupiedCell( bag.locationProperty.value );
      assert && assert( newCellIndex !== -1, 'all cells are occupied' );

      beginAnimation( bag, newCellIndex, bagRow );
    };

    // This function is called on each animation step.
    // If the target cell becomes occupied, change course immediately.
    var animationStepCallback = function() {
      if ( !bagRow.isEmptyCell( cellIndex ) ) {
        changeCourse();
      }
    };

    //TODO if bag.items, replace the bag with the items that it contains
    // This function is called when animation completes.
    // If the target cell is still empty, add the bag. Otherwise animate to an unoccupied cell.
    var animationCompletedCallback = function() {
      if ( bagRow.isEmptyCell( cellIndex ) ) {

        // the cell is still empty when we reach it, put the bag in that cell
        bagRow.put( bag, cellIndex );
      }
      else {

        // the cell is occupied, try another cell
        changeCourse();
      }
    };

    // begin the animation
    bag.animateTo( cellLocation, {
      animationStepCallback: animationStepCallback,
      animationCompletedCallback: animationCompletedCallback
    } );
  }

  return inherit( SimpleDragHandler, BagDragHandler );
} );
