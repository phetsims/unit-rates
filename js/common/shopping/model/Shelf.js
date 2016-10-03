// Copyright 2016, University of Colorado Boulder

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
  var ItemCollection = require( 'UNIT_RATES/common/shopping/model/ItemCollection' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );

  /**
   * @param {Property.<ItemData>} itemTypeProperty - the currently selected item type
   * @constructor
   */
  function Shelf( itemTypeProperty ) {

    ItemCollection.call( this );

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.itemTypeProperty = itemTypeProperty;

    // Add initial items
    this.populate();
  }

  unitRates.register( 'Shelf', Shelf );

  return inherit( ItemCollection, Shelf, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Populates the shelf with the initial items counts for all item types
     * @protected
     */
    populate: function() {

      // Iterate over all the different item types
      for ( var key in ItemData ) {
        var itemData = ItemData[ key ];
        this.populateItemType( itemData.type );
      }
    },

    /**
     * Populates the shelf with the initial items counts for the specified item type
     * @param {string} itemType - this will be a <type> from ItemData
     * @private
     */
    populateItemType: function( itemType ) {

      // Only populate empty shelves
      if ( this.getNumberOfItemsWithType( itemType ) > 0 ) {
        return;
      }

      switch( itemType ) {
        case ItemData.APPLES.type:
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          break;
        case ItemData.LEMONS.type:
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          break;
        case ItemData.ORANGES.type:
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          break;
        case ItemData.PEARS.type:
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          break;
        case ItemData.CARROTS.type:
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          break;
        case ItemData.CUCUMBERS.type:
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          break;
        case ItemData.POTATOES.type:
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          break;
        case ItemData.TOMATOES.type:
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          break;
        case ItemData.PURPLE_CANDY.type:
          this.createItem( itemType, .4 );
          this.createItem( itemType, .4 );
          this.createItem( itemType, .4 );
          this.createItem( itemType, .4 );
          break;
        case ItemData.RED_CANDY.type:
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          break;
        case ItemData.GREEN_CANDY.type:
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          break;
        case ItemData.BLUE_CANDY.type:
          this.createItem( itemType, .4 );
          this.createItem( itemType, .4 );
          this.createItem( itemType, .4 );
          this.createItem( itemType, .4 );
          break;
        default:
          assert && assert( false, 'Cannot populate unrecognized type' );
      }
    },

    /**
     * Reset the current item to it's default - basically repopulating the shelf with the original item counts
     * @public
     */
    resetCurrentItem: function() {
      this.resetItemType( this.itemTypeProperty.value );
      this.populateItemType( this.itemTypeProperty.value );
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
