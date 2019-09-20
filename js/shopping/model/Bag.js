// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model of a bag that contains shopping items.
 * Origin is at the bottom center of the bag.
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
   * @param {HTMLImageElement} image - image used by the view to represent this bag
   * @param {Object} [options]
   * @constructor
   */
  function Bag( name, image, options ) {

    options = _.extend( {

      visible: true, // {boolean} is the bag initially visible?

      // {ShoppingItem[]|null} items in the bag, null means the bag does not open when placed on the scale
      items: null,

      // URMovable options
      animationSpeed: 400 // distance/second

    }, options );

    // @public (read-only)
    this.name = name;
    this.image = image;
    this.items = options.items;

    // @public
    this.visibleProperty = new BooleanProperty( options.visible );

    URMovable.call( this, options );
  }

  unitRates.register( 'Bag', Bag );

  return inherit( URMovable, Bag, {

    // @public
    reset: function() {
      this.visibleProperty.reset();
      URMovable.prototype.reset.call( this );
    }
  } );
} );
