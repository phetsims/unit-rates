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

    this.markerMap = {};
    this.initialize();

    this.topMaxProperty    = new Property( 0 );
    this.bottomMaxProperty = new Property( 0 );

    URNumberLine.call( this, this.rateProperty, this.topMaxProperty, this.bottomMaxProperty, {
      markerTopDecimals:          2,
      markerBottomDecimals:       1,
      markerTopHighPrecision:     2,
      markerBottomHighPrecision:  2
    } );

    // @public
    this.itemDataProperty = itemDataProperty;

    // update the numberline based on selected item type
    this.itemDataProperty.link( function( itemData, oldItemData ) {

      // change item rate
      self.rateProperty = itemData.rate;

      // change cost (top) max values
      self.topMaxProperty.value    = itemData.maxCount * self.rateProperty.value;
      self.bottomMaxProperty.value = itemData.maxCount;

      // change the marker arrays
      self.markersProperty.value = self.markerMap[ itemData.type ];
    } );
  }

  unitRates.register( 'NumberLine', NumberLine );

  return inherit( URNumberLine, NumberLine, {

    /**
     * create type marker arrays, one for each type (i.e. apples, carrots, etc..)
     * @public @override
     */
    initialize: function(  ) {
      for (var key in ItemData) {
        var itemData = ItemData[ key ];
        this.markerMap[ itemData.type ] = [];
      }
    },

    /**
     * Creates a new item marker from specified ItemData & an item count
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

      var marker = this.createMarker( correctCost, correctUnit, options );

      return marker;
    },

    // Resets all model elements
    reset: function() {
      this.initialize();
      URNumberLine.prototype.reset.call( this );
    }

  } ); // inherit

} ); // define
