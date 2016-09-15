// Copyright 2002-2016, University of Colorado Boulder

/**
 * Holds the items currently on the number line
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
  function URNumberLine( rateProperty, topMaxValue, bottomMaxValue, options ) {

     options = _.extend( {
      markerTopDecimals:     0,
      markerBottomDecimals:  2
    }, options || {} );

    // @public (read-write)
    PropertySet.call( this, {
      markers:              [],
      markerTopDecimals:    options.markerTopDecimals,
      markerBottomDecimals: options.markerBottomDecimals
    } );

    this.rateProperty    = rateProperty;
    this.topMaxValue     = topMaxValue;
    this.bottomMaxValue  = bottomMaxValue;
  }

  unitRates.register( 'URNumberLine', URNumberLine );

  return inherit( PropertySet, URNumberLine, {

    /**
     * creates a numberline marker
     * @returns {URNumberLineMarker}
     * @public
     */
    createMarker: function( correctTopValue, correctBottomValue, options ) {
      var marker = new URNumberLineMarker( correctTopValue, correctBottomValue, this.rateProperty, options );
      this.markersProperty.value.push( marker );

      return marker;
    },

    /**
     * creates a numberline marker
     *  @param {URNumberLineMarker} marker
     * @public
     */
    removeMarker: function( marker ) {
      var index = this.markers.indexOf( marker );
      if (index > -1) {
        this.markersProperty.value.splice( index, 1 );
      }
    },

    /**
     * creates a numberline marker
     *  @param {URNumberLineMarker} marker
     * @public
     */
    removeAllMarkers: function() {
      this.markersProperty.value = [];
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

    // @public
    dispose: function() {
    }

  } ); // inherit

} ); // define
