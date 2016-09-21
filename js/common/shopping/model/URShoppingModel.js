// Copyright 2002-2016, University of Colorado Boulder

/**
 * The base shopping model - shelf, scale & number line.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Shelf = require( 'UNIT_RATES/common/shopping/model/Shelf' );
  var Scale = require( 'UNIT_RATES/common/shopping/model/Scale' );
  var NumberLine = require( 'UNIT_RATES/common/shopping/model/NumberLine' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );

  /**
   * @constructor
   */
  function URShoppingModel() {

    // @public (all)
    PropertySet.call( this, {
      itemData: ItemData.APPLES   // the currently selected item type (& the associated static attributes)
    } );

    // @public
    this.shelf      = new Shelf( this.itemDataProperty );
    this.scale      = new Scale( this.itemDataProperty );
    this.numberLine = new NumberLine( this.itemDataProperty );
  }

  unitRates.register( 'URShoppingModel', URShoppingModel );

  return inherit( PropertySet, URShoppingModel, {

    /**
     * Removes an item from the shelf and adds it to the scale
     * @param {Item} item
     * @public
     */
    addShelfItemToScale: function( item ) {

      // Remove from shelf & add to scale
      this.shelf.removeItem( item );
      this.scale.addItem(item );
    },

    /**
     * Removes an item from the scale and adds it to the shelf
     * @param {Item} item
     * @public
     */
    addScaleItemToShelf: function( item ) {

      // Remove from scale & add to shelf
      this.scale.removeItem( item );
      this.shelf.addItem( item );
    },

    /**
     * Adds all items on the scale to the numberline (Note: the number line will ignore duplicates)
     * @protected
     */
    addScaleItemsToNumberline: function() {

      // create a new item on the number line representing the total number/weight of items currently on the scale
      var count = this.scale.getItemCount();
      if ( count > 0 ) {
        this.numberLine.createItem( this.itemDataProperty.value, count );
      }
    },

    // Resets all model elements
    reset: function() {
      this.shelf.reset();
      this.scale.reset();
      this.numberLine.reset();
      PropertySet.prototype.reset.call( this );
    }

  } ); // inherit

} ); // define
