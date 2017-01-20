// Copyright 2017, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var Image = require( 'SCENERY/nodes/Image' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Bag} bag
   * @constructor
   */
  function BagNode( bag ) {

    var self = this;

    // This type does not propagate options to the supertype because the model determines location.
    Image.call( this, bag.image, {
      scale: 0.5,
      cursor: 'pointer'
    } );

    // origin is at bottom center
    var locationObserver = function( location ) {
      self.centerX = location.x;
      self.bottom = location.y;
    };
    bag.locationProperty.link( locationObserver ); // must be unlinked in dispose

    this.addInputListener( {
      //TODO add drag handler to BagNode
    } );

    // @private
    this.disposeBagNode = function() {
      bag.locationProperty.unlink( locationObserver );
    };
  }

  unitRates.register( 'BagNode', BagNode );

  return inherit( Image, BagNode, {

    // @public
    dispose: function() {
      this.disposeBagNode();
    }
  } );
} );
