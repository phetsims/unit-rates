// Copyright 2017, University of Colorado Boulder

/**
 * Model of a car in the 'Racing Lab' screen.
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
  var RaceTrack = require( 'UNIT_RATES/racinglab/model/RaceTrack' );
  var Range = require( 'DOT/Range' );
  var Rate = require( 'UNIT_RATES/common/model/Rate' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Util = require( 'DOT/Util' );

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var milesString = require( 'string!UNIT_RATES/miles' );

  /**
   * @param {HTMLImageElement} image
   * @param {Object} [options]
   * @constructor
   */
  function RaceCar( image, options ) {

    options = _.extend( {
      rate: new Rate( 50, 2 ), // initial rate, in miles per hour
      visible: true, // is this car visible?
      numeratorMaxDecimals: 2,
      denominatorMaxDecimals: 2,
      majorMarkerSpacing: 25
    }, options );

    // @pubic (read-only)
    this.image = image;

    // @public the car's rate, in miles per hour
    this.rate = options.rate;

    // @public the car's distance from the starting line, in miles
    this.distanceProperty = new Property( 0 );

    // @public is this car visible?
    this.visibleProperty = new Property( options.visible );

    // @public timer for this car
    this.timeProperty = new Property( 0 );

    // @public
    this.track = new RaceTrack();

    // @public
    this.doubleNumberLine = new DoubleNumberLine( this.rate.unitRateProperty, {
      numeratorOptions: {
        axisLabel: milesString,
        maxDigits: 5,
        maxDecimals: options.numeratorMaxDecimals,
        trimZeros: true
      },
      denominatorOptions: {
        axisLabel: hoursString,
        maxDigits: 4,
        maxDecimals: options.denominatorMaxDecimals,
        trimZeros: true
      },

      // Numerator axis is fixed at 200 miles, so we will mutate the denominator (hours) when rate changes
      fixedAxis: 'numerator',
      fixedAxisRange: new Range( 0, 200 ),

      // Specifies the interval for major markers
      isMajorMarker: function( numerator, denominator ) {
        return ( numerator % options.majorMarkerSpacing === 0 );
      }
    } );

    // @public
    this.markerEditor = new MarkerEditor( this.rate.unitRateProperty, {
      numeratorMaxDecimals: options.numeratorMaxDecimals,
      denominatorMaxDecimals: options.denominatorMaxDecimals
    } );
  }

  unitRates.register( 'RaceCar', RaceCar );

  return inherit( Object, RaceCar, {

    // @public
    reset: function() {
      this.rate.reset();
      this.distanceProperty.reset();
      this.visibleProperty.reset();
      this.timeProperty.reset();
      this.track.reset();
      this.doubleNumberLine.reset();
      this.markerEditor.reset();
    },

    // @public
    resetRace: function() {
      this.distanceProperty.reset();
      this.timeProperty.reset();
    },

    /**
     * Is the car at the finish line?
     * @returns {boolean}
     * @public
     */
    isAtFinish: function() {
      return ( this.distanceProperty.value === this.track.lengthProperty.value );
    },

    /**
     * Updates the car and timer.
     * @param {number} dt - elapsed time since previous call to step, in seconds
     */
    step: function( dt ) {
      if ( this.visibleProperty.value && ( this.distanceProperty.value < this.track.lengthProperty.value ) ) {

        // race time, in hours. 
        // 1 sec of sim time is equivalent to 8 hours of race time.
        // see https://github.com/phetsims/unit-rates/issues/95
        var deltaRaceTime = Util.linear( 0, 1, 0, 8, dt );

        // distance traveled, in miles
        var deltaDistance = deltaRaceTime * this.rate.unitRateProperty.value;

        if ( this.distanceProperty.value + deltaDistance >= this.track.lengthProperty.value ) {

          // car has reached the finish line
          this.distanceProperty.value = this.track.lengthProperty.value;
          this.timeProperty.value = this.track.lengthProperty.value / this.rate.unitRateProperty.value;
          //TODO emit raceFinished
        }
        else {

          // move incrementally
          this.distanceProperty.value = this.distanceProperty.value + deltaDistance;
          this.timeProperty.value = this.timeProperty.value + deltaRaceTime;
        }
      }
    }
  } );
} );