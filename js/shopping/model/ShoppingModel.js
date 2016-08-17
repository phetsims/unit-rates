// Copyright 2002-2016, University of Colorado Boulder

/**
 * The shopping-only (no lab) model specifics - basically, challenge prompts interaction
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URShoppingModel = require( 'UNIT_RATES/common/shopping/model/URShoppingModel' );
  var Challenges = require( 'UNIT_RATES/shopping/model/Challenges' );

  /**
   * @constructor
   */
  function ShoppingModel() {

    URShoppingModel.call( this );

    this.challenges = new Challenges( this.itemDataProperty, this.addChallengeItemsToNumberline.bind( this ) );
  }

  unitRates.register( 'ShoppingModel', ShoppingModel );

  return inherit( URShoppingModel, ShoppingModel, {

    /**
     * Add local listener for item additions/removals. This is needed on initialization and on a reset all
     * @override @protected
     */
    addArrayListeners: function() {
      var self = this;

      // item add/remove listeners
      this.numberLine.addListeners(
        function( item, observableArray ) {
      },
        function( item, observableArray ) {
          // If the numberline is cleared, add back the scale contents and correct challenge questions answered
          if ( observableArray.length === 0 ) {
            self.addScaleItemsToNumberline();
            self.addChallengeItemsToNumberline();
          }
      } );
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
        self.numberLine.createItem( self.itemDataProperty.value, item.count, {
          isChallenge: true,
          isChallengeUnitRate: ( item.count === 1 )
        } );
      } );
    },

    /**
     * Resets all items representing Challenge answers from the number line. Makes them regular/black markers
     * @protected
     */
    resetChallengeNumberlineItems: function() {
        this.numberLine.resetChallengeItems();
    },

    // Resets all model elements
    reset: function() {
      this.challenges.reset();
      URShoppingModel.prototype.reset.call( this );
    }

  } ); // inherit

} ); // define
