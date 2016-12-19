// Copyright 2016, University of Colorado Boulder

/**
 * Model for the 'Shopping' screen.
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var OLDChallenges = require( 'UNIT_RATES/old/shopping/model/OLDChallenges' );
  var OLDItemData = require( 'UNIT_RATES/old/common/shopping/model/OLDItemData' );
  var OLDShoppingScene = require( 'UNIT_RATES/old/common/shopping/model/OLDShoppingScene' );
  var OLDURConstants = require( 'UNIT_RATES/old/common/OLDURConstants' );
  var OLDURShoppingModel = require( 'UNIT_RATES/old/common/shopping/model/OLDURShoppingModel' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var appleImage = require( 'image!UNIT_RATES/apple.png' );
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );

  /**
   * @param {Object} options
   * @constructor
   */
  function OLDShoppingModel( options ) {

    var scenes = [
      new OLDShoppingScene( 'fruit', appleImage, [ OLDItemData.APPLES, OLDItemData.LEMONS, OLDItemData.ORANGES, OLDItemData.PEARS ] ),
      new OLDShoppingScene( 'produce', carrotImage, [ OLDItemData.CARROTS, OLDItemData.CUCUMBERS, OLDItemData.POTATOES, OLDItemData.TOMATOES ] ),
      new OLDShoppingScene( 'candy', purpleCandyImage, [ OLDItemData.PURPLE_CANDY, OLDItemData.RED_CANDY, OLDItemData.GREEN_CANDY, OLDItemData.BLUE_CANDY ] )
    ];

    OLDURShoppingModel.call( this, scenes, options );

    // @public - various callbacks when various challenge events takes place
    this.onChallengeCallback = null;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.challenges = new OLDChallenges( this.itemDataProperty,
      this.addChallengeItemsToNumberLine.bind( this ),
      this.revertChallengeNumberLineItems.bind( this ) );
  }

  unitRates.register( 'OLDShoppingModel', OLDShoppingModel );

  return inherit( OLDURShoppingModel, OLDShoppingModel, {

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
                      OLDURConstants.UNIT_RATE_CORRECT_PROMPT_COLOR : OLDURConstants.DEFAULT_CORRECT_PROMPT_COLOR );

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
        if ( marker.color === OLDURConstants.DEFAULT_CORRECT_PROMPT_COLOR ) {
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
      OLDURShoppingModel.prototype.reset.call( this );
    }

  } );
} );
