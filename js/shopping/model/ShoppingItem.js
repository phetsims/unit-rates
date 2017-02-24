// Copyright 2017, University of Colorado Boulder

/**
 * Model of a shopping item.
 * Origin is at the bottom center of the item.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URMovable = require( 'UNIT_RATES/common/model/URMovable' );

  /**
   * @param {HTMLImageElement} image - image used by the view to represent this item
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItem( image, options ) {

    // @public (read-only)
    this.image = image;

    URMovable.call( this, options );
  }

  unitRates.register( 'ShoppingItem', ShoppingItem );

  return inherit( URMovable, ShoppingItem );
} );
