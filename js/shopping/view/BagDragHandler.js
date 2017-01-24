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

      start: function( event, trail ) {

        // prerequisites of the drag sequence
        assert && assert( shelf.containsBag( bag ) || scale.containsBag( bag ),
          'bag should be on shelf or scale' );
        assert && assert( !( shelf.containsBag( bag ) && scale.containsBag( bag ) ),
          'bag should not be on both shelf and scale' );

        // compute the offset between the pointer and the bag's location
        startDragOffset = bagNode.globalToParentPoint( event.pointer.point ).minus( bag.locationProperty.value );
      },

      drag: function( event, trail ) {

        // move the bag immediately while dragging
        bag.moveTo( bagNode.globalToParentPoint( event.pointer.point ).minus( startDragOffset ) );
      },

      end: function( event, trail ) {

        // disable interaction while animating
        bagNode.pickable = false;

        // enable interaction when animation is completed
        var animationCompletedCallback = function() {
          bagNode.pickable = true;
        };

        // remove from shelf or scale *before* looking for closest cell on shelf or scale
        if ( shelf.containsBag( bag ) ) {
          shelf.removeBag( bag );
        }
        else if ( scale.containsBag( bag ) ) {
          scale.removeBag( bag );
        }

        // find the closest cell on the shelf
        var shelfCellIndex = shelf.getClosestUnoccupiedCell( bag.locationProperty.value.x );
        var shelfCellLocation = shelf.getLocationAt( shelfCellIndex );
        var distanceToShelf = bag.locationProperty.value.distance( shelfCellLocation );

        // find the closest cell on the scale
        var scaleCellIndex = scale.getClosestUnoccupiedCell( bag.locationProperty.value.x );
        var scaleCellLocation = scale.getLocationAt( shelfCellIndex );
        var distanceToScale = bag.locationProperty.value.distance( scaleCellLocation );

        if ( distanceToShelf < distanceToScale ) {

          // animate to shelf
          unitRates.log && unitRates.log( 'animating to shelf' );
          shelf.addBag( bag, shelfCellIndex );
          bag.animateTo( shelfCellLocation, animationCompletedCallback );
        }
        else {

          // animate to scale
          unitRates.log && unitRates.log( 'animating to scale' );
          scale.addBag( bag, scaleCellIndex );
          bag.animateTo( scaleCellLocation, animationCompletedCallback );
        }
      }
    } );

    // @private
    this.disposeBagDragHandler = function() {
      //TODO
    };
  }

  unitRates.register( 'BagDragHandler', BagDragHandler );

  return inherit( SimpleDragHandler, BagDragHandler, {

    // @public
    dispose: function() {
      SimpleDragHandler.prototype.dispose && SimpleDragHandler.prototype.dispose.call( this );
      this.disposeBagDragHandler();
    }
  } );
} );