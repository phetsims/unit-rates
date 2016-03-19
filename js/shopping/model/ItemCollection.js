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
  var ItemType = require( 'UNIT_RATES/shopping/enum/ItemType' );


  /**
   * @constructor
   */
  function ItemCollection( itemTypeProperty ) {

    // @public (all)
    PropertySet.call( this, {
      items: null // the current item collection
    } );

    var self = this;

    this.itemTypeProperty = itemTypeProperty;

    // @private - the collection of different types of items
    this.itemsMap= {};

    // on item change, fetch the current collection
    this.itemTypeProperty.link( function( type, oldType ) {
      self.items = self.getItemsWithType( type );
    } );
  }

  unitRates.register( 'ItemCollection', ItemCollection );

  return inherit( PropertySet, ItemCollection, {

    // Resets all model elements
    createItem: function( type, unit, rate, initialPosition ) {
      this.items.push( new Item( this.itemTypeProperty.value, unit, rate, initialPosition ) );
    },

    // Gets the collection for a specific type, or create an empty collection if none exists
    getItemsWithType: function( type ) {

      if ( !this.itemsMap.hasOwnProperty( type ) ) {
        console.log( 'New ' + type + ' Collection: ');
        this.itemsMap[ type ] = [];
      }

      return this.itemsMap[ type ];
    },

    // Resets all model elements
    reset: function() {
      this.items = [];
      PropertySet.prototype.reset.call( this );
    }

  } );
} );
