// Copyright 2016, University of Colorado Boulder

/**
 * Model for the double number line.
 * A marker is represented by its denominator value, and the numerator is computed by the client using the unit rate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLine( options ) {

    options = _.extend( {
      topFormat: currencyValueString,
      bottomFormat: '{0}'
    }, options );

    var self = this;

    // @public (read-only) formats for marker values
    this.topFormat = options.topFormat;
    this.bottomFormat = options.bottomFormat;

    // @public {Property.<number|null>} marker that corresponds to what is on the scale
    this.scaleMarkerProperty = new Property( null );
    this.scaleMarkerProperty.link( function( newMarker, oldMarker ) {

      // add the previous scale marker to otherMarkers
      if ( oldMarker && !self.otherMarkers.contains( oldMarker ) ) {
        self.otherMarkers.add( oldMarker );
      }

      // remove the current scale marker from otherMarkers
      if ( newMarker && self.otherMarkers.contains( newMarker ) ) {
        self.otherMarkers.remove( newMarker );
      }
    } );

    // @public {Property.<number|null>} marker that can be removed by pressing the undo button
    this.undoMarkerProperty = new Property( null );
    this.undoMarkerProperty.link( function( newMarker, oldMarker ) {

      // add the previous undo marker to otherMarkers
      if ( oldMarker && !self.otherMarkers.contains( oldMarker ) ) {
        self.otherMarkers.add( oldMarker );
      }

      // remove the current undo marker from otherMarkers
      if ( newMarker && self.otherMarkers.contains( newMarker ) ) {
        self.otherMarkers.remove( newMarker );
      }
    } );

    // @public {number[]} makers that correspond to questions that have been answered correctly
    this.questionMarkers = new ObservableArray();

    // @public {number[]} other markers that aren't described by any of the above
    this.otherMarkers = new ObservableArray();
  }

  unitRates.register( 'DoubleNumberLine', DoubleNumberLine );

  return inherit( Object, DoubleNumberLine, {

    // @public
    reset: function() {
      this.scaleMarkerProperty.reset();
      this.undoMarkerProperty.reset();
      this.questionMarkers.removeAll();
      this.otherMarkers.removeAll();
    },

    /**
     * Erases all markers, except for markers that correspond to:
     * - the number of items currently on the scale
     * - correctly answered questions, including unit rate
     * @public
     */
    erase: function() {
      this.undoMarkerProperty.reset();
      this.otherMarkers.removeAll();
    }
  } );
} );
