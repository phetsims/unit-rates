// Copyright 2016, University of Colorado Boulder

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
   * @param {Property.<number>} rateProperty - current unit rate
   * @param {Property.<number>} topMaxProperty - the top number line X-axis maximum value
   * @param {Property.<number>} bottomMaxProperty - the bottom number line X-axis maximum value
   * @param {Object} [options]
   * @constructor
   */
  function URNumberLine( rateProperty, topMaxProperty, bottomMaxProperty, options ) {

    options = _.extend( {
      markerTopDecimals: 0,    // # decimals place for display
      markerBottomDecimals: 2,    // # decimals place for display
      markerTopHighPrecision: 1,    // # decimals which makes a marker a 'high precision', potentially display differently
      markerBottomHighPrecision: 2     // # decimals which makes a marker a 'high precision', potentially display differently
    }, options || {} );

    // @public (read-write)
    PropertySet.call( this, {
      markers: [],
      markerTopDecimals: options.markerTopDecimals,
      markerBottomDecimals: options.markerBottomDecimals,
      markerTopHighPrecision: options.markerTopHighPrecision,
      markerBottomHighPrecision: options.markerBottomHighPrecision
    } );

    this.rateProperty = rateProperty;
    this.topMaxProperty = topMaxProperty;
    this.bottomMaxProperty = bottomMaxProperty;
  }

  unitRates.register( 'URNumberLine', URNumberLine );

  return inherit( PropertySet, URNumberLine, {

    /**
     * creates a number line marker
     * @param {number} correctTopValue - the correct value for the top of the double number line marker
     * @param {number} correctBottomValue - the correct value for the bottom of the double number line marker
     * @param {Object} [options]
     * @returns {URNumberLineMarker}
     * @public
     */
    createMarker: function( correctTopValue, correctBottomValue, options ) {

      options = _.extend( {
        topDecimalPlaces: this.markerTopDecimalsProperty.value,
        bottomDecimalPlaces: this.markerBottomDecimalsProperty.value,
        topHighPrecision: this.markerTopHighPrecisionProperty.value,
        bottomHighPrecision: this.markerBottomHighPrecisionProperty.value
      }, options || {} );

      var marker = new URNumberLineMarker( correctTopValue, correctBottomValue, this.rateProperty, options );
      if ( !this.markerExists( marker ) ) {
        this.addMarker( marker );
      }
      else {
        marker.dispose();
      }

      return marker;
    },

    /**
     * adds an existing number line marker
     * @param {URNumberLineMarker} marker
     * @public
     */
    addMarker: function( marker ) {
      this.markersProperty.value.push( marker );
    },

    /**
     * removes an existing number line marker
     * @param {URNumberLineMarker} marker
     * @public
     */
    removeMarker: function( marker ) {
      var index = this.markers.indexOf( marker );
      if ( index > -1 ) {

        // get the marker array
        var markerArray = this.markersProperty.value;

        // remove the marker from the array
        markerArray.splice( index, 1 );
      }

      // dispose of the specified marker
      marker.dispose();
    },

    /**
     * removes all markers
     * @public
     */
    removeAllMarkers: function() {
      var markerArray = this.markersProperty.value;
      while ( markerArray.length ) {
        var marker = markerArray.pop();
        marker.dispose();
      }
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
     * Resets number line
     * @public
     */
    reset: function() {
      this.removeAllMarkers();
    },

    // @public
    dispose: function() {
      this.removeAllMarkers();
      PropertySet.prototype.dispose.call( this );
    }

  } ); // inherit

} ); // define
