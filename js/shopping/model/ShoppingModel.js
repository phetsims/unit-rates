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
  var ShoppingConstants = require( 'UNIT_RATES/common/shopping/ShoppingConstants' );
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
     * Adds all correctly answered challenge questions to the numberline as items (Note: the number line will ignore duplicates)
     * @protected
     */
    addChallengeItemsToNumberline: function() {
      var self = this;

      // create a new item on the number line representing the correctly answered challenge questions
      var itemArray = this.challenges.getCorrectAnswerItems( this.itemDataProperty.value );

      itemArray.forEach( function( item ) {
        var color =  ( ( item.countProperty.value === 1 ) ?
          ShoppingConstants.UNIT_RATE_CORRECT_PROMPT_COLOR : ShoppingConstants.DEFAULT_CORRECT_PROMPT_COLOR );
        self.numberLine.createItem( self.itemDataProperty.value, item.countProperty.value, { color: color } );
      } );
    },

    /**
     * Resets all items representing Challenge answers from the number line. Makes them regular/black markers
     * @protected
     */
    resetChallengeNumberlineItems: function() {
      this.numberLine.forEachMarker( function( marker ) {
        marker.color = 'black';
      });
    },

    // Resets all model elements
    reset: function() {
      this.challenges.reset();
      URShoppingModel.prototype.reset.call( this );
    }

  } ); // inherit

} ); // define
