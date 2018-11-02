// Copyright 2017, University of Colorado Boulder

/**
 * Model of a race car in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DoubleNumberLine = require( 'UNIT_RATES/common/model/DoubleNumberLine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Marker = require( 'UNIT_RATES/common/model/Marker' );
  var MarkerEditor = require( 'UNIT_RATES/common/model/MarkerEditor' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var RaceTrack = require( 'UNIT_RATES/racinglab/model/RaceTrack' );
  var Range = require( 'DOT/Range' );
  var Rate = require( 'UNIT_RATES/common/model/Rate' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );
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

    var self = this;

    options = _.extend( {
      color: 'black', // {Color|string} color used for things that are associated with the car (markers, spinners, ...)
      rate: new Rate( 50, 2 ), // {Rate} initial rate, in miles per hour
      visible: true, // {boolean} is this car visible?
      trackLength: 200, // {number} length of this car's track
      numeratorMaxDecimals: 1, // {number} decimal places shown for numerator (miles)
      denominatorMaxDecimals: 2, // {number} decimal places shown for denominator (hours)
      majorMarkerSpacing: 25 // {number} spacing for major markers on this car's double number line
    }, options );

    // @public (read-only)
    this.image = image;
    this.color = options.color;
    this.rate = options.rate;

    // @public the car's distance from the starting line, in miles
    this.distanceProperty = new NumberProperty( 0 );

    // @public time for this car, in hours
    this.timeProperty = new NumberProperty( 0 );

    // @public is this car visible?
    this.visibleProperty = new BooleanProperty( options.visible );

    // @public
    this.track = new RaceTrack( { length: options.trackLength } );

    // Specifies the interval for major markers
    var isMajorMarker = function( numerator, denominator ) {
      return ( numerator % options.majorMarkerSpacing === 0 );
    };

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
      isMajorMarker: isMajorMarker
    } );

    // @public
    this.markerEditor = new MarkerEditor( this.rate.unitRateProperty, {
      numeratorMaxDecimals: options.numeratorMaxDecimals,
      denominatorMaxDecimals: options.denominatorMaxDecimals
    } );

    // create a marker when the car reaches the finish line. unlink not needed
    var persistentMarker = null;
    this.distanceProperty.link( function( distance ) {

      // make the current persistent marker erasable
      if ( persistentMarker ) {
        persistentMarker.erasable = true;
        persistentMarker = null;
      }

      // create a marker that is not erasable
      if ( distance === self.track.lengthProperty.value ) {
        persistentMarker = new Marker( distance, self.timeProperty.value, 'race', {
          isMajor: isMajorMarker( distance, self.timeProperty.value ),
          color: self.color,
          erasable: false
        } );
        self.doubleNumberLine.addMarker( persistentMarker );
      }
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

    // @public moves the car to the starting line and resets the time
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
     * @public
     */
    step: function( dt ) {
      if ( this.visibleProperty.value && ( this.distanceProperty.value < this.track.lengthProperty.value ) ) {

        // Map from sim time (seconds) to race time (hours).
        // see https://github.com/phetsims/unit-rates/issues/95
        var deltaRaceTime = Util.linear( 0, 1, 0, URQueryParameters.raceTimeScale, dt );

        // distance traveled, in miles
        var deltaDistance = deltaRaceTime * this.rate.unitRateProperty.value;

        if ( this.distanceProperty.value + deltaDistance >= this.track.lengthProperty.value ) {

          // car has reached the finish line
          this.timeProperty.value = this.track.lengthProperty.value / this.rate.unitRateProperty.value;
          this.distanceProperty.value = this.track.lengthProperty.value;
        }
        else {

          // move incrementally
          this.timeProperty.value = this.timeProperty.value + deltaRaceTime;
          this.distanceProperty.value = this.distanceProperty.value + deltaDistance;
        }
      }
    }
  } );
} );