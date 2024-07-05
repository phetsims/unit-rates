// Copyright 2017-2023, University of Colorado Boulder

/**
 * View of a shopping bag.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Image, Node } from '../../../../scenery/js/imports.js';
import URConstants from '../../common/URConstants.js';
import unitRates from '../../unitRates.js';
import BagDragListener from './BagDragListener.js';
import Bag from '../model/Bag.js';
import Shelf from '../model/Shelf.js';
import Scale from '../model/Scale.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class BagNode extends Image {

  private readonly disposeBagNode: () => void;

  public constructor( bag: Bag, shelf: Shelf, scale: Scale, bagLayer: Node, dragLayer: Node ) {

    // This type does not propagate options to the supertype because the model determines position.
    super( bag.image, {
      scale: URConstants.BAG_IMAGE_SCALE,
      cursor: 'pointer'
    } );

    // origin is at bottom center
    const positionObserver = ( position: Vector2 ) => {
      this.centerX = position.x;
      this.bottom = position.y;
    };
    bag.positionProperty.link( positionObserver ); // unlink in dispose

    const visibleObserver = ( visible: boolean ) => {
      this.visible = visible;
    };
    bag.visibleProperty.link( visibleObserver ); // unlink in dispose

    const dragListener = new BagDragListener( this, bag, shelf, scale, bagLayer, dragLayer );
    this.addInputListener( dragListener ); // removeInputListener in dispose

    this.disposeBagNode = () => {
      bag.positionProperty.unlink( positionObserver );
      bag.visibleProperty.unlink( visibleObserver );
      this.removeInputListener( dragListener );
      dragListener.dispose();
    };
  }

  public override dispose(): void {
    this.disposeBagNode();
    super.dispose();
  }
}

unitRates.register( 'BagNode', BagNode );