// Copyright 2002-2016, University of Colorado Boulder

/**
 * All the items currently on the scale
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemCollection = require( 'UNIT_RATES/common/shopping/model/ItemCollection' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var Item = require( 'UNIT_RATES/common/shopping/model/Item' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Property.<string>} itemTypeProperty - the curently selected item type
   * @param {Property.<number>} itemRateProperty - the curently selected item rate
   * @constructor
   */
  function Scale( itemTypeProperty, itemRateProperty ) {

    // @public (all)
    ItemCollection.call( this, { } );

    var self = this;

    this.itemTypeProperty = itemTypeProperty;
    this.itemRateProperty = itemRateProperty;

    // @protected - the current cost and weight of all items on the scale
    this.costProperty   = new Property( 0.0 );
    this.weightProperty = new Property( 0.0 );

    this.addArrayListeners();

    // refresh on item change
    this.itemRateProperty.link( function( itemData, oldItemData ) {
        self.updateScale();
    } );

  }

  unitRates.register( 'Scale', Scale );

  return inherit( ItemCollection, Scale, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Add local listener for item additions/removals. This is only needed on initialization.
     * @protected
     */
    addArrayListeners: function() {
      var self = this;

      // refresh on item additions/removals
      this.addListeners( function( item, observableArray ) {
        self.costProperty.value   += ( self.itemRateProperty.value * item.countProperty.value );
        self.weightProperty.value += item.countProperty.value;
      },
      function( item, observableArray ) {
        self.costProperty.value   -= ( self.itemRateProperty.value * item.countProperty.value );
        self.weightProperty.value -= item.countProperty.value;
      } );
    },

    /**
     * Returns the total number of items on the scale for the current item type
     * @return {number}
     * @override @public
     */
    getItemCount: function() {
      return this.getNumberOfItemsWithType( this.itemTypeProperty.value );
    },

    /**
     * Adds an item to the type specific array
     * Note: fruit types are a special case, they get expanded into indivdual items
     * @param {Item} item
     * @override @public
     */
    addItem: function( item ) {

      // expand fruit (& candy?) bag types into individual items (note: produce types remain in bags)
      if ( item.countProperty.value > 1 ) {

        var types = {};
        types[ ItemData.APPLES.type ]  = ItemData.APPLES;
        types[ ItemData.LEMONS.type ]  = ItemData.LEMONS;
        types[ ItemData.ORANGES.type ] = ItemData.ORANGES;
        types[ ItemData.PEARS.type ]   = ItemData.PEARS;
        if ( item.isFruit() ) {
          for ( var i = 0; i < item.countProperty.value; i++ ) {
            ItemCollection.prototype.addItem.call( this, new Item( item.type, 1 ) );
          }
        }
        else {
          ItemCollection.prototype.addItem.call( this, item );
        }
      }
      else {
         ItemCollection.prototype.addItem.call( this, item );
      }
    },

    /**
     * Resets the current item type - basically removes all items of the current type from the scale
     * @public
     */
    resetCurrentItem: function() {
      this.resetItemType( this.itemTypeProperty.value );
    },

    /**
     * Recalculates the cost and weight of the items on currently on the scale
     * @protected
     */
    updateScale: function() {
      var self = this;

      self.costProperty.reset();
      self.weightProperty.reset();

      var cost = 0;
      var weight = 0;

      // get the current array for the item type
      var itemArray = self.getItemsWithType( this.itemTypeProperty.value );
      itemArray.forEach( function( item ) {
        cost   += ( self.itemRateProperty.value * item.countProperty.value );
        weight += item.countProperty.value; // since candy is in bulk we just use fractional counts to represent weight
      } );

      self.costProperty.value   = cost;
      self.weightProperty.value = weight;
    },

    /**
     * Reset the scale to the default state.
     * @public
     */
    reset: function() {
      ItemCollection.prototype.reset.call( this );
      this.costProperty.reset();
      this.weightProperty.reset();
    }

  } );  // inherit

} );  // define
