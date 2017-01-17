// Copyright 2017, University of Colorado Boulder

/**
 * Model of a bag of shopping items.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var Movable = require( 'UNIT_RATES/common/model/Movable' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {HTMLImageElement} image - image used by the view to represent this bag
   * @param {Object} [options]
   * @constructor
   */
  function Bag( image, options ) {

    options = _.extend( {
      quantity: 4  // {number} quantity that the bag contains
    }, options );

    // @public (read-only)
    this.image = image;
    this.quantity = options.quantity;

    Movable.call( this, options );
  }

  unitRates.register( 'Movable', Movable );

  return inherit( Movable, Bag );
} );
