// Copyright 2017, University of Colorado Boulder

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
        assert && assert( shelf.containsBag( bag ) || scale.containsBag( bag ),
          'bag should be on shelf or scale' );
        assert && assert( !( shelf.containsBag( bag ) && scale.containsBag( bag ) ),
          'bag should not be on both shelf and scale' );

        // remove bag from shelf or scale
        if ( shelf.containsBag( bag ) ) {
          shelf.removeBag( bag );
        }
        else if ( scale.containsBag( bag ) ) {
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

        // disable interaction while animating
        bagNode.pickable = false;

        // find the closest cell on the shelf
        var shelfCellIndex = shelf.getClosestUnoccupiedCell( bag.locationProperty.value );
        var shelfCellLocation = shelf.getLocationAt( shelfCellIndex );
        var distanceToShelf = bag.locationProperty.value.distance( shelfCellLocation );

        // find the closest cell on the scale
        var scaleCellIndex = scale.getClosestUnoccupiedCell( bag.locationProperty.value );
        var scaleCellLocation = scale.getLocationAt( scaleCellIndex );
        var distanceToScale = bag.locationProperty.value.distance( scaleCellLocation );

        // closer to the shelf or the scale?
        if ( distanceToShelf < distanceToScale ) {

          // animate to shelf
          unitRates.log && unitRates.log( 'animating to shelf cell ' + shelfCellIndex );
          var shelfAnimationCompletedCallback = function() {
            if ( shelf.isEmpty( shelfCellIndex ) ) {

              // the cell is still empty when we reach it, put the bag in that cell
              bagNode.pickable = true;
              shelf.addBag( bag, shelfCellIndex );
            }
            else {

              // the cell is occupied when we reach it, try another cell
              unitRates.log && unitRates.log( 'shelf cell ' +  shelfCellIndex + ' is occupied, trying another cell' );
              shelfCellIndex = shelf.getClosestUnoccupiedCell( bag.locationProperty.value );
              shelfCellLocation = shelf.getLocationAt( shelfCellIndex );
              bag.animateTo( shelfCellLocation, shelfAnimationCompletedCallback );
            }
          };
          bag.animateTo( shelfCellLocation, shelfAnimationCompletedCallback );
        }
        else {

          // animate to scale
          unitRates.log && unitRates.log( 'animating to scale cell ' +  scaleCellIndex );
          var scaleAnimationCompletedCallback = function() {
            if ( scale.isEmpty( scaleCellIndex ) ) {

              // the cell is still empty when we reach it, put the bag in that cell
              bagNode.pickable = true;
              scale.addBag( bag, scaleCellIndex );
            }
            else {

              // the cell is occupied when we reach it, try another cell
              unitRates.log && unitRates.log( 'scale cell ' +  scaleCellIndex + ' is occupied, trying another cell' );
              scaleCellIndex = scale.getClosestUnoccupiedCell( bag.locationProperty.value );
              scaleCellLocation = scale.getLocationAt( shelfCellIndex );
              bag.animateTo( scaleCellLocation, scaleAnimationCompletedCallback );
            }
          };
          bag.animateTo( scaleCellLocation, scaleAnimationCompletedCallback );
        }
      }
    } );
  }

  unitRates.register( 'BagDragHandler', BagDragHandler );

  return inherit( SimpleDragHandler, BagDragHandler );
} );
