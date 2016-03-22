// Copyright 2002-2016, University of Colorado Boulder

/**
 * A collection of different types of items (i.e. apple, cucumbers, blue candy)
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
     * @param {ItemType} type
     * @param {ItemUnit} unit
     * @param {ItemRate} rate
     * @public
     */
    createItem: function( type, unit, rate ) {
      this.addItem( new Item( type, unit, rate ) );
    },

    /**
     * Adds an item to the types specific array

          * @public
     */
     addItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );
      itemArray.add( item );
      console.log( 'addItem ' + item.type);
    },

    /**
     * Removes an item from the types specific array
     * @public
     */
    removeItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );
      itemArray.remove( item );
      console.log( 'removeItem ' + item.type);
    },

    /**
     * Adds addition/removal listeners to all type specific arrays
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
