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
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );

  /**
   * @constructor
   */
  function URNumberLine( ) {

    // @public (read-write)
    PropertySet.call( this, {
      markers:      [],
      topRange:     new Range( 0, 10 ),
      bottomRange:  new Range( 0, 10 ),
    } );
  }

  unitRates.register( 'URNumberLine', URNumberLine );

  return inherit( PropertySet, URNumberLine, {

    /**
     * creates a numberline marker
     * @returns {URNumberLineMarker}
     * @public
     */
    createMarker: function( correctTopValue, correctBottomValue, options ) {
      var marker = new URNumberLineMarker( correctTopValue, correctBottomValue, options );
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
