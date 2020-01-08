// Copyright 2017-2020, University of Colorado Boulder

/**
 * View of a shopping bag.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BagDragHandler = require( 'UNIT_RATES/shopping/view/BagDragHandler' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URConstants = require( 'UNIT_RATES/common/URConstants' );

  /**
   * @param {Bag} bag
   * @param {Shelf} shelf
   * @param {Scale} scale
   * @param {Node} bagLayer
   * @param {Node} dragLayer
   * @constructor
   */
  function BagNode( bag, shelf, scale, bagLayer, dragLayer ) {

    const self = this;

    // This type does not propagate options to the supertype because the model determines position.
    Image.call( this, bag.image, {
      scale: URConstants.BAG_IMAGE_SCALE,
      cursor: 'pointer'
    } );

    // origin is at bottom center
    const positionObserver = function( position ) {
      self.centerX = position.x;
      self.bottom = position.y;
    };
    bag.positionProperty.link( positionObserver ); // unlink in dispose

    const visibleObserver = function( visible ) {
      self.visible = visible;
    };
    bag.visibleProperty.link( visibleObserver ); // unlink in dispose

    const dragHandler = new BagDragHandler( this, bag, shelf, scale, bagLayer, dragLayer );
    this.addInputListener( dragHandler );

    // @private
    this.disposeBagNode = function() {
      bag.positionProperty.unlink( positionObserver );
      bag.visibleProperty.unlink( visibleObserver );
      self.removeInputListener( dragHandler );
    };

    // @private used by prototype functions
    this.bag = bag;
  }

  unitRates.register( 'BagNode', BagNode );

  return inherit( Image, BagNode, {

    // @public
    dispose: function() {
      this.disposeBagNode();
      Image.prototype.dispose.call( this );
    }
  } );
} );
