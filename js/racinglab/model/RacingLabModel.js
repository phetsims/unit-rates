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
  var Range = require( 'DOT/Range' );

  // sim modules
  var Car = require( 'UNIT_RATES/racinglab/model/Car' );
  var DoubleNumberLine = require( 'UNIT_RATES/common/model/DoubleNumberLine' );
  var MarkerEditor = require( 'UNIT_RATES/common/model/MarkerEditor' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var milesString = require( 'string!UNIT_RATES/miles' );

  // constants
  var DOUBLE_NUMBER_LINE_OPTIONS = {
    numeratorOptions: {
      axisLabel: milesString,
      maxDigits: 4,
      maxDecimals: 2,
      trimZeros: true
    },
    denominatorOptions: {
      axisLabel: hoursString,
      maxDigits: 4,
      maxDecimals: 2,
      trimZeros: false,
      axisRange: new Range( 0, 2 ) // range of bottom axis, in hours
    }
  };

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

    // @public
    this.doubleNumberLine1 = new DoubleNumberLine( this.car1.speedProperty, DOUBLE_NUMBER_LINE_OPTIONS );
    this.doubleNumberLine2 = new DoubleNumberLine( this.car1.speedProperty, DOUBLE_NUMBER_LINE_OPTIONS );

    // @public
    this.markerEditor1 = new MarkerEditor( this.car1.speedProperty, {
      //TODO options for MarkerEditor
    } );
    this.markerEditor2 = new MarkerEditor( this.car1.speedProperty, {
      //TODO options for MarkerEditor
    } );
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
      this.doubleNumberLine1.reset();
      this.doubleNumberLine2.reset();
      this.markerEditor1.reset();
      this.markerEditor2.reset();
    }
  } );
} );
