// Copyright 2016, University of Colorado Boulder

/**
 * Derived from OLDURNumberLine. Holds the markers currently on the number line. This class adds in functionality to swap
 * out the marker arrays based on the currently selected item type (i.e. apples, carrots, etc..)
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var OLDItemData = require( 'UNIT_RATES/old/common/shopping/model/OLDItemData' );
  var OLDURNumberLine = require( 'UNIT_RATES/old/common/model/OLDURNumberLine' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Property.<OLDItemData>} itemTypeProperty - the currently selected item
   * @param {Property.<number>} itemRateProperty - the currently selected item rate
   * @constructor
   */
  function OLDNumberLine( itemTypeProperty, itemRateProperty ) {

    var self = this;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.markerMap = {};
    this.initialize();

    this.itemTypeProperty = itemTypeProperty;

    this.topMaxProperty = new Property( 0 );
    this.bottomMaxProperty = new Property( 0 );

    OLDURNumberLine.call( this, itemRateProperty, this.topMaxProperty, this.bottomMaxProperty, {
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

  unitRates.register( 'OLDNumberLine', OLDNumberLine );

  return inherit( OLDURNumberLine, OLDNumberLine, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * create type marker arrays, one for each type (i.e. apples, carrots, etc..)
     *
     * @public
     * @override
     */
    initialize: function() {
      for ( var key in OLDItemData ) {
        var itemData = OLDItemData[ key ];
        this.markerMap[ itemData.type ] = [];
      }
    },

    /**
     * TODO document
     * @protected
     */
    getMaxUnit: function( itemType ) {

      var maxUnits = 1;

      switch( itemType ) {
        case OLDItemData.APPLES.type:
          maxUnits = OLDItemData.APPLES.maxUnit;
          break;
        case OLDItemData.LEMONS.type:
          maxUnits = OLDItemData.LEMONS.maxUnit;
          break;
        case OLDItemData.ORANGES.type:
          maxUnits = OLDItemData.ORANGES.maxUnit;
          break;
        case OLDItemData.PEARS.type:
          maxUnits = OLDItemData.PEARS.maxUnit;
          break;
        case OLDItemData.CARROTS.type:
          maxUnits = OLDItemData.CARROTS.maxUnit;
          break;
        case OLDItemData.CUCUMBERS.type:
          maxUnits = OLDItemData.CUCUMBERS.maxUnit;
          break;
        case OLDItemData.POTATOES.type:
          maxUnits = OLDItemData.POTATOES.maxUnit;
          break;
        case OLDItemData.TOMATOES.type:
          maxUnits = OLDItemData.TOMATOES.maxUnit;
          break;
        case OLDItemData.PURPLE_CANDY.type:
          maxUnits = OLDItemData.PURPLE_CANDY.maxUnit;
          break;
        case OLDItemData.RED_CANDY.type:
          maxUnits = OLDItemData.RED_CANDY.maxUnit;
          break;
        case OLDItemData.GREEN_CANDY.type:
          maxUnits = OLDItemData.GREEN_CANDY.maxUnit;
          break;
        case OLDItemData.BLUE_CANDY.type:
          maxUnits = OLDItemData.BLUE_CANDY.maxUnit;
          break;
        default:
          assert && assert( false, 'Cannot get max unit of unrecognized type' );
      }

      return maxUnits;
    },

    // @public
    reset: function() {

      OLDURNumberLine.prototype.reset.call( this );

      for ( var key in OLDItemData ) {
        var itemData = OLDItemData[ key ];
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
