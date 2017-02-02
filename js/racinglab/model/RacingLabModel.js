// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RacingLabModel( options ) {

    options = _.extend( {
      numberOfCars: 1
    }, options );

    // @public number of cars that are racing
    this.numberOfCarsProperty = new Property( options.numberOfCars );
    this.numberOfCarsProperty.link( function( numberOfCars ) {
      assert && assert( numberOfCars === 1 || numberOfCars === 2, 'invalid numberOfCars: ' + numberOfCars );
    } );

    // @public is the race running?
    this.runningProperty = new Property( false );
  }

  unitRates.register( 'RacingLabModel', RacingLabModel );

  return inherit( Object, RacingLabModel, {

    // @public
    step: function( dt ) {
      //TODO
    },

    // @public
    reset: function() {
      this.numberOfCarsProperty.reset();
      this.runningProperty.reset();
    }
  } );
} );
