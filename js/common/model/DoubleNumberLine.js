// Copyright 2016-2017, University of Colorado Boulder

/**
 * Model for the double number line.
` *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Property.<number>} unitRateProperty
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLine( unitRateProperty, options ) {

    options = _.extend( {
      numerationOptions: null, // {*} options specific to the rate's numerator, see below
      denominatorOptions: null // {*} options specific to the rate's denominator, see below
    }, options );

    // @public (read-only) options for the numerator (top) number line
    this.numeratorOptions = _.extend( {
      axisLabel: null, // {string|null} label for the axis
      maxDecimals: 1, // {number} maximum number of decimal places
      trimZeros: false // {boolean} whether to trim trailing zeros from decimal places
    }, options.numeratorOptions );

    // @public (read-only) options for the denominator (bottom) number line
    this.denominatorOptions = _.extend( {
      axisLabel: null, // {Node|null} label for the axis
      maxDecimals: 1, // {number} maximum number of decimal places
      trimZeros: false, // {boolean} whether to trim trailing zeros from decimal places
      axisRange: new Range( 0, 10 ), // {Range} range of axis
      majorMarkerDecimals: 0 // {number} number of decimal places for major markers
    }, options.denominatorOptions );

    // numerator and denominator must have the same number of decimal places,
    // or we will end up with rates that share a common numerator or denominator.
    assert && assert( this.numeratorOptions.maxDecimals === this.denominatorOptions.maxDecimals,
      'maxDecimals must be the same for numerator and denominator' );

    // @public (read-only)
    this.unitRateProperty = unitRateProperty;

    // @public {Array[]}
    this.markers = new ObservableArray( [] );

    // @public {Property.<number|null>} marker that can be removed by pressing the undo button
    this.undoMarkerProperty = new Property( null );

    var unitRateObserver = function() {
      //TODO delete all markers and create new markers with adjusted numerator
    };
    this.unitRateProperty.lazyLink( unitRateObserver );

    // @private
    this.disposeDoubleNumberLine = function() {
      unitRateProperty.unlink( unitRateObserver );
    };
  }

  unitRates.register( 'DoubleNumberLine', DoubleNumberLine );

  return inherit( Object, DoubleNumberLine, {

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
        this.markers.remove( undoMarker );
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
          self.markers.remove( marker );
        }
      } );
    }
  } );
} );
