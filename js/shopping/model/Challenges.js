// Copyright 2002-2016, University of Colorado Boulder

/**
 * All the challenge information for all items
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var ChallengeQuestionAnswer = require( 'UNIT_RATES/common/model/ChallengeQuestionAnswer' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Random = require( 'DOT/Random' );
  var Util = require( 'DOT/Util' );

  // strings
  var unitRateQuestionString = require( 'string!UNIT_RATES/UnitRateQuestion' );
  var costOfQuestionString = require( 'string!UNIT_RATES/CostOfQuestion' );
  var forQuestionString = require( 'string!UNIT_RATES/forQuestion' );

  // constants
  var RAND = new Random();


  /**
   *
   * @constructor
   */
  function Challenges( itemDataProperty ) {

    this.itemDataProperty = itemDataProperty;
    this.populate();
  }

  unitRates.register( 'Challenges', Challenges );

  return inherit( Object, Challenges, {

    /**
     * Populates the initial questions/values for all item types
     * @private
     */
    getQuestionAnswer: function( index ) {

      var itemData = this.itemDataProperty.value;
      var challengeData = this.challengeData[ itemData.type ];

      // FIME: check bounds

      return challengeData[ index ];
    },

    /**
     * Populates the initial questions/values for all item types
     * @private
     */
    populate: function() {

      this.challengeData = {};

      // create questions & answers
      for (var key in ItemData) {
        var itemData = ItemData[ key ];
        this.generateQuestionsAnswersForItem( itemData );
      }
    },

    /**
     * Populates the initial questions/values for item types
     * @private
     */
    generateQuestionsAnswersForItem: function( itemData ) {

      var itemName = itemData.type;

      if ( itemData.type === ItemData.RED_CANDY.type   || itemData.type === ItemData.YELLOW_CANDY.type ||
           itemData.type === ItemData.GREEN_CANDY.type || itemData.type === ItemData.BLUE_CANDY.type )  {
        console.log('is candy');
      } else {

        // Q: Unit rate
        var q0 = new ChallengeQuestionAnswer( unitRateQuestionString, itemData.rate );

        // Q: Cost of # <type>?
        var itemCount1 = this.getNextInt( ShoppingConstants.MAX_ITEMS, [] );
        var itemCost1 = itemCount1 * itemData.rate;
        var CostOfQuestionString1 =  StringUtils.format( costOfQuestionString, itemCount1, itemName );
        var q1 = new ChallengeQuestionAnswer( CostOfQuestionString1, itemCost1 );

        // Q: Cost of # <type>?
        var itemCount2 =  this.getNextInt( ShoppingConstants.MAX_ITEMS, [ itemCount2 ] );
        var itemCost2 = itemCount2 * itemData.rate;
        var CostOfQuestionString2=  StringUtils.format( costOfQuestionString, itemCount2, itemName );
        var q2 = new ChallengeQuestionAnswer( CostOfQuestionString2, itemCost2 );

        // Q: <type> for $?
        var itemCount3 = this.getNextInt( ShoppingConstants.MAX_ITEMS, [] );
        var itemCost3 = itemCount3 * itemData.rate;
        var forQuestionString3 =  StringUtils.format( forQuestionString, itemName, Util.toFixed( itemCost3, 2 ) );
        var q3 = new ChallengeQuestionAnswer( forQuestionString3, itemCount3 );

        this.challengeData[ itemData.type ] = [ q0, q1, q2, q3 ];
      }
    },

    /**
     * Gets a random integer in the range [1 - max] not in the 'taken' list
     *
     * @param {number}
     * @return {number}
     *
     * @private
     *
     */
    getNextInt: function( max, takenList ) {

      var value = 0;
      while( value === 0 || takenList.indexOf( value ) >= 0 ) {
        value = RAND.nextInt( max );
      }

      return value;
    },

    /**
     *
     * @public
     */
    reset: function() {
      this.populate();
    }

  } );

} );
