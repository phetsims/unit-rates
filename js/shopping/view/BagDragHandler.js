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

        bag.dragging = false;
        dragLayer.removeChild( bagNode );
        bagLayer.addChild( bagNode );

        // if the bag is released above the scale's surface ...
        if ( bag.locationProperty.value.y < scale.location.y + ( scale.depth / 2 ) ) {

          // find closest cell on the scale
          var scaleCellIndex = scale.bagRow.getClosestUnoccupiedCell( bag.locationProperty.value );
          assert && assert( scaleCellIndex !== -1, 'scale is full' );

          // animate to scale
          unitRates.log && unitRates.log( 'animating to scale cell ' + scaleCellIndex );
          beginAnimationToScale( bag, scale, scaleCellIndex );
        }
        else {

          // find closest cell on the shelf
          var shelfCellIndex = shelf.bagRow.getClosestUnoccupiedCell( bag.locationProperty.value );
          assert && assert( shelfCellIndex !== -1, 'shelf is full' );

          // animate to shelf
          unitRates.log && unitRates.log( 'animating to shelf cell ' + shelfCellIndex );
          beginAnimationToShelf( bag, shelf, shelfCellIndex );
        }
      }
    } );
  }

  unitRates.register( 'BagDragHandler', BagDragHandler );

  /**
   * Begins the animation of a bag to a specified cell (on shelf or scale).
   * The animation will change course immediately if the specified cell becomes occupied.
   * @param {Bag} bag
   * @param {Scale} scale
   * @param {number} cellIndex
   * @private
   */
  function beginAnimationToScale( bag, scale, cellIndex ) {

    var cellLocation = scale.bagRow.getCellLocation( cellIndex );

    // This function changes course to the next closest unoccupied cell.
    var changeCourse = function() {

      // find another unoccupied cell
      unitRates.log && unitRates.log( 'cell ' + cellIndex + ' is occupied, trying another cell' );
      var newCellIndex = scale.bagRow.getClosestUnoccupiedCell( bag.locationProperty.value );
      assert && assert( newCellIndex !== -1, 'all cells are occupied' );

      beginAnimationToScale( bag, scale, newCellIndex );
    };

    // This function is called on each animation step.
    // If the target cell becomes occupied, change course immediately.
    var animationStepCallback = function() {
      if ( !scale.bagRow.isEmptyCell( cellIndex ) ) {
        changeCourse();
      }
    };

    //TODO if bag.items, replace the bag with the items that it contains
    // This function is called when animation completes.
    // If the target cell is still empty, add the bag. Otherwise animate to an unoccupied cell.
    var animationCompletedCallback = function() {

      if ( bag.items ) {

        // replace bag with items
        bag.visibleProperty.value = false;

        for ( var i = 0; i < bag.items.length; i++ ) {

          // Update scale quantity only for the last item.
          // This effectively makes the addition of items atomic, resulting in only 1 marker created.
          scale.quantityUpdateEnabled = ( i === bag.items.length - 1 );

          var item = bag.items[ i ];

          // find closest cells in front and back rows
          var backCellIndex = scale.backItemRow.getClosestUnoccupiedCell( cellLocation );
          var frontCellIndex = scale.frontItemRow.getClosestUnoccupiedCell( cellLocation );
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
            var backCellDistance = item.locationProperty.value.distance( scale.backItemRow.getCellLocation( backCellIndex ) );
            var frontCellDistance = item.locationProperty.value.distance( scale.frontItemRow.getCellLocation( frontCellIndex ) );
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
      else if ( scale.bagRow.isEmptyCell( cellIndex ) ) {

        // the cell is still empty when we reach it, put the bag in that cell
        scale.bagRow.put( bag, cellIndex );
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

  //TODO beginAnimationToShelf and beginAnimationToScale contain duplicate code
  /**
   * Begins the animation of a bag to a specified cell on the shelf.
   * The animation will change course immediately if the specified cell becomes occupied.
   * @param {Bag} bag
   * @param {Shelf} shelf
   * @param {number} cellIndex
   * @private
   */
  function beginAnimationToShelf( bag, shelf, cellIndex ) {

    var cellLocation = shelf.bagRow.getCellLocation( cellIndex );

    // This function changes course to the next closest unoccupied cell.
    var changeCourse = function() {

      // find another unoccupied cell
      unitRates.log && unitRates.log( 'cell ' + cellIndex + ' is occupied, trying another cell' );
      var newCellIndex = shelf.bagRow.getClosestUnoccupiedCell( bag.locationProperty.value );
      assert && assert( newCellIndex !== -1, 'all cells are occupied' );

      beginAnimationToShelf( bag, shelf, newCellIndex );
    };

    // This function is called on each animation step.
    // If the target cell becomes occupied, change course immediately.
    var animationStepCallback = function() {
      if ( !shelf.bagRow.isEmptyCell( cellIndex ) ) {
        changeCourse();
      }
    };

    // This function is called when animation completes.
    // If the target cell is still empty, add the bag. Otherwise animate to an unoccupied cell.
    var animationCompletedCallback = function() {

      if ( shelf.bagRow.isEmptyCell( cellIndex ) ) {

        // the cell is still empty when we reach it, put the bag in that cell
        shelf.bagRow.put( bag, cellIndex );
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
