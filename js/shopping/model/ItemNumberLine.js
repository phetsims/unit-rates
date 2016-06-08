// Copyright 2002-2016, University of Colorado Boulder

/**
 * All the items currently on the number line
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  //var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var ItemCollection = require( 'UNIT_RATES/shopping/model/ItemCollection' );
  var ItemMarker = require( 'UNIT_RATES/shopping/model/ItemMarker' );

  /**
   *
   * @constructor
   */
  function ItemNumberLine( itemDataProperty ) {

    // @public (all)
    ItemCollection.call( this, itemDataProperty, {
    } );

    // @public
    this.itemDataProperty = itemDataProperty;

    // update value text
    itemDataProperty.link( function( value, oldValue ) {
    } );
  }

  unitRates.register( 'ItemNumberLine', ItemNumberLine );

  return inherit( ItemCollection, ItemNumberLine, {

    /**
     * Creates a new item/adds it to the types specific array
     * @param {ItemData} data
     * @param {number} [count]
     * @return {Item}
     * @public @override
     */
    createItem: function( data, count, editable ) {
      var item = new ItemMarker( data, count, editable );
      this.addItem( item );
      return item;
    },

    /**
     * Adds an item to the types specific array
     * Does not allow for new items which equal existing items
     *
     * @param {Item} item
     * @override @public
     */
     addItem: function( item ) {
      var itemArray = this.getItemsWithType( item.type );
      if( !itemArray.contains( item ) ) {

        var itemExists = false;
        itemArray.forEach( function( existingItem ) {
          if( item.isEqual( existingItem ) ) {
            itemExists = true;
          }
        } );

        if( !itemExists ) {
          itemArray.add( item );
        }
      }
    },

    /**
     * @public
     */
    reset: function() {
      ItemCollection.prototype.reset.call( this );
    }

  } );

} );
