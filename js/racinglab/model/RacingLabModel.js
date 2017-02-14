// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DoubleNumberLine = require( 'UNIT_RATES/common/model/DoubleNumberLine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MarkerEditor = require( 'UNIT_RATES/common/model/MarkerEditor' );
  var Property = require( 'AXON/Property' );
  var RaceCar = require( 'UNIT_RATES/racinglab/model/RaceCar' );
  var RaceTrack = require( 'UNIT_RATES/racinglab/model/RaceTrack' );
  var Range = require( 'DOT/Range' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var blueCarImage = require( 'image!UNIT_RATES/blue_car.png' );
  var redCarImage = require( 'image!UNIT_RATES/red_car.png' );

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var milesString = require( 'string!UNIT_RATES/miles' );

  // options common to both double number lines
  var DOUBLE_NUMBER_LINE_OPTIONS = {
    numeratorOptions: {
      axisLabel: milesString,
      maxDigits: 5,
      maxDecimals: 2,
      trimZeros: true
    },
    denominatorOptions: {
      axisLabel: hoursString,
      maxDigits: 4,
      maxDecimals: 2,
      trimZeros: true
    },

    // Numerator axis is fixed at 200 miles, so we will mutate the denominator (hours) when rate changes
    fixedAxis: 'numerator',
    fixedAxisRange: new Range( 0, 200 ),

    // Specifies the interval for major markers
    isMajorMarker: function( numerator, denominator ) {
      return ( numerator % 25 === 0 );
    }
  };

  // options common to both marker editors
  var MARKER_EDITOR_OPTIONS = {
    numeratorMaxDecimals: DOUBLE_NUMBER_LINE_OPTIONS.numeratorOptions.maxDecimals,
    denominatorMaxDecimals: DOUBLE_NUMBER_LINE_OPTIONS.denominatorOptions.maxDecimals
  };

  /**
   * @constructor
   */
  function RacingLabModel() {

    // @public is the race running?
    this.runningProperty = new Property( false );

    // @public the red (top) car
    this.car1 = new RaceCar( redCarImage );

    // @public the blue (bottom) car
    this.car2 = new RaceCar( blueCarImage, { visible: false } );

    // @public
    this.track1 = new RaceTrack();
    this.track2 = new RaceTrack();

    // @public
    this.timeProperty1 = new Property( 0 );
    this.timeProperty2 = new Property( 0 );

    // @public
    this.doubleNumberLine1 = new DoubleNumberLine( this.car1.rate.unitRateProperty, DOUBLE_NUMBER_LINE_OPTIONS );
    this.doubleNumberLine2 = new DoubleNumberLine( this.car2.rate.unitRateProperty, DOUBLE_NUMBER_LINE_OPTIONS );

    // @public
    this.markerEditor1 = new MarkerEditor( this.car1.rate.unitRateProperty, MARKER_EDITOR_OPTIONS );
    this.markerEditor2 = new MarkerEditor( this.car2.rate.unitRateProperty, MARKER_EDITOR_OPTIONS );

    // Reset the race when any of the specified Properties changes
    Property.lazyMultilink( [

        // changed via the scene radio buttons
        this.car2.visibleProperty,

        // changed via the Rate spinners
        this.car1.rate.numeratorProperty,
        this.car1.rate.denominatorProperty,
        this.car2.rate.numeratorProperty,
        this.car2.rate.denominatorProperty,

        // changed by dragging the finish line flags
        this.track1.lengthProperty,
        this.track2.lengthProperty
      ],
      this.resetRace.bind( this ) );
  }

  unitRates.register( 'RacingLabModel', RacingLabModel );

  return inherit( Object, RacingLabModel, {

    // @public
    step: function( dt ) {
      if ( this.runningProperty.value ) {
        this.car1.step( dt );
        this.car2.step( dt );
        //TODO update timeProperty1 (and timeProperty2 ?)
      }
    },

    // @public
    reset: function() {
      this.runningProperty.reset();
      this.car1.reset();
      this.car2.reset();
      this.track1.reset();
      this.track2.reset();
      this.timeProperty1.reset();
      this.timeProperty2.reset();
      this.doubleNumberLine1.reset();
      this.doubleNumberLine2.reset();
      this.markerEditor1.reset();
      this.markerEditor2.reset();
    },

    // @private resets the race
    resetRace: function() {

      // stop the race
      this.runningProperty.value = false;

      // return cars to starting line
      this.car1.distanceProperty.value = 0;
      this.car2.distanceProperty.value = 0;
      
      // reset the timers
      this.timeProperty1.reset();
      this.timeProperty2.reset();
    }
  } );
} );
