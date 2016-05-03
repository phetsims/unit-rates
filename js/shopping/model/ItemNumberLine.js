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

  /**
   *
   * @constructor
   */
  function ItemNumberLine( itemDataProperty ) {

    // @public (all)
    ItemCollection.call( this, itemDataProperty, {
    } );

    this.itemDataProperty = itemDataProperty;

    // update value text
    itemDataProperty.link( function( value, oldValue ) {
    } );

  }

  unitRates.register( 'ItemNumberLine', ItemNumberLine );

  return inherit( ItemCollection, ItemNumberLine, {


    /**
     * Adds an item to the types specific array
     * Do not allow for new items which equal existing existing items
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
     * Returns an array of available unused item count 'slots' on the numberline
     * For example, if the number line is populated with 1,2,3,5,6,8 items, this
     * will return [4,7, ..., maxCount]
     *
     * @param {Number} maxCount
     * @returns {Array.<Number>}
     * @protected
     */
     getAvailableCounts: function( maxCount ) {

      var itemData = this.itemDataProperty.value;

      // generate array of [1 .. maxCount]
      var fullCounts =_.range(1, maxCount+1);

      // get the current array for the item type
      var itemArray = this.getItemsWithType( itemData.type );

      // generate array of of all current counts
      var itemCounts = [ ];
      itemArray.forEach( function( item ) {
        itemCounts.push( item.count );
      } );

      // return the available (unused) counts
      return _.difference( fullCounts, itemCounts );
    },

    /**
     * @public
     */
    reset: function() {
      ItemCollection.prototype.reset.call( this );
    }

  } );

} );
