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
  var ItemCollection = require( 'UNIT_RATES/shopping/model/ItemCollection' );
  var CostUnitQuestionAnswer = require( 'UNIT_RATES/shopping/model/CostUnitQuestionAnswer' );

  /**
   *
   * @constructor
   */
  function NumberLine( itemDataProperty ) {

    // @public (all)
    ItemCollection.call( this, itemDataProperty, {
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
     * @return {Item}
     * @public @override
     */
    createItem: function( data, count ) {
      var item = new CostUnitQuestionAnswer( data, count );
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
      if( !this.containsItem( item ) ) {
        itemArray.add( item );
      }
    },

    /**
     *
     * @param {Item} item
     * @return {boolean}
     * @public
     */
    containsItem: function( item ) {

      var itemArray = this.getItemsWithType( item.type );

      var itemExists = false;
      if( itemArray.contains( item ) ) {
        itemExists = true;
      }
      else {
        itemArray.forEach( function( existingItem ) {
          if( item.isEqual( existingItem ) ) {
            itemExists = true;
          }
        } );
      }

      return itemExists;
    },

    /**
     * @public
     */
    reset: function() {
      ItemCollection.prototype.reset.call( this );
    }

  } );

} );
