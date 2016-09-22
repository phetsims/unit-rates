// Copyright 2002-2016, University of Colorado Boulder

/**
 * The base shopping model - shelf, scale & number line.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Shelf = require( 'UNIT_RATES/common/shopping/model/Shelf' );
  var Scale = require( 'UNIT_RATES/common/shopping/model/Scale' );
  var NumberLine = require( 'UNIT_RATES/common/shopping/model/NumberLine' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );

  /**
   * @constructor
   */
  function URShoppingModel() {

    // @public (all)
    PropertySet.call( this, {
      itemData: ItemData.APPLES,   // the currently selected item type (& the associated static attributes)
      itemType: ItemData.APPLES.type,
      itemRate: ItemData.APPLES.rate
    } );

    var self = this;

    this.rateMap = {};
    this.initializeRateMap();

    // @public
    this.shelf      = new Shelf( this.itemDataProperty );
    this.scale      = new Scale( this.itemTypeProperty, this.itemRateProperty );
    this.numberLine = new NumberLine( this.itemTypeProperty, this.itemRateProperty );

    // update value text on cost/weight change
    this.itemDataProperty.link( function( itemData, oldItemData ) {

      // save old rate which may have been changed
      if( oldItemData ) {
        self.rateMap[ oldItemData.type ] = self.itemRateProperty.value;
      }

      // set new type & rate
      self.itemTypeProperty.value = itemData.type;
      self.itemRateProperty.value = self.rateMap[ itemData.type ];
    } );
  }

  unitRates.register( 'URShoppingModel', URShoppingModel );

  return inherit( PropertySet, URShoppingModel, {

    /**
     * create type marker arrays, one for each type (i.e. apples, carrots, etc..)
     * @public @override
     */
    initializeRateMap: function(  ) {
      var self = this;

      for (var key in ItemData) {
        var itemData = ItemData[ key ];
        self.rateMap[ itemData.type ] = itemData.rate;
      }
    },

    /**
     * Removes an item from the shelf and adds it to the scale
     * @param {Item} item
     * @public
     */
    addShelfItemToScale: function( item ) {

      // Remove from shelf & add to scale
      this.shelf.removeItem( item );
      this.scale.addItem(item );
    },

    /**
     * Removes an item from the scale and adds it to the shelf
     * @param {Item} item
     * @public
     */
    addScaleItemToShelf: function( item ) {

      // Remove from scale & add to shelf
      this.scale.removeItem( item );
      this.shelf.addItem( item );
    },

    /**
     * Adds all items on the scale to the numberline (Note: the number line will ignore duplicates)
     * @protected
     */
    addScaleItemsToNumberline: function() {

      // create a new item on the number line representing the total number/weight of items currently on the scale
      var count = this.scale.getItemCount();
      if ( count > 0 ) {
        // The correct answers
        var correctCost = ( count * this.itemRateProperty.value );
        var correctUnit = ( count );

        this.numberLine.createMarker( correctCost, correctUnit, {});
      }
    },

    // Resets all model elements
    reset: function() {
      this.shelf.reset();
      this.scale.reset();
      this.numberLine.reset();
      PropertySet.prototype.reset.call( this );
    }

  } ); // inherit

} ); // define
