// Copyright 2016-2017, University of Colorado Boulder

/**
 * Model for the double number line.
 ` *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Util = require( 'DOT/Util' );

  // constants
  var FIXED_AXIS_VALUES = [ 'numerator', 'denominator' ];

  /**
   * @param {Property.<number>} unitRateProperty
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLine( unitRateProperty, options ) {

    var self = this;

    options = _.extend( {
      fixedAxis: 'denominator', // {string} which of the rate's axes has a fixed range
      fixedAxisRange: new Range( 0, 10 ), // {Range} range of the fixed axis
      numerationOptions: null, // {*} options specific to the rate's numerator, see below
      denominatorOptions: null, // {*} options specific to the rate's denominator, see below

      // {function(number,number)} determines whether a marker is major or minor
      isMajorMarker: function( numerator, denominator ) { return true; }
    }, options );

    assert && assert( _.includes( FIXED_AXIS_VALUES, options.fixedAxis ),
      'invalid fixedAxis: ' + options.fixedAxis );

    // @public (read-only) options for the numerator (top) number line
    this.numeratorOptions = _.extend( {
      axisLabel: '', // {string} label for the axis
      maxDecimals: 1, // {number} maximum number of decimal places
      trimZeros: false // {boolean} whether to trim trailing zeros from decimal places
    }, options.numeratorOptions );

    // @public (read-only) options for the denominator (bottom) number line
    this.denominatorOptions = _.extend( {
      axisLabel: '', // {Node} label for the axis
      maxDecimals: 1, // {number} maximum number of decimal places
      trimZeros: false // {boolean} whether to trim trailing zeros from decimal places
    }, options.denominatorOptions );

    // numerator and denominator must have the same number of decimal places,
    // or we will end up with rates that share a common numerator or denominator.
    assert && assert( this.numeratorOptions.maxDecimals === this.denominatorOptions.maxDecimals,
      'maxDecimals must be the same for numerator and denominator' );

    // @public (read-only) {Property.<number>}
    this.unitRateProperty = unitRateProperty;

    // @public (read-only) {Marker[]} markers must be added/removed via addMarker/removeMarker
    this.markers = new ObservableArray( [] );

    // @public (read-only) {function(number,number)}
    this.isMajorMarker = options.isMajorMarker;

    // @public (read-only)
    this.fixedAxis = options.fixedAxis;

    // @public defined below
    this.numeratorAxisRangeProperty = null;
    this.denominatorAxisRangeProperty = null;
    if ( options.fixedAxis === 'numerator' ) {

      this.numeratorAxisRangeProperty = new Property( options.fixedAxisRange );
      this.numeratorAxisRangeProperty.lazyLink( function( range ) {  // unlink not needed
        throw new Error( 'numeratorAxisRangeProperty should not change' );
      } );

      var denominatorMin = this.numeratorAxisRangeProperty.value.min / unitRateProperty.value;
      var denominatorMax = this.numeratorAxisRangeProperty.value.max / unitRateProperty.value;
      this.denominatorAxisRangeProperty = new Property( new Range( denominatorMin, denominatorMax ) );
    }
    else {

      this.denominatorAxisRangeProperty = new Property( options.fixedAxisRange );
      this.denominatorAxisRangeProperty.lazyLink( function( range ) { // unlink not needed
        throw new Error( 'denominatorAxisRangeProperty should not change' );
      } );

      var numeratorMin = this.denominatorAxisRangeProperty.value.min * unitRateProperty.value;
      var numeratorMax = this.denominatorAxisRangeProperty.value.max * unitRateProperty.value;
      this.numeratorAxisRangeProperty = new Property( new Range( numeratorMin, numeratorMax ) );
    }

    // @public {Property.<number|null>} marker that can be removed by pressing the undo button.
    // A single level of undo is supported.
    this.undoMarkerProperty = new Property( null );

    // When the unit rate changes...
    var unitRateObserver = function( unitRate ) {

      if ( options.fixedAxis === 'numerator' ) {

        // adjust the denominator range
        var denominatorMin = self.numeratorAxisRangeProperty.value.min / unitRateProperty.value;
        var denominatorMax = self.numeratorAxisRangeProperty.value.max / unitRateProperty.value;
        self.denominatorAxisRangeProperty = new Property( new Range( denominatorMin, denominatorMax ) );

        // adjust the denominator of all markers
        self.markers.forEach( function( marker ) {
          marker.denominatorProperty.value = marker.numeratorProperty.value / unitRate;
        } );
      }
      else {

        // adjust the numerator range
        var numeratorMin = self.denominatorAxisRangeProperty.value.min * unitRateProperty.value;
        var numeratorMax = self.denominatorAxisRangeProperty.value.max * unitRateProperty.value;
        self.numeratorAxisRangeProperty = new Property( new Range( numeratorMin, numeratorMax ) );

        // adjust the numerator of all markers
        self.markers.forEach( function( marker ) {
          marker.numeratorProperty.value = marker.denominatorProperty.value * unitRate;
        } );
      }
    };
    unitRateProperty.lazyLink( unitRateObserver ); // unlink in dispose

    // @private
    this.disposeDoubleNumberLine = function() {
      unitRateProperty.unlink( unitRateObserver );
    };
  }

  unitRates.register( 'DoubleNumberLine', DoubleNumberLine );

  return inherit( Object, DoubleNumberLine, {

    /**
     * Maps a rate's numerator from model to view coordinate frame.
     * @param {number} modelX
     * @param {number} viewXMax
     * @returns {number}
     */
    modelToViewNumerator: function( modelX, viewXMax ) {
       return Util.linear(
         this.numeratorAxisRangeProperty.value.min, this.numeratorAxisRangeProperty.value.max,
         0, viewXMax,
         modelX );
    },

    /**
     * Maps a rate's denominator from model to view coordinate frame.
     * @param {number} modelX
     * @param {number} viewXMax
     * @returns {number}
     */
    modelToViewDenominator: function( modelX, viewXMax ) {
       return Util.linear(
         this.denominatorAxisRangeProperty.value.min, this.denominatorAxisRangeProperty.value.max,
         0, viewXMax,
         modelX );
    },

    /**
     * This is a request to add a marker, subject to rules about uniqueness and marker precedence.
     * The rules are complicated to describe, so please consult the implementation.
     * Calling this function may result in a lower precedence marker being deleted as a side effect.
     * @param {Marker} marker
     * @returns {boolean} true if the marker was added, false if the request was ignored
     * @public
     */
    addMarker: function( marker ) {

      assert && assert( !this.markers.contains( marker ), 'attempt to add marker again: ' + marker );

      var wasAdded = false;

      // look for a marker with the same rate
      var markerWithSameRate = this.getMarkerWithSameRate( marker );

      if ( !markerWithSameRate ) {

        // if there is no marker with the same rate, then simply add the marker
        this.markers.add( marker );
        wasAdded = true;
      }
      else if ( markerWithSameRate.precedenceOf( marker ) >= 0 ) {

        // Replace with higher or same precedence marker.
        // Need to replace same precedence marker so that undo marker is properly set.
        this.removeMarker( markerWithSameRate );
        if ( this.undoMarkerProperty.value === markerWithSameRate ) {
          this.undoMarkerProperty.value = null;
        }
        this.markers.add( marker );
        wasAdded = true;
      }
      else {

        // ignore lower precedence marker
        unitRates.log && unitRates.log( 'ignoring lower precedence marker: ' + marker.toString() );
      }

      return wasAdded;
    },

    /**
     * Removes a marker.
     * @param {Marker} marker
     * @public
     */
    removeMarker: function( marker ) {
      assert && assert( this.markers.contains( marker ), 'attempt to remove an unknown marker: ' + marker );
      this.markers.remove( marker );
    },

    /**
     * Gets a marker with the same rate as the specified marker.
     * @param {Marker} marker
     * @returns {Marker|null} null if there is no marker with the same rate
     * @public
     */
    getMarkerWithSameRate: function( marker ) {
      var markerWithSameRate = null;
      var markers = this.markers.getArray();
      for ( var i = 0; i < markers.length && !markerWithSameRate; i++ ) {
        if ( marker.rateEquals( markers[ i ] ) ) {
          markerWithSameRate = markers[ i ];
        }
      }
      return markerWithSameRate;
    },

    /**
     * Does this marker fall within the range of the axes?
     * @param {Marker} marker
     * @returns {boolean}
     */
    markerIsInRange: function( marker ) {
      return ( this.numeratorAxisRangeProperty.value.contains( marker.numeratorProperty.value ) &&
               this.denominatorAxisRangeProperty.value.contains( marker.denominatorProperty.value ) );
    },

    // @public
    dispose: function() {
      this.disposeDoubleNumberLine();
    },

    // @public
    reset: function() {
      this.markers.reset();
      this.undoMarkerProperty.reset();
    },

    /**
     * Undoes (removes) the undo marker. If there is no undo marker, this is a no-op.
     * @public
     */
    undo: function() {
      var undoMarker = this.undoMarkerProperty.value;
      if ( undoMarker ) {
        assert && assert( this.markers.contains( undoMarker ), 'unexpected undoMarker: ' + undoMarker );
        this.undoMarkerProperty.value = null;
        this.removeMarker( undoMarker );
      }
    },

    /**
     * Erases all markers that are erasable.
     * @public
     */
    erase: function() {

      this.undoMarkerProperty.reset();

      // remove all markers that are erasable
      var self = this;
      this.markers.forEach( function( marker ) {
        if ( marker.erasable ) {
          self.removeMarker( marker );
        }
      } );
    }
  } );
} );
