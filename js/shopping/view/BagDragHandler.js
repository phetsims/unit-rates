// Copyright 2017, University of Colorado Boulder

/**
 * Drag handler for bags.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // sim modules
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

    //TODO handle cancellation of drag sequence
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
        assert && assert( !( shelf.contains( bag ) && scale.contains( bag ) ),
          'bag should not be on both shelf and scale' );

        bag.dragging = true;

        // remove bag from shelf or scale
        if ( shelf.contains( bag ) ) {
          shelf.removeBag( bag );
        }
        else if ( scale.contains( bag ) ) {
          scale.removeBag( bag );
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

        // closest cell on the shelf
        var shelfCellIndex = shelf.getClosestUnoccupiedCell( bag.locationProperty.value );
        assert && assert( shelfCellIndex !== -1, 'shelf is full' );
        var distanceToShelf = shelf.getDistanceBetween( shelfCellIndex, bag.locationProperty.value );

        // closest cell on the scale
        var scaleCellIndex = scale.getClosestUnoccupiedCell( bag.locationProperty.value );
        assert && assert( scaleCellIndex !== -1, 'scale is full' );
        var distanceToScale = scale.getDistanceBetween( scaleCellIndex, bag.locationProperty.value );

        // is the bag closer to the shelf or the scale?
        if ( distanceToShelf < distanceToScale ) {

          // animate to shelf
          unitRates.log && unitRates.log( 'animating to shelf cell ' + shelfCellIndex );
          beginAnimation( bag, shelfCellIndex, shelf );
        }
        else {

          // animate to scale
          unitRates.log && unitRates.log( 'animating to scale cell ' +  scaleCellIndex );
          beginAnimation( bag, scaleCellIndex, scale );
        }
      }
    } );
  }

  unitRates.register( 'BagDragHandler', BagDragHandler );

  /**
   * Begins the animation of a bag to a specified cell in a bag container.
   * The animation will change course immediately if the specified cell becomes occupied.
   * @param {Bag} bag
   * @param {number} cellIndex
   * @param {BagContainer} bagContainer
   * @private
   */
  function beginAnimation( bag, cellIndex, bagContainer ) {

    var cellLocation = bagContainer.getLocationAt( cellIndex );

    // This function changes course to the next closest unoccupied cell.
    var changeCourse = function() {

      // find another unoccupied cell
      unitRates.log && unitRates.log( 'cell ' + cellIndex + ' is occupied, trying another cell' );
      cellIndex = bagContainer.getClosestUnoccupiedCell( bag.locationProperty.value );
      assert && assert( cellIndex !== -1, 'all cells are occupied' );
      cellLocation = bagContainer.getLocationAt( cellIndex );

      // call bind, so that we have new function instances, otherwise the callbacks will be ignored
      bag.animateTo( cellLocation, {
        animationStepCallback: animationStepCallback.bind( this ),
        animationCompletedCallback: animationCompletedCallback.bind( this )
      } );
    };

    // This function is called on each animation step.
    // If the target cell becomes occupied, change course immediately.
    var animationStepCallback = function() {
      if ( !bagContainer.isEmpty( cellIndex ) ) {
        changeCourse();
      }
    };

    // This function is called when animation completes.
    // If the target cell is still empty, add the bag. Otherwise animate to an unoccupied cell.
    var animationCompletedCallback = function() {
      if ( bagContainer.isEmpty( cellIndex ) ) {

        // the cell is still empty when we reach it, put the bag in that cell
        bagContainer.addBag( bag, cellIndex );
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
