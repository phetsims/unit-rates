// Copyright 2016, University of Colorado Boulder

/**
 * A collection of all different types of items (i.e. apple, cucumbers, blue candy). Specific type of items
 * are collected in their own ObservableArray. Specific arrays are mapped by the item type.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Item = require( 'UNIT_RATES/common/shopping/model/Item' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var ObservableArray = require( 'AXON/ObservableArray' );

  /**
   * @constructor
   */
  function ItemCollection() {

    // @private - the collection of different arrays of items
    this.itemsMap = {};  //  (i.e.  { 'apples' : [ item1, item2, .. itemN ], 'carrots': [] })

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    // create empty item arrays
    this.initializeArrays();
  }

  unitRates.register( 'ItemCollection', ItemCollection );

  return inherit( Object, ItemCollection, {

    /**
     * Creates empty arrays for all item types (i.e. apples, carrots, red candy, etc..)
     *
     * @protected
     */
    initializeArrays: function() {
      for ( var key in ItemData ) {
        var itemData = ItemData[ key ];
        this.getItemsWithType( itemData.type ); // creates a new array if it doesn't already exist
      }
    },

    /**
     * Creates a new item & adds it to the types specific array
     *
     * @param {ItemData} data - contains the type of item to create (FIXME: refactor to just pass type)
     * @param {number} count
     * @return {Item}
     * @public
     */
    createItem: function( data, count ) {
      var item = new Item( data, count );
      this.addItem( item );
      return item;
    },

    /**
     * Adds an existing item to the type specific array
     *
     * @param {Item} item
     * @public
     */
    addItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );
      if ( !itemArray.contains( item ) ) {
        itemArray.add( item );
      }
    },

    /**
     * Removes an item from the type specific array
     *
     * @param {Item} item
     * @public
     */
    removeItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );
      itemArray.remove( item );
    },

    /**
     * Searches the type specific array for a matching item. An item is considered if both the type & count match.
     *
     * @param {Item} item
     * @return {Item} - returns the matching item or null
     * @public
     */
    containsItem: function( item ) {

      var itemArray = this.getItemsWithType( item.type );

      var existingItem = null;
      itemArray.forEach( function( arrayItem ) {
        if ( item.isEqual( arrayItem ) ) {
          existingItem = arrayItem;
        }
      } );

      return existingItem;
    },

    /**
     * Adds addition/removal listeners to all type specific arrays
     *
     * @param {function( Item, ObservableArray )} itemAddedListener
     * @param {function( Item, ObservableArray )} itemRemovedListener
     * @public
     */
    addListeners: function( itemAddedListener, itemRemovedListener ) {
      for ( var type in this.itemsMap ) {
        var itemArray = this.getItemsWithType( type );
        itemArray.addListeners( itemAddedListener, itemRemovedListener );
      }
    },

    /**
     * Gets the number of items in a type specific array.
     *
     * @param {string} type
     * @returns {number} - Note: this returns the sum of item.counts, not the number of items in the array
     * @protected
     */
    getNumberOfItemsWithType: function( type ) {

      var count = 0;
      var itemArray = this.getItemsWithType( type );
      itemArray.forEach( function( item ) {
        count += item.countProperty.value;
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
     * Removes all items from the collection for a specific type
     *
     * @param {string} type
     * @public
     */
    removeAllItemsWithType: function( type ) {

      var itemArray = this.getItemsWithType( type );
      itemArray.forEach( function( item ) {
        item.dispose();
      } );
      itemArray.clear();
    },

    /**
     * Resets the collection for a specific type to the original state
     *
     * @param {string} type
     * @public
     */
    resetItemType: function( type ) {

      var itemArray = this.getItemsWithType( type );
      itemArray.forEach( function( item ) {
        item.dispose();
      } );
      itemArray.reset();
    },

    /**
     * Resets the collection to the default state
     *
     * @public
     */
    reset: function() {
      for ( var type in this.itemsMap ) {
        this.resetItemType( type );
      }
    },

    //TODO This is currently never called
    // @public
    dispose: function() {
      for ( var type in this.itemsMap ) {
        var itemArray = this.itemsMap[ type ];
        //itemArray.removeAllListeners(); //TODO fix me: this doesn't exist but would be nice if it did (similar to Property.unlinkAll() )
        itemArray.dispose();
      }
    }

  } ); // inherit

} ); // define
