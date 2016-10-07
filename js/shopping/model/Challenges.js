// Copyright 2016, University of Colorado Boulder

/**
 * All the challenge questions for all items
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeData = require( 'UNIT_RATES/shopping/model/ChallengeData' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Item = require( 'UNIT_RATES/common/shopping/model/Item' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var QuestionAnswer = require( 'UNIT_RATES/common/model/QuestionAnswer' );
  var Random = require( 'DOT/Random' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Util = require( 'DOT/Util' );

  // strings - lots of 'em
  var unitRateQuestionString = require( 'string!UNIT_RATES/unitRateQuestion' );
  var costOfQuestionString = require( 'string!UNIT_RATES/costOfQuestion' );
  var forQuestionString = require( 'string!UNIT_RATES/forQuestion' );
  var poundString = require( 'string!UNIT_RATES/pound' );
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );
  var appleString = require( 'string!UNIT_RATES/apple' );
  var applesString = require( 'string!UNIT_RATES/apples' );
  var lemonString = require( 'string!UNIT_RATES/lemon' );
  var lemonsString = require( 'string!UNIT_RATES/lemons' );
  var orangeString = require( 'string!UNIT_RATES/orange' );
  var orangesString = require( 'string!UNIT_RATES/oranges' );
  var pearString = require( 'string!UNIT_RATES/pear' );
  var pearsString = require( 'string!UNIT_RATES/pears' );
  var carrotString = require( 'string!UNIT_RATES/carrot' );
  var carrotsString = require( 'string!UNIT_RATES/carrots' );
  var cucumberString = require( 'string!UNIT_RATES/cucumber' );
  var cucumbersString = require( 'string!UNIT_RATES/cucumbers' );
  var potatoString = require( 'string!UNIT_RATES/potato' );
  var potatoesString = require( 'string!UNIT_RATES/potatoes' );
  var tomatoString = require( 'string!UNIT_RATES/tomato' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );

  // constants
  var RAND = new Random();

  /**
   * @param {Property.<ItemData>} itemDataProperty - the currently selected item
   * @param {function} onCorrectAnswer - function to call when the correct answer is input
   * @param {function} onRefresh - function to call when challenges are refreshed (not reset)
   * @constructor
   */
  function Challenges( itemDataProperty, onCorrectAnswer, onRefresh ) {

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.challengeData = {};
    this.questionSet = -1;

    this.itemDataProperty = itemDataProperty;
    this.onCorrectAnswer = onCorrectAnswer;
    this.onRefresh = onRefresh;
    this.selectQuestionSet();
    this.populate();
  }

  unitRates.register( 'Challenges', Challenges );

  return inherit( Object, Challenges, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Retrieves the question for a specific index of the current item type
     *
     * @returns {QuestionAnswer}
     * @protected
     */
    selectQuestionSet: function() {

      var questionSet = -1;
      do {
        questionSet = RAND.nextInt( 4 );  // 4 sets of data available - see ChallengeData.js
      }
      while ( questionSet === this.questionSet );

      this.questionSet = questionSet;
    },

    /**
     * Retrieves the question for a specific index of the current item type
     *
     * @returns {QuestionAnswer}
     * @public
     */
    getQuestionAnswer: function( index ) {

      var itemType = this.itemDataProperty.value.type;
      var challengeData = this.challengeData[ itemType ];
      assert && assert( index < challengeData.length, 'invalid question index' );

      return challengeData[ index ];
    },

    /**
     * Populates the initial questions/values for all item types (i.e. apples, carrots, red candy)
     *
     * @public
     */
    populate: function() {

      // create questions & answers
      for ( var key in ItemData ) {

        var itemData = ItemData[ key ];

        // dispose of any old questions
        var qnaArray = this.challengeData[ itemData.type ];
        if ( qnaArray ) {
          qnaArray.forEach( function( qna ) {
            qna.dispose();
          } );
          this.challengeData[ itemData.type ] = [];
        }

        this.generateQuestionsAnswersForItem( itemData );
      }
    },

    /**
     * Re-populates the initial questions/values for the current item type (i.e. apples, carrots, red candy). This
     * also currently selects a random question set different than the one previously set.
     *
     * @public
     */
    refresh: function() {

      this.selectQuestionSet();

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
        var newQ1 = newQnAArray[ 0 ];
        newQ1.setCorrect( true );
      }

      if ( this.onRefresh ) {
        this.onRefresh.call();
      }
    },

    /**
     * Generates a set (currently 4) of challenge questions for a specific item type. Fruit & produce are the same type
     * of questions but candy is different.
     *
     * @param {ItemData} itemData - the type and rate used to generate questions
     * @private
     */
    generateQuestionsAnswersForItem: function( itemData ) {

      var itemType = itemData.type;
      var itemRate = itemData.rate;

      if ( itemType === ItemData.RED_CANDY.type || itemType === ItemData.PURPLE_CANDY.type ||
           itemType === ItemData.GREEN_CANDY.type || itemType === ItemData.BLUE_CANDY.type ) {

        // Q: Unit rate
        var candyItem1 = new Item( itemData, 1 );
        var candyAnswerText1 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemRate, 2 ) );
        var c1 = new QuestionAnswer( candyItem1, itemRate, candyAnswerText1, {
          questionString: unitRateQuestionString,
          unitString: poundString,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: Cost of # <type>?
        var candyItem2 = this.getPromptItem( itemType, this.questionSet, 0 );
        var candyCost2 = Util.toFixedNumber( candyItem2.countProperty.value * itemRate, 2 );
        var candyAnswerText2 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( candyCost2, 2 ) );
        var candyUnitString2 = candyItem2.countProperty.value + ' ' + poundsString;
        var costOfCandyQuestionString2 = StringUtils.format( costOfQuestionString, candyItem2.countProperty.value, poundsString );
        var c2 = new QuestionAnswer( candyItem2, candyCost2, candyAnswerText2, {
          questionString: costOfCandyQuestionString2,
          unitString: candyUnitString2,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: Cost of # <type>?
        var candyItem3 = this.getPromptItem( itemType, this.questionSet, 1 );
        var candyCost3 = Util.toFixedNumber( candyItem3.countProperty.value * itemRate, 2 );
        var candyAnswerText3 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( candyCost3, 2 ) );
        var candyUnitString3 = candyItem3.countProperty.value + ' ' + poundsString;
        var costOfCandyQuestionString3 = StringUtils.format( costOfQuestionString, candyItem3.countProperty.value, poundsString );
        var c3 = new QuestionAnswer( candyItem3, candyCost3, candyAnswerText3, {
          questionString: costOfCandyQuestionString3,
          unitString: candyUnitString3,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: Cost of # <type>?
        var candyItem4 = this.getPromptItem( itemType, this.questionSet, 2 );
        var candyCost4 = Util.toFixedNumber( candyItem4.countProperty.value * itemRate, 2 );
        var candyAnswerText4 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( candyCost4, 2 ) );
        var candyUnitString4 = candyItem4.countProperty.value + ' ' + poundsString;
        var costOfCandyQuestionString4 = StringUtils.format( costOfQuestionString, candyItem4.countProperty.value, poundsString );
        var c4 = new QuestionAnswer( candyItem4, candyCost4, candyAnswerText4, {
          questionString: costOfCandyQuestionString4,
          unitString: candyUnitString4,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        this.challengeData[ itemType ] = [ c1, c2, c3, c4 ];

      }
      else {

        //var name          = this.getNameForItemType(itemType, false, false );
        var nameCap = this.getNameForItemType( itemType, false, true );
        var namePlural = this.getNameForItemType( itemType, true, false );
        var namePluralCap = this.getNameForItemType( itemType, true, true );

        // Q: Unit rate
        var item1 = new Item( itemData, 1 );
        var itemAnswerText1 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemRate, 2 ) );
        var i1 = new QuestionAnswer( item1, itemRate, itemAnswerText1, {
          questionString: unitRateQuestionString,
          unitString: nameCap,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: Cost of # <type>?
        var item2 = this.getPromptItem( itemType, this.questionSet, 0 );
        var itemCost2 = Util.toFixedNumber( item2.countProperty.value * itemRate, 2 );
        var itemAnswerText2 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemCost2, 2 ) );
        var itemUnitString2 = item2.countProperty.value + ' ' + namePluralCap;
        var costOfItemQuestionString2 = StringUtils.format( costOfQuestionString, item2.countProperty.value, namePlural );
        var i2 = new QuestionAnswer( item2, itemCost2, itemAnswerText2, {
          questionString: costOfItemQuestionString2,
          unitString: itemUnitString2,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: Cost of # <type>?
        var item3 = this.getPromptItem( itemType, this.questionSet, 1 );
        var itemCost3 = Util.toFixedNumber( item3.countProperty.value * itemRate, 2 );
        var itemAnswerText3 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemCost3, 2 ) );
        var itemUnitString3 = item3.countProperty.value + ' ' + namePluralCap;
        var costOfItemQuestionString3 = StringUtils.format( costOfQuestionString, item3.countProperty.value, namePlural );
        var i3 = new QuestionAnswer( item3, itemCost3, itemAnswerText3, {
          questionString: costOfItemQuestionString3,
          unitString: itemUnitString3,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: <type> for $?
        var item4 = this.getPromptItem( itemType, this.questionSet, 2 );
        var itemCost4 = Util.toFixedNumber( item4.countProperty.value * itemRate, 2 );
        var itemAnswerText4 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemCost4, 2 ) );
        var itemUnitString4 = item4.countProperty.value + ' ' + namePluralCap;
        var itemForQuestionString4 = StringUtils.format( forQuestionString, namePluralCap, Util.toFixed( itemCost4, 2 ) );
        var i4 = new QuestionAnswer( item4, item4.countProperty.value, itemAnswerText4, {
          questionString: itemForQuestionString4,
          unitString: itemUnitString4,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        this.challengeData[ itemType ] = [ i1, i2, i3, i4 ];
      }
    },

    /**
     * Retrieves the correct version of name for an item from it's type
     *
     * @param {Item.type} type - the item type (i.e. apples, carrots, red candy)
     * @param {boolean} plural
     * @param {boolean} capitalize
     * @returns {string}
     * @private
     */
    getNameForItemType: function( type, plural, capitalize ) {

      var name = '';
      switch( type ) {
        case ItemData.APPLES.type:
          name = ( plural ? ( capitalize ? applesString : applesString ) :
                   ( capitalize ? appleString : appleString ) );
          break;
        case ItemData.LEMONS.type:
          name = ( plural ? ( capitalize ? lemonsString : lemonsString ) :
                   ( capitalize ? lemonString : lemonString ) );
          break;
        case ItemData.ORANGES.type:
          name = ( plural ? ( capitalize ? orangesString : orangesString ) :
                   ( capitalize ? orangeString : orangeString ) );
          break;
        case ItemData.PEARS.type:
          name = ( plural ? ( capitalize ? pearsString : pearsString ) :
                   ( capitalize ? pearString : pearString ) );
          break;
        case ItemData.CARROTS.type:
          name = ( plural ? ( capitalize ? carrotsString : carrotsString ) :
                   ( capitalize ? carrotString : carrotString ) );
          break;
        case ItemData.CUCUMBERS.type:
          name = ( plural ? ( capitalize ? cucumbersString : cucumbersString ) :
                   ( capitalize ? cucumberString : cucumberString ) );
          break;
        case ItemData.POTATOES.type:
          name = ( plural ? ( capitalize ? potatoesString : potatoesString ) :
                   ( capitalize ? potatoString : potatoString ) );
          break;
        case ItemData.TOMATOES.type:
          name = ( plural ? ( capitalize ? tomatoesString : tomatoesString ) :
                   ( capitalize ? tomatoString : tomatoString ) );
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
     * Gets the items associated with all the correctly answered challenge questions
     *
     * @return {Array.<QuestionAnswer>}
     * @public
     */
    getCorrectAnswerItems: function( itemType ) {

      var correctItems = [];

      var qnaArray = this.challengeData[ itemType ];
      qnaArray.forEach( function( qna ) {
        if ( qna.isAnswerValid() && qna.isAnswerCorrect() ) {
          correctItems.push( qna.item );
        }
      } );

      return correctItems;
    },

    /**
     * Generate an item with a count set from the ChallengeData
     *
     * @param {string} itemType
     * @param {number} setNumber - set (0|1|2|3)
     * @param {number} promptNumber - prompt (0|1|2)
     * @return {Item}
     * @private
     */
    getPromptItem: function( itemType, setNumber, promptNumber ) {

      var count = 0;

      assert && assert( (setNumber < 4), 'Invalid challenge set number' );
      assert && assert( (promptNumber < 3), 'Invalid challenge prompt number' );

      switch( itemType ) {
        case ItemData.APPLES.type:
          count = ChallengeData.APPLES[ setNumber ][ promptNumber ];
          break;
        case ItemData.LEMONS.type:
          count = ChallengeData.LEMONS[ setNumber ][ promptNumber ];
          break;
        case ItemData.ORANGES.type:
          count = ChallengeData.ORANGES[ setNumber ][ promptNumber ];
          break;
        case ItemData.PEARS.type:
          count = ChallengeData.PEARS[ setNumber ][ promptNumber ];
          break;
        case ItemData.CARROTS.type:
          count = ChallengeData.CARROTS[ setNumber ][ promptNumber ];
          break;
        case ItemData.CUCUMBERS.type:
          count = ChallengeData.CUCUMBERS[ setNumber ][ promptNumber ];
          break;
        case ItemData.POTATOES.type:
          count = ChallengeData.POTATOES[ setNumber ][ promptNumber ];
          break;
        case ItemData.TOMATOES.type:
          count = ChallengeData.TOMATOES[ setNumber ][ promptNumber ];
          break;
        case ItemData.RED_CANDY.type:
          count = ChallengeData.RED_CANDY[ setNumber ][ promptNumber ];
          break;
        case ItemData.PURPLE_CANDY.type:
          count = ChallengeData.PURPLE_CANDY[ setNumber ][ promptNumber ];
          break;
        case ItemData.GREEN_CANDY.type:
          count = ChallengeData.GREEN_CANDY[ setNumber ][ promptNumber ];
          break;
        case ItemData.BLUE_CANDY.type:
          count = ChallengeData.BLUE_CANDY[ setNumber ][ promptNumber ];
          break;
        default:
          assert && assert( false, 'prompt data not available for item type' );
      }

      return new Item( itemType, count );
    },

    // @public
    reset: function() {

      for ( var key in ItemData ) {
        var itemData = ItemData[ key ];
        var qnaArray = this.challengeData[ itemData.type ];
        qnaArray.forEach( function( qna ) {
          qna.reset();
        } );
      }
    }

  } ); // inherit

} );  // define
