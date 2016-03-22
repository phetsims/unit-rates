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
   * @constructor
   */
  function ItemCollection( itemTypeProperty ) {

    var self = this;

    this.itemTypeProperty = itemTypeProperty;

    // @private - the collection of different types of items
    this.itemsMap = {};

    // on item change, fetch the current collection
    this.itemTypeProperty.link( function( type, oldType ) {
      self.items = self.getItemsWithType( type );
    } );

    Object.call( this );
  }

  unitRates.register( 'ItemCollection', ItemCollection );

  return inherit( PropertySet, ItemCollection, {

    // Creates a new item
    // @public
    createItem: function( type, unit, rate ) {
      this.addItem( new Item( type, unit, rate ) );
    },

    // @public
    addItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );
      itemArray.add( item );
      console.log( 'addItem ' + item.type);
    },

    // @public
    removeItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );
      itemArray.remove( item );
      console.log( 'removeItem ' + item.type);
    },

    // Gets the collection for a specific type, or create an empty collection if none exists
    getItemsWithType: function( type ) {
      if ( !this.itemsMap.hasOwnProperty( type ) ) {
        console.log( 'New ' + type + ' Collection: ');

        var itemArray = new ObservableArray();
        this.itemsMap[ type ] = itemArray;
      }

      return this.itemsMap[ type ];
    },

    addListeners: function( itemAddedListener, itemRemovedListener ) {
      for (var type in this.itemsMap) {
        var itemArray = this.getItemsWithType( type );
        itemArray.addListeners( itemAddedListener, itemRemovedListener );
      }
    },

    // Resets all model elements
    reset: function() {
      this.itemsMap = {};
    }

  } );
} );
