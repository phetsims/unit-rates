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

    // @public - various callbacks when various challenge events takes place
    this.onChallengeCallback = null;

    this.challenges = new Challenges( this.itemDataProperty,
      this.addChallengeItemsToNumberLine.bind( this ),
      this.revertChallengeNumberLineItems.bind( this ) );
  }

  unitRates.register( 'ShoppingModel', ShoppingModel );

  return inherit( URShoppingModel, ShoppingModel, {

    /**
     * Adds all correctly answered challenge questions to the numberline as items (Note: the number line will ignore duplicates)
     * @protected
     */
    addChallengeItemsToNumberLine: function() {
      var self = this;

      // create a new item on the number line representing the correctly answered challenge questions
      var itemArray = this.challenges.getCorrectAnswerItems( this.itemDataProperty.value );

      itemArray.forEach( function( item ) {
        var color =  ( ( item.countProperty.value === 1 ) ?
          ShoppingConstants.UNIT_RATE_CORRECT_PROMPT_COLOR : ShoppingConstants.DEFAULT_CORRECT_PROMPT_COLOR );

        // Check if there is an existing marker
        var correctCost = ( item.countProperty.value * self.itemDataProperty.value.rate.value );
        var correctUnit = ( item.countProperty.value );

        var existingMarker = null;
        self.numberLine.forEachMarker( function( marker ) {
          if ( marker.getTopValue() === correctCost && marker.getBottomValue() === correctUnit ) {
            existingMarker = marker;
          }
        });

        // simply change the color
        if( existingMarker ) {
          existingMarker.color = color;
        }
        else {
          // create a new marker
          self.numberLine.createMarker( correctCost, correctUnit, { color: color } );
        }

      } );

      if( this.onChallengeCallback ) {
        this.onChallengeCallback.call();
      }
    },

    /**
     * Resets all items representing Challenge answers from the number line. Makes them regular/black markers
     * @protected
     */
    revertChallengeNumberLineItems: function() {

      this.numberLine.forEachMarker( function( marker ) {
        if( marker.color === ShoppingConstants.DEFAULT_CORRECT_PROMPT_COLOR ) {
          marker.color = 'black';
        }
      });

      if( this.onChallengeCallback ) {
        this.onChallengeCallback.call();
      }
    },

    // Resets all model elements
    reset: function() {
      this.challenges.reset();
      URShoppingModel.prototype.reset.call( this );
    }

  } ); // inherit

} ); // define
