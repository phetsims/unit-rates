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
  var ItemCollection = require( 'UNIT_RATES/common/shopping/model/ItemCollection' );
  var NumberLineItem = require( 'UNIT_RATES/common/shopping/model/NumberLineItem' );

  /**
   * @param {Property.<ItemData>} itemDataProperty - the curently selected item
   * @constructor
   */
  function NumberLine( itemDataProperty ) {
    var self = this;

    // @public (all)
    ItemCollection.call( this, {
    } );

    // @public
    this.itemDataProperty = itemDataProperty;

    // update value text on cost/weight change
    this.itemDataProperty.link( function( value, oldValue ) {

      // reassign the rate update function to the current item type
      if( oldValue ) {
        oldValue.rate.unlink( self.updateNumberLineItemRate );
      }
      value.rate.link( self.updateNumberLineItemRate.bind( self ) );
    } );

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
     * Does not allow for new items which equal existing items but will replace existing items with challenge items,
     * as these take precendence over standard/non-challenge items.
     *
     * @param {NumberLineItem} item
     * @param {boolean} [replace]
     * @public @override
     */
     addItem: function( item ) {
      var self = this;

      var itemArray = this.getItemsWithType( item.type );
      var existingItem = this.containsItem( item );
      if ( existingItem === null ) {
        itemArray.add( item );
      }
      else if ( item.isChallenge ) {
        self.removeItem( existingItem );
        item.dispose();
        itemArray.add( item );
      }
    },

    /**
     * Updates the rate of the items  on currently on the number line (except editable items)
     * @protected
     */
    updateNumberLineItemRate: function() {
      var self = this;

      var itemArray = this.getItemsWithType( this.itemDataProperty.value.type ); // NumberLineItems
      itemArray.forEach( function( item ) {
        item.setRate( self.itemDataProperty.value.rate.value );
      } );
    },

    /**
     * Changes all items representing Challenge answers to regluar/black markers on the number line.
     * @public
     */
     resetChallengeItems: function() {

      var itemArray = this.getItemsWithType( this.itemDataProperty.value.type ); // NumberLineItems
      itemArray.forEach( function( item ) {
        if ( item.isChallenge ) {
          item.isChallenge  = false;
          item.isChallengeUnitRate = false;
        }
      } );
    }

  } ); // inherit

} ); // define
