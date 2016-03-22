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
  var ObservableArray = require( 'AXON/ObservableArray' );

  /**
   *
   * @constructor
   */
  function ItemCollection() {

    var self = this;

    // @private - the collection of different types of items
    this.itemsMap = {};

    Object.call( this );
  }

  unitRates.register( 'ItemCollection', ItemCollection );

  return inherit( PropertySet, ItemCollection, {

    /**
     * Creates a new item/adds it to the types specific array
     * @param {string} type
     * @param {string | number} unit
     * @param {number} rate
     * @public
     */
    createItem: function( type, unit, rate ) {
      this.addItem( new Item( type, unit, rate ) );
    },

    /**
     * Adds an item to the types specific array
     *
     * @param {Item} item
     * @public
     */
     addItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );
      itemArray.add( item );
      console.log( 'addItem ' + item.type);
    },

    /**
     * Removes an item from the types specific array
     * @param {Item} item
     * @public
     */
    removeItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );
      itemArray.remove( item );
      console.log( 'removeItem ' + item.type);
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
     * Gets the collection for a specific type, or create an empty collection if none exists
     *
     * @param {string} type
     * @protected
     */
    getItemsWithType: function( type ) {
      if ( !this.itemsMap.hasOwnProperty( type ) ) {
        console.log( 'New ' + type + ' Collection: ');

        var itemArray = new ObservableArray();
        this.itemsMap[ type ] = itemArray;
      }

      return this.itemsMap[ type ];
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
