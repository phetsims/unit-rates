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
  var Random = require( 'DOT/Random' );

  // contants
  var RAND = new Random();

  /**
   * @param {Property}.<ItemData> itemDataProperty - the curently selected item
   * @constructor
   */
  function Shelf( itemDataProperty ) {

    ItemCollection.call( this );

    this.itemDataProperty = itemDataProperty;

    // Add initial items
    this.populate();
  }

  unitRates.register( 'Shelf', Shelf );

  return inherit( ItemCollection, Shelf, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Populates teh shelf with the initial items counts for all item types
     * @private
     */
    populate: function() {

      // Iterate over all the different item types
      for (var key in ItemData) {

        var itemData = ItemData[ key ];

        // Only populate empty shelves
        if( this.getNumberOfItemsWithType( itemData.type ) > 0 ) {
          continue;
        }

        switch( itemData.type ) {
          case ItemData.APPLES.type:
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
            break;
          case ItemData.LEMONS.type:
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
            break;
          case ItemData.ORANGES.type:
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
            break;
          case ItemData.PEARS.type:
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
            break;
          case ItemData.CARROTS.type:
              this.createItem( itemData, 4 );
              this.createItem( itemData, 4 );
              this.createItem( itemData, 4 );
              this.createItem( itemData, 4 );
            break;
          case ItemData.CUCUMBERS.type:
              this.createItem( itemData, 3 );
              this.createItem( itemData, 3 );
              this.createItem( itemData, 3 );
              this.createItem( itemData, 3 );
            break;
          case ItemData.POTATOES.type:
              this.createItem( itemData, 3 );
              this.createItem( itemData, 3 );
              this.createItem( itemData, 3 );
              this.createItem( itemData, 3 );
            break;
          case ItemData.TOMATOES.type:
              this.createItem( itemData, 4 );
              this.createItem( itemData, 4 );
              this.createItem( itemData, 4 );
              this.createItem( itemData, 4 );
            break;
          case ItemData.RED_CANDY.type:
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
          break;
          case ItemData.YELLOW_CANDY.type:
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
          break;
          case ItemData.GREEN_CANDY.type:
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
             break;
          case ItemData.BLUE_CANDY.type:
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
              this.createItem( itemData, 5 );
             break;

          default:
            var itemCount = RAND.random() * 7;
            for (var i = 0; i < itemCount; i++) {
              this.createItem( itemData, 1 );
            }
        }
      }
    },

    /**
     * Reset the current item to it's default - basically repopulating the shelf with the original item counts
     * @public
     */
    resetCurrentItem: function() {
      this.resetItemType( this.itemDataProperty.value.type );
      this.populate();
    },

    /**
     * Resets the self to it's default state - repopulating all items
     * @public
     */
   reset: function() {
      ItemCollection.prototype.reset.call( this );
      this.populate();
    }

  } );

} );
