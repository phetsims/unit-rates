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
  var Car = require( 'UNIT_RATES/racinglab/model/Car' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RacingLabModel( options ) {

    options = _.extend( {
      car2Visible: false // {boolean} is car2 initially visible?
    }, options );

    // @public number of cars that are racing
    this.car2VisibleProperty = new Property( options.car2Visible );

    // @public is the race running?
    this.runningProperty = new Property( false );

    // @public
    this.car1 = new Car(); // the red (top) car
    this.car2 = new Car(); // the blue (bottom) car
  }

  unitRates.register( 'RacingLabModel', RacingLabModel );

  return inherit( Object, RacingLabModel, {

    // @public
    step: function( dt ) {
      //TODO implement step for RacingLabModel
    },

    // @public
    reset: function() {
      this.car2VisibleProperty.reset();
      this.runningProperty.reset();
      this.car1.reset();
      this.car2.reset();
    }
  } );
} );
