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
  var Scale = require( 'UNIT_RATES/shopping/model/Scale' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {BagNode} bagNode
   * @param {Bag} bag
   * @param {Shelf} shelf
   * @param {Scale} scale
   * @param {Node} bagLayer
   * @param {Node} dragLayer
   * @constructor
   */
  function BagDragHandler( bagNode, bag, shelf, scale, bagLayer, dragLayer ) {

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
        assert && assert( bagLayer.hasChild( bagNode ) );
        assert && assert( !( shelf.containsBag( bag ) && scale.containsBag( bag ) ),
          'bag should not be on both shelf and scale' );

        // move Node to the drag layer
        bag.dragging = true;
        bagLayer.removeChild( bagNode );
        dragLayer.addChild( bagNode );

        // remove bag from shelf or scale
        if ( shelf.containsBag( bag ) ) {
          shelf.removeBag( bag );
        }
        else if ( scale.containsBag( bag ) ) {
          scale.removeBag( bag );
        }
        else {
          // bag was grabbed while animating
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

        // return Node to bag layer
        bag.dragging = false;
        dragLayer.removeChild( bagNode );
        bagLayer.addChild( bagNode );

        // is the bag above the scale?
        var isAboveScale = ( bag.locationProperty.value.y < scale.location.y + ( scale.depth / 2 ) );

        // if the bag is released above the scale, bag falls to scale, otherwise to shelf.
        if ( isAboveScale ) {
          animateBagToContainer( bag, scale );
        }
        else {
          animateBagToContainer( bag, shelf );
        }
      }
    } );
  }

  unitRates.register( 'BagDragHandler', BagDragHandler );

  /**
   * Animates a bag to the closest unoccupied cell in a container.
   * The animation will change course immediately if the specified cell becomes occupied.
   * @param {Bag} bag
   * @param {ShoppingContainer} container
   * @private
   */
  function animateBagToContainer( bag, container ) {

    var cellIndex = container.bagRow.getClosestUnoccupiedCell( bag.locationProperty.value );
    assert && assert( cellIndex !== -1, 'container is full' );

    // This function changes course to the next closest unoccupied cell.
    var changeCourse = function() {
      unitRates.log && unitRates.log( 'cell ' + cellIndex + ' is occupied, trying another cell' );
      animateBagToContainer( bag, container );
    };

    // This function is called on each animation step.
    // If the target cell becomes occupied, change course immediately.
    var animationStepCallback = function() {
      if ( !container.bagRow.isEmptyCell( cellIndex ) ) {
        changeCourse();
      }
    };

    // This function is called when animation completes.
    // If the target cell is still empty, add the bag. Otherwise animate to an unoccupied cell.
    var animationCompletedCallback = function() {

      if ( bag.items && ( container instanceof Scale ) ) {

        // replace the bag with individual items on the scale
        replaceBagWithItems( bag, container );
      }
      else if ( container.bagRow.isEmptyCell( cellIndex ) ) {

        // the cell is still unoccupied when we reached it, put the bag in that cell
        container.bagRow.put( bag, cellIndex );
      }
      else {

        // the cell is occupied, try another cell
        changeCourse();
      }
    };

    var destination = container.bagRow.getCellLocation( cellIndex ); // {Vector2}

    // begin the animation
    bag.animateTo( destination, {
      animationStepCallback: animationStepCallback,
      animationCompletedCallback: animationCompletedCallback
    } );
  }

  /**
   * Replaces a bag with individual items on the scale.
   * @param {Bag} bag
   * @param {Scale} scale
   */
  function replaceBagWithItems( bag, scale ) {

    assert && assert( scale instanceof Scale );

    // replace bag with items
    bag.visibleProperty.value = false;

    // items will be placed in cells that are closest to the bag's location
    var bagLocation = bag.locationProperty.value;

    for ( var i = 0; i < bag.items.length; i++ ) {

      // Update scale quantity only for the last item.
      // This effectively makes the addition of items atomic, resulting in only 1 marker created.
      scale.quantityUpdateEnabled = ( i === bag.items.length - 1 );

      var item = bag.items[ i ];

      // find closest cells in front and back rows
      var backCellIndex = scale.backItemRow.getClosestUnoccupiedCell( bagLocation );
      var frontCellIndex = scale.frontItemRow.getClosestUnoccupiedCell( bagLocation );
      assert && assert( !( backCellIndex === -1 && frontCellIndex === -1 ), 'scale is full' );

      // move immediately to closest cell
      if ( backCellIndex === -1 ) {

        // back row is full, put in front row
        scale.frontItemRow.put( item, frontCellIndex );
      }
      else if ( frontCellIndex === -1 ) {

        // front row is full, put in back row
        scale.backItemRow.put( item, backCellIndex );
      }
      else {

        // compare distance between front and back row, put in closest
        var backCellDistance = bagLocation.distance( scale.backItemRow.getCellLocation( backCellIndex ) );
        var frontCellDistance = bagLocation.distance( scale.frontItemRow.getCellLocation( frontCellIndex ) );
        if ( frontCellDistance < backCellDistance ) {
          scale.frontItemRow.put( item, frontCellIndex );
        }
        else {
          scale.backItemRow.put( item, backCellIndex );
        }
      }

      item.visibleProperty.value = true;
    }
  }

  return inherit( SimpleDragHandler, BagDragHandler );
} );
