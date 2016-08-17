// Copyright 2002-2016, University of Colorado Boulder

/**
 * All the challenge questions for all items
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ShoppingConstants = require( 'UNIT_RATES/common/shopping/ShoppingConstants' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var Item = require( 'UNIT_RATES/common/shopping/model/Item' );
  var QuestionAnswer = require( 'UNIT_RATES/common/model/QuestionAnswer' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Random = require( 'DOT/Random' );
  var Util = require( 'DOT/Util' );

  // strings
  var unitRateQuestionString = require( 'string!UNIT_RATES/unitRateQuestion' );
  var costOfQuestionString = require( 'string!UNIT_RATES/costOfQuestion' );
  var forQuestionString = require( 'string!UNIT_RATES/forQuestion' );
  var poundString = require( 'string!UNIT_RATES/pound' );
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var lbsString = require( 'string!UNIT_RATES/lbs' );
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );
  var appleString = require( 'string!UNIT_RATES/apple' );
  var appleCapString = require( 'string!UNIT_RATES/appleCap' );
  var applesString = require( 'string!UNIT_RATES/apples' );
  var applesCapString = require( 'string!UNIT_RATES/applesCap' );
  var lemonString = require( 'string!UNIT_RATES/lemon' );
  var lemonCapString = require( 'string!UNIT_RATES/lemonCap' );
  var lemonsString = require( 'string!UNIT_RATES/lemons' );
  var lemonsCapString = require( 'string!UNIT_RATES/lemonsCap' );
  var orangeString = require( 'string!UNIT_RATES/orange' );
  var orangeCapString = require( 'string!UNIT_RATES/orangeCap' );
  var orangesString = require( 'string!UNIT_RATES/oranges' );
  var orangesCapString = require( 'string!UNIT_RATES/orangesCap' );
  var pearString = require( 'string!UNIT_RATES/pear' );
  var pearCapString = require( 'string!UNIT_RATES/pearCap' );
  var pearsString = require( 'string!UNIT_RATES/pears' );
  var pearsCapString = require( 'string!UNIT_RATES/pearsCap' );
  var carrotString = require( 'string!UNIT_RATES/carrot' );
  var carrotCapString = require( 'string!UNIT_RATES/carrotCap' );
  var carrotsString = require( 'string!UNIT_RATES/carrots' );
  var carrotsCapString = require( 'string!UNIT_RATES/carrotsCap' );
  var cucumberString = require( 'string!UNIT_RATES/cucumber' );
  var cucumberCapString = require( 'string!UNIT_RATES/cucumberCap' );
  var cucumbersString = require( 'string!UNIT_RATES/cucumbers' );
  var cucumbersCapString = require( 'string!UNIT_RATES/cucumbersCap' );
  var potatoeString = require( 'string!UNIT_RATES/potatoe' );
  var potatoeCapString = require( 'string!UNIT_RATES/potatoeCap' );
  var potatoesString = require( 'string!UNIT_RATES/potatoes' );
  var potatoesCapString = require( 'string!UNIT_RATES/potatoesCap' );
  var tomatoString = require( 'string!UNIT_RATES/tomato' );
  var tomatoCapString = require( 'string!UNIT_RATES/tomatoCap' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );
  var tomatoesCapString = require( 'string!UNIT_RATES/tomatoesCap' );

  // constants
  var RAND = new Random();

  /**
   * @param {Property}.<ItemData> itemDataProperty - the curently selected item
   * @param {function} onCorrectAnswer - function to call when the correct answer is input
   * @constructor
   */
  function Challenges( itemDataProperty, onCorrectAnswer ) {

    this.itemDataProperty = itemDataProperty;
    this.onCorrectAnswer  = onCorrectAnswer;
    this.populate();
  }

  unitRates.register( 'Challenges', Challenges );

  return inherit( Object, Challenges, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Retrieves the question for a specific index of the current item type
     * @returns {QuestionAnswer}
     * @public
     */
    getQuestionAnswer: function( index ) {

      var itemData = this.itemDataProperty.value;
      var challengeData = this.challengeData[ itemData.type ];
      assert && assert( index < challengeData.length, 'invalid question index' );

      return challengeData[ index ];
    },

    /**
     * Populates the initial questions/values for all item types (i.e. apples, carrots, red candy)
     * @public
     */
    populate: function() {

      this.challengeData = {};

      // create questions & answers
      for( var key in ItemData ) {
        var itemData = ItemData[ key ];
        this.generateQuestionsAnswersForItem( itemData );
      }
    },

    /**
     * Re-populates the initial questions/values for the current item type (i.e. apples, carrots, red candy).
     * @public
     */
    refresh: function() {

      var itemData = this.itemDataProperty.value;

      // get the current set of questions for the item type
      var oldQnAArray = this.challengeData[ itemData.type ];

      // get the first question correctness
      var oldQ1 = oldQnAArray.shift();
      var oldQ1Correct = oldQ1.isAnswerCorrect();

      // dispose of old questions
      oldQnAArray.forEach( function( qna ) {
        qna.dispose();
      } );
      this.challengeData[ itemData.type ] = [];

      // generate new question
      this.generateQuestionsAnswersForItem( itemData );

      // set the unit rate question to correct?
      if ( oldQ1Correct ) {
        // get the new set of questions for the item type
        var newQnAArray = this.challengeData[ itemData.type ];

        // set unit rate question to correct
        var newQ1 = newQnAArray[0];
        newQ1.setCorrect( true );
      }
    },

    /**
     * Generates a set (currently 4) of challenge questions for a specific item type.
     * @param {ItemData} - itemData
     * @private
     */
    generateQuestionsAnswersForItem: function( itemData ) {

      if ( itemData.type === ItemData.RED_CANDY.type   || itemData.type === ItemData.PURPLE_CANDY.type ||
           itemData.type === ItemData.GREEN_CANDY.type || itemData.type === ItemData.BLUE_CANDY.type )  {

        // Q: Unit rate
        var candyItem1 = new Item( itemData, 1 );
        var candyAnswerText1 =  StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemData.rate, 2 ) );
        var c1 = new QuestionAnswer( candyItem1, itemData.rate, candyAnswerText1, {
          questionString: unitRateQuestionString,
          unitString: poundString
        } );

        // Q: Cost of # <type>?
        var candyItem2 = this.getPromptItem( itemData, ShoppingConstants.MAX_ITEMS, [] );
        var candyCost2 = Util.toFixedNumber( candyItem2.count * itemData.rate, 2 );
        var candyAnswerText2 =  StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( candyCost2, 2 ) );
        var candyUnitString2 = candyItem2.count + ' ' + poundsString;
        var costOfCandyQuestionString2 =  StringUtils.format( costOfQuestionString, candyItem2.count, lbsString );
        var c2 = new QuestionAnswer( candyItem2, candyCost2, candyAnswerText2, {
          questionString: costOfCandyQuestionString2,
          unitString: candyUnitString2,
          onCorrectAnswerCallback: this.onCorrectAnswer
        }  );

        // Q: Cost of # <type>?
        var candyItem3 = this.getPromptItem( itemData, ShoppingConstants.MAX_ITEMS, [] );
        var candyCost3 =  Util.toFixedNumber( candyItem3.count * itemData.rate, 2 );
        var candyAnswerText3 =  StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( candyCost3, 2 ) );
        var candyUnitString3 = candyItem3.count + ' ' + poundsString;
        var costOfCandyQuestionString3 =  StringUtils.format( costOfQuestionString, candyItem3.count, lbsString );
        var c3 = new QuestionAnswer( candyItem3, candyCost3, candyAnswerText3, {
          questionString: costOfCandyQuestionString3,
          unitString: candyUnitString3,
          onCorrectAnswerCallback: this.onCorrectAnswer
        }  );

        // Q: Cost of # <type>?
        var candyItem4 = this.getPromptItem( itemData, ShoppingConstants.MAX_ITEMS, [] );
        var candyCost4 =  Util.toFixedNumber( candyItem4.count * itemData.rate, 2 );
        var candyAnswerText4 =  StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( candyCost4, 2 ) );
        var candyUnitString4 = candyItem4.count + ' ' + poundsString;
        var costOfCandyQuestionString4 =  StringUtils.format( costOfQuestionString, candyItem4.count, lbsString );
        var c4 = new QuestionAnswer( candyItem4, candyCost4, candyAnswerText4, {
          questionString: costOfCandyQuestionString4,
          unitString: candyUnitString4,
          onCorrectAnswerCallback: this.onCorrectAnswer
        }  );

        this.challengeData[ itemData.type ] = [ c1, c2, c3, c4 ];

      } else {

        //var name          = this.getNameForItemType(itemData.type, false, false );
        var nameCap       = this.getNameForItemType(itemData.type, false, true );
        var namePlural    = this.getNameForItemType(itemData.type, true, false );
        var namePluralCap = this.getNameForItemType(itemData.type, true, true );

        // Q: Unit rate
        var item1 = new Item( itemData, 1 );
        var itemAnswerText1 =  StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemData.rate, 2 ) );
        var i1 = new QuestionAnswer( item1, itemData.rate, itemAnswerText1, {
          questionString: unitRateQuestionString,
          unitString: nameCap,
           onCorrectAnswerCallback: this.onCorrectAnswer
        }  );

        // Q: Cost of # <type>?
        var item2 = this.getPromptItem( itemData, ShoppingConstants.MAX_ITEMS, [] );
        var itemCost2 =  Util.toFixedNumber( item2.count * itemData.rate, 2 );
        var itemAnswerText2 =  StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemCost2, 2 ) );
        var itemUnitString2 = item2.count + ' ' + namePluralCap;
        var costOfItemQuestionString2 =  StringUtils.format( costOfQuestionString, item2.count, namePlural );
        var i2 = new QuestionAnswer( item2, itemCost2, itemAnswerText2, {
          questionString: costOfItemQuestionString2,
          unitString: itemUnitString2,
          onCorrectAnswerCallback: this.onCorrectAnswer
        }  );

        // Q: Cost of # <type>?
        var item3 =  this.getPromptItem( itemData, ShoppingConstants.MAX_ITEMS, [ item2.count ] );
        var itemCost3 =  Util.toFixedNumber( item3.count * itemData.rate, 2 );
        var itemAnswerText3 =  StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemCost3, 2 ) );
        var itemUnitString3 = item3.count + ' ' + namePluralCap;
        var costOfItemQuestionString3 =  StringUtils.format( costOfQuestionString, item3.count, namePlural );
        var i3 = new QuestionAnswer( item3, itemCost3, itemAnswerText3, {
          questionString: costOfItemQuestionString3,
          unitString: itemUnitString3,
          onCorrectAnswerCallback: this.onCorrectAnswer
        }  );

        // Q: <type> for $?
        var item4 = this.getPromptItem( itemData, ShoppingConstants.MAX_ITEMS, [] );
        var itemCost4 =  Util.toFixedNumber( item4.count * itemData.rate, 2 );
        var itemAnswerText4 =  StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemCost4, 2 ) );
        var itemUnitString4 = item4.count + ' ' + namePluralCap;
        var itemForQuestionString4 =  StringUtils.format( forQuestionString, namePluralCap, Util.toFixed( itemCost4, 2 ) );
        var i4 = new QuestionAnswer( item4, item4.count, itemAnswerText4, {
          questionString: itemForQuestionString4,
          unitString: itemUnitString4,
          onCorrectAnswerCallback: this.onCorrectAnswer
        }  );

        this.challengeData[ itemData.type ] = [ i1, i2, i3, i4 ];
      }
    },

    /**
     * Retrives the name of an item from it's type
     * @param {Item.type} type - the item type (i.e. apples, carrots, red candy)
     * @param {boolean} plural
     * @param {boolean} capitalize
     * @returns {string}
     * @private
     *
     */
    getNameForItemType: function( type, plural, capitalize ) {

      var name = '';
      switch( type ) {
          case ItemData.APPLES.type:
            name = ( plural ? ( capitalize ? applesCapString : applesString ) :
                              ( capitalize ? appleCapString : appleString ) );
            break;
          case ItemData.LEMONS.type:
            name = ( plural ? ( capitalize ? lemonsCapString : lemonsString ) :
                              ( capitalize ? lemonCapString : lemonString ) );
            break;
          case ItemData.ORANGES.type:
            name = ( plural ? ( capitalize ? orangesCapString : orangesString ) :
                              ( capitalize ? orangeCapString : orangeString ) );
            break;
          case ItemData.PEARS.type:
            name = ( plural ? ( capitalize ? pearsCapString : pearsString ) :
                              ( capitalize ? pearCapString : pearString ) );
            break;
          case ItemData.CARROTS.type:
            name = ( plural ? ( capitalize ? carrotsCapString : carrotsString ) :
                              ( capitalize ? carrotCapString : carrotString ) );
            break;
          case ItemData.CUCUMBERS.type:
            name = ( plural ? ( capitalize ? cucumbersCapString : cucumbersString ) :
                              ( capitalize ? cucumberCapString : cucumberString ) );
            break;
          case ItemData.POTATOES.type:
            name = ( plural ? ( capitalize ? potatoesCapString : potatoesString ) :
                              ( capitalize ? potatoeCapString : potatoeString ) );
            break;
          case ItemData.TOMATOES.type:
            name = ( plural ? ( capitalize ? tomatoesCapString : tomatoesString ) :
                              ( capitalize ? tomatoCapString : tomatoString ) );
            break;
          case ItemData.RED_CANDY.type:
          case ItemData.PURPLE_CANDY.type:
          case ItemData.GREEN_CANDY.type:
          case ItemData.BLUE_CANDY.type:
          default:
            assert && assert( false, 'no name available for item type' );
        }

      return name;
    },

    /**
     * Gets the items assocaited with all the correctly answered challenge questions
     * @return {Array}.<Item>
     * @public
     *
     */
    getCorrectAnswerItems: function( itemData ) {

      var correctItems = [];

      var qnaArray = this.challengeData[ itemData.type ];
      qnaArray.forEach( function( qna ) {
        if ( qna.isAnswerValid() && qna.isAnswerCorrect() ) {
          correctItems.push( qna.item );
        }
      } );

      return correctItems;
    },

    /**
     * Generate an item with a random count in the range [1 - max] not in the 'taken' list
     * FIXME: when available, use design document Challenge prompt data based on itemData.type
     *
     * @return {Item}
     * @private
     *
     */
    getPromptItem: function( itemData, max, takenList ) {

      var count = 0;
      while( count === 0 || takenList.indexOf( count ) >= 0 ) {
        count = RAND.nextInt( max );
      }

      var item = new Item( itemData, count );

      return item;
    },

    /**
     * Resets the challenge data to the default state (all unanswered)
     * @public
     */
    reset: function() {

      for (var key in ItemData) {
        var itemData = ItemData[ key ];
        var qnaArray = this.challengeData[ itemData.type ];
        qnaArray.forEach( function( qna ) {
          qna.reset();
        } );
      }
    }

  } ); // inherit

} );  // define
