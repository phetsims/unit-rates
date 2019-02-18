// Copyright 2017-2019, University of Colorado Boulder

/**
 * View of a shopping bag.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BagDragHandler = require( 'UNIT_RATES/shopping/view/BagDragHandler' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );

  /**
   * @param {Bag} bag
   * @param {Shelf} shelf
   * @param {Scale} scale
   * @param {Node} bagLayer
   * @param {Node} dragLayer
   * @constructor
   */
  function BagNode( bag, shelf, scale, bagLayer, dragLayer ) {

    var self = this;

    // This type does not propagate options to the supertype because the model determines location.
    Image.call( this, bag.image, {
      scale: URConstants.BAG_IMAGE_SCALE,
      cursor: 'pointer'
    } );

    // origin is at bottom center
    var locationObserver = function( location ) {
      self.centerX = location.x;
      self.bottom = location.y;
    };
    bag.locationProperty.link( locationObserver ); // unlink in dispose

    var visibleObserver = function( visible ) {
      self.visible = visible;
    };
    bag.visibleProperty.link( visibleObserver ); // unlink in dispose

    var dragHandler = new BagDragHandler( this, bag, shelf, scale, bagLayer, dragLayer );
    this.addInputListener( dragHandler );

    // @private
    this.disposeBagNode = function() {
      bag.locationProperty.unlink( locationObserver );
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
