// Copyright 2002-2016, University of Colorado Boulder

/**
 * Derived from URNumberLine. Holds the markers currently on the number line. This class adds in functionality to swap
 * out the marker arrays based on the currently selected item type (i.e. apples, carrots, etc..)
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
  var Property = require( 'AXON/Property' );

  /**
   * @param {Property.<ItemData>} itemTypeProperty - the currently selected item
   * @param {Property.<number>} itemRateProperty - the currently selected item rate
   * @param {Object} [options]
   * @constructor
   */
  function NumberLine( itemTypeProperty, itemRateProperty, options ) {

    options = _.extend( {

    }, options || {} );

    var self = this;

    this.markerMap = {};
    this.initialize();

    this.itemTypeProperty = itemTypeProperty;

    this.topMaxProperty = new Property( 0 );
    this.bottomMaxProperty = new Property( 0 );

    URNumberLine.call( this, itemRateProperty, this.topMaxProperty, this.bottomMaxProperty, {
      markerTopDecimals: 2,
      markerBottomDecimals: 1,
      markerTopHighPrecision: 2,
      markerBottomHighPrecision: 2
    } );

    // update the number line based on selected item type
    this.itemTypeProperty.link( function( itemType, oldType ) {

      var maxUnit = self.getMaxUnit( itemType );

      // change cost (top) max values
      self.topMaxProperty.value = maxUnit * self.rateProperty.value;
      self.bottomMaxProperty.value = maxUnit;

      // change the marker arrays
      self.markersProperty.value = self.markerMap[ itemType ];
    } );
  }

  unitRates.register( 'NumberLine', NumberLine );

  return inherit( URNumberLine, NumberLine, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * create type marker arrays, one for each type (i.e. apples, carrots, etc..)
     * @public @override
     */
    initialize: function() {
      for ( var key in ItemData ) {
        var itemData = ItemData[ key ];
        this.markerMap[ itemData.type ] = [];
      }
    },

    /**
     *
     * @protected
     */
    getMaxUnit: function( itemType ) {

      var maxUnits = 1;

      switch( itemType ) {
        case ItemData.APPLES.type:
          maxUnits = ItemData.APPLES.maxUnit;
          break;
        case ItemData.LEMONS.type:
          maxUnits = ItemData.LEMONS.maxUnit;
          break;
        case ItemData.ORANGES.type:
          maxUnits = ItemData.ORANGES.maxUnit;
          break;
        case ItemData.PEARS.type:
          maxUnits = ItemData.PEARS.maxUnit;
          break;
        case ItemData.CARROTS.type:
          maxUnits = ItemData.CARROTS.maxUnit;
          break;
        case ItemData.CUCUMBERS.type:
          maxUnits = ItemData.CUCUMBERS.maxUnit;
          break;
        case ItemData.POTATOES.type:
          maxUnits = ItemData.POTATOES.maxUnit;
          break;
        case ItemData.TOMATOES.type:
          maxUnits = ItemData.TOMATOES.maxUnit;
          break;
        case ItemData.PURPLE_CANDY.type:
          maxUnits = ItemData.PURPLE_CANDY.maxUnit;
          break;
        case ItemData.RED_CANDY.type:
          maxUnits = ItemData.RED_CANDY.maxUnit;
          break;
        case ItemData.GREEN_CANDY.type:
          maxUnits = ItemData.GREEN_CANDY.maxUnit;
          break;
        case ItemData.BLUE_CANDY.type:
          maxUnits = ItemData.BLUE_CANDY.maxUnit;
          break;
        default:
          assert && assert( false, 'Cannot get max unit of unrecognized type' );
      }

      return maxUnits;
    },

    // Resets number line
    reset: function() {

      URNumberLine.prototype.reset.call( this );

      for ( var key in ItemData ) {
        var itemData = ItemData[ key ];
        var markerArray = this.markerMap[ itemData.type ];
        while ( markerArray.length ) {
          var marker = markerArray.pop();
          marker.dispose();
        }
      }

      this.initialize();
    }

  } ); // inherit

} ); // define
