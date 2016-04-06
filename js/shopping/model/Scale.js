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
  var ItemCollection = require( 'UNIT_RATES/shopping/model/ItemCollection' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var Item = require( 'UNIT_RATES/shopping/model/Item' );
  var Property = require( 'AXON/Property' );

  /**
   *
   * @constructor
   */
  function Scale( itemDataProperty ) {

    // @public (all)
    ItemCollection.call( this, itemDataProperty, {
    } );

    var self = this;

    this.itemDataProperty = itemDataProperty;

    // @protected
    this.costProperty     = new Property( 0.0 );
    this.weightProperty   = new Property( 0.0 );

    // update value text
    itemDataProperty.link( function( value, oldValue ) {

      self.costProperty.reset();
      self.weightProperty.reset();

      // get the current array for the item type
      var cost = 0;
      var weight = 0;
      var itemArray = self.getItemsWithType( value.type );
      itemArray.forEach( function( item ) {

        cost += ( item.rate * item.count );
        weight += item.weight * item.count;
      } );

      self.costProperty.value = cost;
      self.weightProperty.value = weight;
    } );

    // refresh on item additions/removals
    this.addListeners( function( item, observableArray ) {
      console.log( 'Scale: ' + observableArray.length );

      self.costProperty.value += ( item.rate * item.count );
      self.weightProperty.value += item.weight * item.count;
    },
    function( item, observableArray ) {
      console.log( 'Scale: ' + observableArray.length );

      self.costProperty.value -= ( item.rate * item.count );
      self.weightProperty.value -= item.weight * item.count;
    } );
  }

  unitRates.register( 'Scale', Scale );

  return inherit( ItemCollection, Scale, {

    /**
     * Returns the total nuber of items on the scale
     *
     * @return {number}
     * @override @public
     */
    getItemCount: function() {
      return this.getNumberOfItemsWithType( this.itemDataProperty.value.type );
    },

    /**
     * Adds an item to the types specific array - fruit types are a special case
     *
     * @param {Item} item
     * @override @public
     */
    addItem: function( item ) {

      // expand fruit (& candy?) bag types into individual items (note: produce types remain in bags)
      if ( item.count > 1 ) {

        var types = {};
        types[ ItemData.APPLES.type ] = ItemData.APPLES;
        types[ ItemData.LEMONS.type ] = ItemData.LEMONS;
        types[ ItemData.ORANGES.type ] = ItemData.ORANGES;
        types[ ItemData.PEARS.type ] = ItemData.PEARS;
        if ( types[ item.type ] ) {
          for ( var i = 0; i < item.count; i++ ) {
            ItemCollection.prototype.addItem.call( this, new Item( types[ item.type ], 1 ) );
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
     *
     * @public
     */
    resetCurrentItem: function() {
      this.resetItemType( this.itemDataProperty.value.type );
    },

    /**
     *
     * @public
     */
    reset: function() {
      this.costProperty.reset();
      this.weightProperty.reset();
      ItemCollection.prototype.reset.call( this );
    }

  } );

} );
