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
  var ShoppingConstants = require( 'UNIT_RATES/common/shopping/ShoppingConstants' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var URNumberLine = require( 'UNIT_RATES/common/model/URNumberLine' );
  var URNumberLineMarker = require( 'UNIT_RATES/common/model/URNumberLineMarker' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Property.<ItemData>} itemDataProperty - the curently selected item
   * @constructor
   */
  function NumberLine( itemDataProperty, options ) {

    options = _.extend( {
    }, options || {} );

    var self = this;

    // create type marker arrays
    this.markerMap = {};
    for (var key in ItemData) {
      var itemData = ItemData[ key ];
      this.markerMap[ itemData.type ] = [];
    }

    this.topMaxProperty = new Property( ShoppingConstants.MAX_ITEMS );
    this.bottomMaxProperty = new Property( ShoppingConstants.MAX_ITEMS );

    URNumberLine.call( this, this.rateProperty, this.topMaxProperty, this.bottomMaxProperty, {
      markerTopDecimals:          2,
      markerBottomDecimals:       1,
      markerTopHighPrecision:     2,
      markerBottomHighPrecision:  2
    } );

    // @public
    this.itemDataProperty = itemDataProperty;

    // change the NL rate and marker arrays based on selected item type
    this.itemDataProperty.link( function( itemData, oldItemData ) {
      self.rateProperty = itemData.rate
      self.markersProperty.value = self.markerMap[ itemData.type ];
    } );

    // update value text on cost/weight change
    this.itemDataProperty.link( function( value, oldValue ) {

      // reassign the rate update function to the current item type
      if( oldValue ) {
        //oldValue.rate.unlink( self.updateNumberLineItemRate );
      }
      //value.rate.link( self.updateNumberLineItemRate.bind( self ) );
    } );

  }

  unitRates.register( 'NumberLine', NumberLine );

  return inherit( URNumberLine, NumberLine, {


    /**
     * Creates a new item marker
     * @param {ItemData} data
     * @param {number} [count]
     * @param {Object} [options]
     * @return {Item}
     * @public @override
     */
    createItem: function( data, count, options ) {

      // The correct answers
      var correctCost = ( count * data.rate.value );
      var correctUnit = ( count );

      var marker = new URNumberLineMarker( correctCost, correctUnit, data.rate, options );
      this.addMarker( marker );

      return marker;
    }

    /**
     * Updates the rate of the items  on currently on the number line (except editable items)
     * @protected
    updateNumberLineItemRate: function() {
      var self = this;

      var itemArray = this.itemCollection.getItemsWithType( this.itemDataProperty.value.type ); // NumberLineItemMarkers
      itemArray.forEach( function( item ) {
        item.setRate( self.itemDataProperty.value.rate.value );
      } );
    },
   */


  } ); // inherit

} ); // define
