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
   *
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

    /**
     * Populates the initial for item types for the shelf
     * @private
     */
    populate: function() {

      // populate initial shelf content
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
     *
     * @public
     */
    resetCurrentItem: function() {
      this.resetItemType( this.itemDataProperty.value.type );
      this.populate();
    },

    /**
     * Resets all model elements
     * @private
     */
   reset: function() {
      ItemCollection.prototype.reset.call( this );
      this.populate();
    }

  } );

} );
