// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model of a shopping item.
 * Origin is at the bottom center of the item.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URMovable = require( 'UNIT_RATES/common/model/URMovable' );

  /**
   * @param {string} name - for internal use
   * @param {HTMLImageElement} image - image used by the view to represent this item
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItem( name, image, options ) {

    options = _.extend( {
      animationSpeed: 400, // distance/second
      visible: true // {boolean} is the item initially visible?
    }, options );

    // @public (read-only)
    this.name = name;
    this.image = image;

    // @public
    this.visibleProperty = new BooleanProperty( options.visible );

    URMovable.call( this, options );
  }

  unitRates.register( 'ShoppingItem', ShoppingItem );

  return inherit( URMovable, ShoppingItem, {

    // @public
    reset: function() {
      this.visibleProperty.reset();
      URMovable.prototype.reset.call( this );
    }
  } );
} );
