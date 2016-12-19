// Copyright 2016, University of Colorado Boulder

/**
 * All the items currently on the shelf
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var OLDItemCollection = require( 'UNIT_RATES/old/common/shopping/model/OLDItemCollection' );
  var OLDItemData = require( 'UNIT_RATES/old/common/shopping/model/OLDItemData' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Property.<OLDItemData>} itemTypeProperty - the currently selected item type
   * @constructor
   */
  function OLDShelf( itemTypeProperty ) {

    OLDItemCollection.call( this );

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.itemTypeProperty = itemTypeProperty;

    // Add initial items
    this.populate();
  }

  unitRates.register( 'OLDShelf', OLDShelf );

  return inherit( OLDItemCollection, OLDShelf, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Populates the shelf with the initial items counts for all item types
     *
     * @protected
     */
    populate: function() {

      // Iterate over all the different item types
      for ( var key in OLDItemData ) {
        var itemData = OLDItemData[ key ];
        this.populateItemType( itemData.type );
      }
    },

    /**
     * Populates the shelf with the initial items counts for the specified item type
     *
     * @param {string} itemType - this will be a <type> from OLDItemData
     * @private
     */
    populateItemType: function( itemType ) {

      // Only populate empty shelves
      if ( this.getNumberOfItemsWithType( itemType ) > 0 ) {
        return;
      }

      switch( itemType ) {
        case OLDItemData.APPLES.type:
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          break;
        case OLDItemData.LEMONS.type:
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          break;
        case OLDItemData.ORANGES.type:
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          break;
        case OLDItemData.PEARS.type:
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          this.createItem( itemType, 5 );
          break;
        case OLDItemData.CARROTS.type:
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          break;
        case OLDItemData.CUCUMBERS.type:
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          break;
        case OLDItemData.POTATOES.type:
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          this.createItem( itemType, 3 );
          break;
        case OLDItemData.TOMATOES.type:
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          this.createItem( itemType, 4 );
          break;
        case OLDItemData.PURPLE_CANDY.type:
          this.createItem( itemType, .4 );
          this.createItem( itemType, .4 );
          this.createItem( itemType, .4 );
          this.createItem( itemType, .4 );
          break;
        case OLDItemData.RED_CANDY.type:
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          break;
        case OLDItemData.GREEN_CANDY.type:
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          this.createItem( itemType, .3 );
          break;
        case OLDItemData.BLUE_CANDY.type:
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
     *
     * @public
     */
    resetCurrentItem: function() {
      this.resetItemType( this.itemTypeProperty.value );
      this.populateItemType( this.itemTypeProperty.value );
    },

    // @public
    reset: function() {
      OLDItemCollection.prototype.reset.call( this );
      this.populate();
    }

  } );

} );
