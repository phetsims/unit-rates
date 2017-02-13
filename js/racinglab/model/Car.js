// Copyright 2017, University of Colorado Boulder

/**
 * Model of a car in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Rate = require( 'UNIT_RATES/common/model/Rate' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {HTMLImageElement} image
   * @param {Object} [options]
   * @constructor
   */
  function Car( image, options ) {

    options = _.extend( {
      rate: new Rate( 50, 2 ), // initial rate, in miles per hour
      visible: true // is this car visible?
    }, options );

    // @pubic (read-only)
    this.image = image;

    // @public the car's rate, in miles per hour
    this.rate = options.rate;

    // @public the car's distance from the starting line, in miles
    this.distancePropery = new Property( 0 );

    // @public is this car visible?
    this.visibleProperty = new Property( options.visible );
  }

  unitRates.register( 'Car', Car );

  return inherit( Object, Car, {

    // @public
    reset: function() {
      this.rate.reset();
      this.distancePropery.reset();
      this.visibleProperty.reset();
    },

    // @public
    step: function( dt ) {
      if ( this.visibleProperty.value ) {
        this.distancePropery.value = this.distancePropery.value + 1; //TODO implement Car.step, this is temporary
      }
    }
  } );
} );