// Copyright 2017-2020, University of Colorado Boulder

/**
 * View of a shopping bag.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import URConstants from '../../common/URConstants.js';
import unitRates from '../../unitRates.js';
import BagDragHandler from './BagDragHandler.js';

class BagNode extends Image {

  /**
   * @param {Bag} bag
   * @param {Shelf} shelf
   * @param {Scale} scale
   * @param {Node} bagLayer
   * @param {Node} dragLayer
   */
  constructor( bag, shelf, scale, bagLayer, dragLayer ) {

    // This type does not propagate options to the supertype because the model determines position.
    super( bag.image, {
      scale: URConstants.BAG_IMAGE_SCALE,
      cursor: 'pointer'
    } );

    // origin is at bottom center
    const positionObserver = position => {
      this.centerX = position.x;
      this.bottom = position.y;
    };
    bag.positionProperty.link( positionObserver ); // unlink in dispose

    const visibleObserver = visible => {
      this.visible = visible;
    };
    bag.visibleProperty.link( visibleObserver ); // unlink in dispose

    const dragHandler = new BagDragHandler( this, bag, shelf, scale, bagLayer, dragLayer );
    this.addInputListener( dragHandler ); // removeInputListener in dispose

    // @private
    this.disposeBagNode = () => {
      bag.positionProperty.unlink( positionObserver );
      bag.visibleProperty.unlink( visibleObserver );
      this.removeInputListener( dragHandler );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeBagNode();
    super.dispose();
  }
}

unitRates.register( 'BagNode', BagNode );

export default BagNode;