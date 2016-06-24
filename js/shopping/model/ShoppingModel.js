// Copyright 2002-2016, University of Colorado Boulder

/**
 * The whole enchilada - shelf, scale, number line & challenges
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Shelf = require( 'UNIT_RATES/shopping/model/Shelf' );
  var Scale = require( 'UNIT_RATES/shopping/model/Scale' );
  var NumberLine = require( 'UNIT_RATES/shopping/model/NumberLine' );
  var Challenges = require( 'UNIT_RATES/shopping/model/Challenges' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );

  /**
   * @constructor
   */
  function ShoppingModel() {

    // @public (all)
    PropertySet.call( this, {
      itemData: ItemData.APPLES   // the currently selected item type (& teh associated static attributes)
    } );

    // @public
    this.shelf      = new Shelf( this.itemDataProperty );
    this.scale      = new Scale( this.itemDataProperty );
    this.numberLine = new NumberLine( this.itemDataProperty );
    this.challenges = new Challenges( this.itemDataProperty, this.addChallengeItemsToNumberline.bind( this ) );

    this.addArrayListeners();
  }

  unitRates.register( 'ShoppingModel', ShoppingModel );

  return inherit( PropertySet, ShoppingModel, {

    /**
     * Add local listener for item additions/removals. This is needed on initialization and on a reset all
     * @protected
     */
    addArrayListeners: function() {

      var self = this;

      // item add/remove listeners
      this.numberLine.addListeners(
        function( item, observableArray ) {
      },
        function( item, observableArray ) {
          // If the numberline is cleared, add back the scale contents and correct challenge questions answered
          if( observableArray.length === 0 ) {
            self.addScaleItemsToNumberline();
            self.addChallengeItemsToNumberline();
          }
      } );
    },

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
      var count = this.scale.getItemCount() ;
      if( count > 0 ) {
        this.numberLine.createItem( this.itemDataProperty.value, count, false );
      }
    },

    /**
     * Adds all correctly answered challenge questions to the numberline as items (Note: the number line will ignore duplicates)
     * @protected
     */
    addChallengeItemsToNumberline: function() {

      var self = this;

      // create a new item on the number line representing the correctly answered challenge questions
      var itemArray = this.challenges.getCorrectAnswerItems( this.itemDataProperty.value );
      itemArray.forEach( function( item ) {
        self.numberLine.createItem( self.itemDataProperty.value, item.count, false );
      } );
    },

    // Resets all model elements
    reset: function() {

      this.shelf.reset();
      this.scale.reset();
      this.numberLine.reset();
      this.challenges.reset();
      PropertySet.prototype.reset.call( this );
      this.addArrayListeners();
    }

  } ); // inherit

} ); // define
