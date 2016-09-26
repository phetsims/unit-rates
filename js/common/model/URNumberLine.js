// Copyright 2002-2016, University of Colorado Boulder

/**
 * Base class number line model. Basically holds all the number line 'markers'
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URNumberLineMarker = require( 'UNIT_RATES/common/model/URNumberLineMarker' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function URNumberLine( rateProperty, topMaxProperty, bottomMaxProperty, options ) {

     options = _.extend( {
      markerTopDecimals:          0,    // # decimals place for display
      markerBottomDecimals:       2,    // # decimals place for display
      markerTopHighPrecision:     1,    // # decimals which makes a marker a 'high precision', potentially display differently
      markerBottomHighPrecision:  2     // # decimals which makes a marker a 'high precision', potentially display differently
    }, options || {} );

    // @public (read-write)
    PropertySet.call( this, {
      markers:                    [],
      markerTopDecimals:          options.markerTopDecimals,
      markerBottomDecimals:       options.markerBottomDecimals,
      markerTopHighPrecision:     options.markerTopHighPrecision,
      markerBottomHighPrecision:  options.markerBottomHighPrecision
    } );

    this.rateProperty       = rateProperty;
    this.topMaxProperty     = topMaxProperty;
    this.bottomMaxProperty  = bottomMaxProperty;
  }

  unitRates.register( 'URNumberLine', URNumberLine );

  return inherit( PropertySet, URNumberLine, {

    /**
     * creates a numberline marker
     * @param {number} correctTopValue - the correct value for the top of the double number line marker
     * @param {number} correctBottomValue - the correct value for the bottom of the double number line marker
     * @returns {URNumberLineMarker}
     * @public
     */
    createMarker: function( correctTopValue, correctBottomValue, options ) {

      options = _.extend( {
        topDecimalPlaces:     this.markerTopDecimalsProperty.value,
        bottomDecimalPlaces:  this.markerBottomDecimalsProperty.value,
        topHighPrecision:     this.markerTopHighPrecisionProperty.value,
        bottomHighPrecision:  this.markerBottomHighPrecisionProperty.value
      }, options || {} );

      var marker = new URNumberLineMarker( correctTopValue, correctBottomValue, this.rateProperty, options );
      if( !this.markerExists( marker ) ) {
        this.addMarker( marker );
      }
      else {
        // FIXME: dispose
      }

      return marker;
    },

    /**
     * adds an existing numberline marker
     * @param {URNumberLineMarker} marker
     * @public
     */
    addMarker: function( marker ) {
      this.markersProperty.value.push( marker );
      //this.markersProperty.notifyObserversStatic();
    },

    /**
     * removes an existing numberline marker
     * @param {URNumberLineMarker} marker
     * @public
     */
    removeMarker: function( marker ) {
      var index = this.markers.indexOf( marker );
      if (index > -1) {
        this.markersProperty.value.splice( index, 1 );
        //this.markersProperty.notifyObserversStatic();
      }
    },

    /**
     * removes all markers
     * @param {URNumberLineMarker} marker
     * @public
     */
    removeAllMarkers: function() {
      this.markersProperty.value.length = 0;
      //this.markersProperty.notifyObserversStatic();
    },

    /**
     * Checks if there is an existing marker with the same values in the marker list
     * @param {URNumberLineMarker} marker
     * @returns {boolean}
     * @public
     */
    markerExists: function( marker ) {

      var existingMarkers = this.markersProperty.value.filter( function( existingMarker ) {
          return ( marker !== existingMarker &&
                   ( marker.topQnA.valueProperty.value === existingMarker.topQnA.valueProperty.value ) &&
                   ( marker.bottomQnA.valueProperty.value === existingMarker.bottomQnA.valueProperty.value ) );
      } );

      return ( existingMarkers.length > 0 );
    },

    /**
     * Tells whether there is an existing editable marker in the marker list
     * @returns {boolean}
     * @public
     */
    editMarkerExists: function() {

      var editableItems = this.markersProperty.value.filter( function( item ) {
          return item.editableProperty.value;
      } );

      return ( editableItems.length > 0 );
    },

    /**
     * Foreach convenience function
     * @param {function( item, index )} callback
     * @public
     */
     forEachMarker: function( callback ) {
        this.markersProperty.value.forEach( callback );
     },

    /**
     *Resets number line
     * @public
     */
     reset: function() {
      var markerArray = this.markersProperty.value;
      while ( markerArray.length ) {
        var marker = markerArray.pop();
        marker.dispose();
      }
    },

    // @public
    dispose: function() {
      this.reset();
    }

  } ); // inherit

} ); // define
