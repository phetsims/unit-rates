// Copyright 2016, University of Colorado Boulder

/**
 * All the items currently on the scale
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var OLDItem = require( 'UNIT_RATES/old/common/shopping/model/OLDItem' );
  var OLDItemCollection = require( 'UNIT_RATES/old/common/shopping/model/OLDItemCollection' );
  var OLDItemData = require( 'UNIT_RATES/old/common/shopping/model/OLDItemData' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Property.<string>} itemTypeProperty - the currently selected item type
   * @param {Property.<number>} itemRateProperty - the currently selected item rate
   * @constructor
   */
  function OLDScale( itemTypeProperty, itemRateProperty ) {

    // @public (all)
    OLDItemCollection.call( this );

    var self = this;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.itemTypeProperty = itemTypeProperty;
    this.itemRateProperty = itemRateProperty;

    // @protected - the current cost and weight of all items on the scale
    this.costProperty = new Property( 0.0 );
    this.weightProperty = new Property( 0.0 );

    this.addArrayListeners();

    // refresh on item change
    this.itemRateProperty.link( function( itemData, oldItemData ) {
      self.updateScale();
    } );

  }

  unitRates.register( 'OLDScale', OLDScale );

  return inherit( OLDItemCollection, OLDScale, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Add local listener for item additions/removals. This is only needed on initialization.
     *
     * @protected
     */
    addArrayListeners: function() {
      var self = this;

      // refresh on item additions/removals
      this.addListeners( function( item, observableArray ) {
          self.costProperty.value += ( self.itemRateProperty.value * item.countProperty.value );
          self.weightProperty.value += item.countProperty.value;
        },
        function( item, observableArray ) {
          self.costProperty.value -= ( self.itemRateProperty.value * item.countProperty.value );
          self.weightProperty.value -= item.countProperty.value;
        } );
    },

    /**
     * Returns the total number of items on the scale for the current item type
     *
     * @return {number}
     * @override
     * @public
     */
    getItemCount: function() {
      return this.getNumberOfItemsWithType( this.itemTypeProperty.value );
    },

    /**
     * Adds an item to the type specific array
     * Note: fruit types are a special case, they get expanded into individual items
     *
     * @param {OLDItem} item
     * @override
     * @public
     */
    addItem: function( item ) {

      // expand fruit (& candy?) bag types into individual items (note: produce types remain in bags)
      if ( item.countProperty.value > 1 ) {

        var types = {};
        types[ OLDItemData.APPLES.type ] = OLDItemData.APPLES;
        types[ OLDItemData.LEMONS.type ] = OLDItemData.LEMONS;
        types[ OLDItemData.ORANGES.type ] = OLDItemData.ORANGES;
        types[ OLDItemData.PEARS.type ] = OLDItemData.PEARS;

        var isFruit = ( item.type === OLDItemData.APPLES.type || item.type === OLDItemData.LEMONS.type ||
                        item.type === OLDItemData.ORANGES.type || item.type === OLDItemData.PEARS.type );

        if ( isFruit ) {
          for ( var i = 0; i < item.countProperty.value; i++ ) {
            OLDItemCollection.prototype.addItem.call( this, new OLDItem( item.type, 1 ) );
          }
        }
        else {
          OLDItemCollection.prototype.addItem.call( this, item );
        }
      }
      else {
        OLDItemCollection.prototype.addItem.call( this, item );
      }
    },

    /**
     * Resets the current item type - basically removes all items of the current type from the scale
     *
     * @public
     */
    resetCurrentItem: function() {
      this.resetItemType( this.itemTypeProperty.value );
    },

    /**
     * Recalculates the cost and weight of the items on currently on the scale
     *
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
        cost += ( self.itemRateProperty.value * item.countProperty.value );
        weight += item.countProperty.value; // since candy is in bulk we just use fractional counts to represent weight
      } );

      self.costProperty.value = cost;
      self.weightProperty.value = weight;
    },

    // public
    reset: function() {
      OLDItemCollection.prototype.reset.call( this );
      this.costProperty.reset();
      this.weightProperty.reset();
    }

  } );  // inherit

} );  // define