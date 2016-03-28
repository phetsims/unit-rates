// Copyright 2002-2016, University of Colorado Boulder

/**
 * All the items currently on the shelf
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

        cost += ( item.rate * item.count * item.weight );
        weight += item.weight;
      } );

      self.costProperty.value = cost;
      self.weightProperty.value = weight;
    } );

    // refresh on item additions/removals
    this.addListeners( function( item, observableArray ) {
      console.log( 'Scale: ' + observableArray.length );

      self.costProperty.value += ( item.rate * item.count * item.weight );
      self.weightProperty.value += item.weight;
    },
    function( item, observableArray ) {
      console.log( 'Scale: ' + observableArray.length );

      self.costProperty.value -= ( item.rate * item.count * item.weight );
      self.weightProperty.value -= item.weight;
    } );
  }

  unitRates.register( 'Scale', Scale );

  return inherit( ItemCollection, Scale, {

    /**
     * Adds an item to the types specific array - fruit types are a special case
     *
     * @param {Item} item
     * @override @public
     */
     addItem: function( item ) {

      // expand fruit & candy bag types into individual items (note: produce types remain in bags)
      if ( item.count > 1 ) {

        switch( item.type ) {
          case ItemData.APPLES.type:
            for ( var i = 0; i < item.count; i++ ) {
              ItemCollection.prototype.addItem.call( this, new Item( ItemData.APPLES, 1 ) );
            };
            break;
          case ItemData.LEMONS.type:
            for ( var i = 0; i < item.count; i++ ) {
              ItemCollection.prototype.addItem.call( this, new Item( ItemData.LEMONS, 1 ) );
            };
            break;
          case ItemData.ORANGES.type:
            for ( var i = 0; i < item.count; i++ ) {
              ItemCollection.prototype.addItem.call( this, new Item( ItemData.ORANGES, 1 ) );
            };
            break;
          case ItemData.PEARS.type:
            for ( var i = 0; i < item.count; i++ ) {
              ItemCollection.prototype.addItem.call( this, new Item( ItemData.PEARS, 1 ) );
            };
            break;

          default:
            ItemCollection.prototype.addItem.call( this, item );
        }
      }
      else {
         ItemCollection.prototype.addItem.call( this, item );
      }

    },

    /**
     * @public
     */
    reset: function() {
      this.costProperty.reset();
      this.weightProperty.reset();
      ItemCollection.prototype.reset.call( this );
    }

  } );

} );
