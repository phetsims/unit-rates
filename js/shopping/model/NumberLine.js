// Copyright 2002-2016, University of Colorado Boulder

/**
 * Holds the items currently on the number line
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemCollection = require( 'UNIT_RATES/shopping/model/ItemCollection' );
  var NumberLineItem = require( 'UNIT_RATES/shopping/model/NumberLineItem' );

  /**
   * @param {Property}.<ItemData> itemDataProperty - the curently selected item
   * @constructor
   */
  function NumberLine( itemDataProperty ) {

    // @public (all)
    ItemCollection.call( this, {
    } );

    // @public
    this.itemDataProperty = itemDataProperty;
  }

  unitRates.register( 'NumberLine', NumberLine );

  return inherit( ItemCollection, NumberLine, {

    /**
     * Creates a new item/adds it to the types specific array
     * @param {ItemData} data
     * @param {number} [count]
     * @param {Object} [options]
     * @return {Item}
     * @public @override
     */
    createItem: function( data, count, options ) {
      var item = new NumberLineItem( data, count, options );
      this.addItem( item );
      return item;
    },

    /**
     * Adds an item to the types specific array
     * Does not allow for new items which equal existing items
     *
     * @param {Item} item
     * @public @override
     */
     addItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );
      if( !this.containsItem( item ) ) {
        itemArray.add( item );
      }
    }

  } ); // inherit

} ); // define
