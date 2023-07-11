// Copyright 2017-2023, University of Colorado Boulder

/**
 * Drag handler for bags.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { DragListener, Node } from '../../../../scenery/js/imports.js';
import unitRates from '../../unitRates.js';
import Scale from '../model/Scale.js';
import BagNode from './BagNode.js';
import Bag from '../model/Bag.js';
import Shelf from '../model/Shelf.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ShoppingContainer from '../model/ShoppingContainer.js';

export default class BagDragListener extends DragListener {

  public constructor( bagNode: BagNode, bag: Bag, shelf: Shelf, scale: Scale, bagLayer: Node, dragLayer: Node ) {

    // where the drag started relative to the bag's position, in parent view coordinates
    let startDragOffset: Vector2;

    super( {

      // allow touch swipes across a bag to pick it up
      allowTouchSnag: true,

      // Called when a drag sequence starts.
      start: event => {

        // prerequisites for the drag sequence
        assert && assert( bagLayer.hasChild( bagNode ) );
        assert && assert( !( shelf.containsBag( bag ) && scale.containsBag( bag ) ),
          'bag should not be on both shelf and scale' );

        // move Node to the drag layer, so that it pops to the front
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

        // compute the offset between the pointer and the bag's position
        startDragOffset = bagNode.globalToParentPoint( event.pointer.point ).minus( bag.positionProperty.value );
      },

      // Called when the pointer moves during a drag sequence.
      drag: event => {

        // move the bag immediately while dragging
        bag.moveTo( bagNode.globalToParentPoint( event.pointer.point ).minus( startDragOffset ) );
      },

      // Called when a drag sequence ends.
      end: () => {

        // return Node to bag layer
        bag.dragging = false;
        dragLayer.removeChild( bagNode );
        bagLayer.addChild( bagNode );

        // if the bag is released above the scale, bag falls to scale, otherwise to shelf.
        if ( bag.positionProperty.value.y < scale.yAboveScale ) {
          animateBagToContainer( bag, scale );
        }
        else {
          animateBagToContainer( bag, shelf );
        }
      }
    } );
  }
}

/**
 * Animates a bag to the closest unoccupied cell in a container.
 * The animation will change course immediately if the specified cell becomes occupied.
 */
function animateBagToContainer( bag: Bag, container: ShoppingContainer ): void {

  const cellIndex = container.bagRow.getClosestUnoccupiedCell( bag.positionProperty.value );
  assert && assert( cellIndex !== -1, 'container is full' );

  // This function changes course to the next closest unoccupied cell.
  const changeCourse = () => {
    phet.log && phet.log( `cell ${cellIndex} is occupied, trying another cell` );
    animateBagToContainer( bag, container );
  };

  // This function is called on each animation step.
  // If the target cell becomes occupied, change course immediately.
  const animationStepCallback = () => {
    if ( !container.bagRow.isEmptyCell( cellIndex ) ) {
      changeCourse();
    }
  };

  // This function is called when animation completes.
  // If the target cell is still empty, add the bag. Otherwise animate to an unoccupied cell.
  const animationCompletedCallback = () => {

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

  const destination = container.bagRow.getCellPosition( cellIndex ); // {Vector2}

  // begin the animation
  bag.animateTo( destination, {
    animationStepCallback: animationStepCallback,
    animationCompletedCallback: animationCompletedCallback
  } );
}

/**
 * Replaces a bag with individual items on the scale.
 */
function replaceBagWithItems( bag: Bag, scale: Scale ): void {

  const items = bag.items!;
  assert && assert( items );

  // replace bag with items
  bag.visibleProperty.value = false;

  // items will be placed in cells that are closest to the bag's position
  const bagPosition = bag.positionProperty.value;

  for ( let i = 0; i < items.length; i++ ) {

    // Update scale quantity only for the last item.
    // This effectively makes the addition of items atomic, resulting in only 1 marker created.
    scale.quantityUpdateEnabled = ( i === items.length - 1 );

    const item = items[ i ];

    // find closest cells in front and back rows
    const backCellIndex = scale.backItemRow.getClosestUnoccupiedCell( bagPosition );
    const frontCellIndex = scale.frontItemRow.getClosestUnoccupiedCell( bagPosition );
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
      const backCellDistance = bagPosition.distance( scale.backItemRow.getCellPosition( backCellIndex ) );
      const frontCellDistance = bagPosition.distance( scale.frontItemRow.getCellPosition( frontCellIndex ) );
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

unitRates.register( 'BagDragListener', BagDragListener );