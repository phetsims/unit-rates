// Copyright 2002-2016, University of Colorado Boulder

/**
 * A collection of all different types of items (i.e. apple, cucumbers, blue candy). Specific type of items
 * are collected in their own ObservableArray. Specific arrays are mapped by item type.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Item = require( 'UNIT_RATES/shopping/model/Item' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  /**
   *
   * @constructor
   */
  function ItemCollection() {

    // @private - the collection of different types of items
    this.itemsMap = {};

    // create empty item arrays
    for (var key in ItemData) {
      var itemData = ItemData[ key ];
      this.getItemsWithType( itemData.type );
    }

    Object.call( this );
  }

  unitRates.register( 'ItemCollection', ItemCollection );

  return inherit( PropertySet, ItemCollection, {

    /**
     * Creates a new item/adds it to the types specific array
     * @param {ItemData} data
     * @param {number} [count]
     * @return  {Item}
     * @public
     */
    createItem: function( data, count ) {
      var item = new Item( data, count );
      this.addItem( item );
      return item;
    },

    /**
     * Adds an item to the types specific array
     *
     * @param {Item} item
     * @public
     */
     addItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );

      if( !itemArray.contains( item ) ) {
        itemArray.add( item );
      }
    },

    /**
     * Removes an item from the types specific array
     * @param {Item} item
     * @public
     */
    removeItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );
      itemArray.remove( item );
    },

    /**
     * Adds addition/removal listeners to all type specific arrays
     *
     * @param {function( Item, ObservableArray )} itemAddedListener
     * @param {function( Item, ObservableArray )} itemRemovedListener
     * @public
     */
    addListeners: function( itemAddedListener, itemRemovedListener ) {
      for (var type in this.itemsMap) {
        var itemArray = this.getItemsWithType( type );
        itemArray.addListeners( itemAddedListener, itemRemovedListener );
      }
    },

    /**
     * Gets the number of items in the type specific array
     *
     * @param {string} type
     * @returns {number}
     * @protected
     */
    getNumberOfItemsWithType: function( type ) {

      var count = 0;
      var itemArray = this.getItemsWithType( type );
      itemArray.forEach( function( item ) {
        count += item.count;
      } );

      return count;
    },

    /**
     * Gets the collection for a specific type, or create an empty collection if none exists
     *
     * @param {string} type
     * @returns {ObservableArray}
     * @protected
     */
    getItemsWithType: function( type ) {
      if ( !this.itemsMap.hasOwnProperty( type ) ) {
        var itemArray = new ObservableArray();
        this.itemsMap[ type ] = itemArray;
      }

      return this.itemsMap[ type ];
    },

    /**
     * Resets the collection for a specific type
     *
     * @param {string} type
     * @public
     */
    resetItemType: function( type ) {

      var itemArray = this.getItemsWithType( type );
      itemArray.reset();
    },

    /**
     * Resets all model elements
     * @public
     */
    reset: function() {
      this.itemsMap = {};
    }

  } );
} );
