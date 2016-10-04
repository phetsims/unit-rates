// Copyright 2016, University of Colorado Boulder

/**
 * Model for the 'Shopping' screen.
 * The shopping-only (no lab) model specifics - basically, challenge prompts interaction
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var Challenges = require( 'UNIT_RATES/shopping/model/Challenges' );
  var inherit = require( 'PHET_CORE/inherit' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URShoppingModel = require( 'UNIT_RATES/common/shopping/model/URShoppingModel' );

  /**
   * @constructor
   */
  function ShoppingModel() {

    URShoppingModel.call( this );

    // @public - various callbacks when various challenge events takes place
    this.onChallengeCallback = null;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.challenges = new Challenges( this.itemDataProperty,
      this.addChallengeItemsToNumberLine.bind( this ),
      this.revertChallengeNumberLineItems.bind( this ) );
  }

  unitRates.register( 'ShoppingModel', ShoppingModel );

  return inherit( URShoppingModel, ShoppingModel, {

    /**
     * Adds all correctly answered challenge questions to the number line as items
     * (Note: the number line will ignore duplicates)
     *
     * @protected
     */
    addChallengeItemsToNumberLine: function() {
      var self = this;

      // create a new item on the number line representing the correctly answered challenge questions
      var itemArray = this.challenges.getCorrectAnswerItems( this.itemTypeProperty.value );

      itemArray.forEach( function( item ) {
        var color = ( ( item.countProperty.value === 1 ) ?
                      URConstants.UNIT_RATE_CORRECT_PROMPT_COLOR : URConstants.DEFAULT_CORRECT_PROMPT_COLOR );

        // Check if there is an existing marker
        var correctCost = ( item.countProperty.value * self.itemRateProperty.value );
        var correctUnit = ( item.countProperty.value );

        var existingMarker = null;
        self.numberLine.forEachMarker( function( marker ) {
          if ( marker.getTopValue() === correctCost && marker.getBottomValue() === correctUnit ) {
            existingMarker = marker;
          }
        } );

        // simply change the color
        if ( existingMarker ) {
          existingMarker.color = color;
        }
        else {
          // create a new marker
          self.numberLine.createMarker( correctCost, correctUnit, { color: color } );
        }

      } );

      if ( this.onChallengeCallback ) {
        this.onChallengeCallback.call();
      }
    },

    /**
     * Resets all items representing Challenge answers from the number line. Makes them regular/black markers
     *
     * @protected
     */
    revertChallengeNumberLineItems: function() {

      this.numberLine.forEachMarker( function( marker ) {
        if ( marker.color === URConstants.DEFAULT_CORRECT_PROMPT_COLOR ) {
          marker.color = 'black';
        }
      } );

      if ( this.onChallengeCallback ) {
        this.onChallengeCallback.call();
      }
    },

    // @public
    reset: function() {
      this.challenges.reset();
      URShoppingModel.prototype.reset.call( this );
    }

  } ); // inherit

} ); // define
