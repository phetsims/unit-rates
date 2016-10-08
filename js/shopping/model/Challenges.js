// Copyright 2016, University of Colorado Boulder

/**
 * All the challenge questions for all items
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Item = require( 'UNIT_RATES/common/shopping/model/Item' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var QuestionAnswer = require( 'UNIT_RATES/common/model/QuestionAnswer' );
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
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

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
        //TODO magic number
        questionSet = phet.joist.random.nextInt( 4 );  // 4 sets of data available - see ItemType.challengeData
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
        var candyAnswerText1 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemRate, 2 ) );//TODO i18n
        var c1 = new QuestionAnswer( candyItem1, itemRate, candyAnswerText1, {
          questionString: unitRateQuestionString,
          unitString: StringUtils.format( valueUnitsString, 1, poundString ),
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: Cost of # <type>?
        var candyItem2 = this.getPromptItem( itemData, this.questionSet, 0 );
        var candyCost2 = Util.toFixedNumber( candyItem2.countProperty.value * itemRate, 2 );
        var candyAnswerText2 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( candyCost2, 2 ) ); //TODO i18n
        var candyUnitString2 = candyItem2.countProperty.value + ' ' + poundsString; //TODO i18n
        var costOfCandyQuestionString2 = StringUtils.format( costOfQuestionString, candyItem2.countProperty.value, poundsString );
        var c2 = new QuestionAnswer( candyItem2, candyCost2, candyAnswerText2, {
          questionString: costOfCandyQuestionString2,
          unitString: candyUnitString2,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: Cost of # <type>?
        var candyItem3 = this.getPromptItem( itemData, this.questionSet, 1 );
        var candyCost3 = Util.toFixedNumber( candyItem3.countProperty.value * itemRate, 2 );
        var candyAnswerText3 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( candyCost3, 2 ) ); //TODO i18n
        var candyUnitString3 = candyItem3.countProperty.value + ' ' + poundsString; //TODO i18n
        var costOfCandyQuestionString3 = StringUtils.format( costOfQuestionString, candyItem3.countProperty.value, poundsString );
        var c3 = new QuestionAnswer( candyItem3, candyCost3, candyAnswerText3, {
          questionString: costOfCandyQuestionString3,
          unitString: candyUnitString3,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: Cost of # <type>?
        var candyItem4 = this.getPromptItem( itemData, this.questionSet, 2 );
        var candyCost4 = Util.toFixedNumber( candyItem4.countProperty.value * itemRate, 2 );
        var candyAnswerText4 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( candyCost4, 2 ) ); //TODO i18n
        var candyUnitString4 = candyItem4.countProperty.value + ' ' + poundsString; //TODO i18n
        var costOfCandyQuestionString4 = StringUtils.format( costOfQuestionString, candyItem4.countProperty.value, poundsString );
        var c4 = new QuestionAnswer( candyItem4, candyCost4, candyAnswerText4, {
          questionString: costOfCandyQuestionString4,
          unitString: candyUnitString4,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        this.challengeData[ itemType ] = [ c1, c2, c3, c4 ];

      }
      else {

        var pluralName = itemData.pluralName;

        // Q: Unit rate
        var item1 = new Item( itemData, 1 );
        var itemAnswerText1 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemRate, 2 ) );
        var i1 = new QuestionAnswer( item1, itemRate, itemAnswerText1, {
          questionString: unitRateQuestionString,
          unitString: StringUtils.format( valueUnitsString, 1, itemData.singularName ),
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: Cost of # <type>?
        var item2 = this.getPromptItem( itemData, this.questionSet, 0 );
        var itemCost2 = Util.toFixedNumber( item2.countProperty.value * itemRate, 2 );
        var itemAnswerText2 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemCost2, 2 ) ); //TODO i18n
        var itemUnitString2 = item2.countProperty.value + ' ' + pluralName; //TODO i18n
        var costOfItemQuestionString2 = StringUtils.format( costOfQuestionString, item2.countProperty.value, pluralName );
        var i2 = new QuestionAnswer( item2, itemCost2, itemAnswerText2, {
          questionString: costOfItemQuestionString2,
          unitString: itemUnitString2,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: Cost of # <type>?
        var item3 = this.getPromptItem( itemData, this.questionSet, 1 );
        var itemCost3 = Util.toFixedNumber( item3.countProperty.value * itemRate, 2 );
        var itemAnswerText3 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemCost3, 2 ) ); //TODO i18n
        var itemUnitString3 = item3.countProperty.value + ' ' + pluralName; //TODO i18n
        var costOfItemQuestionString3 = StringUtils.format( costOfQuestionString, item3.countProperty.value, pluralName );
        var i3 = new QuestionAnswer( item3, itemCost3, itemAnswerText3, {
          questionString: costOfItemQuestionString3,
          unitString: itemUnitString3,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        // Q: <type> for $?
        var item4 = this.getPromptItem( itemData, this.questionSet, 2 );
        var itemCost4 = Util.toFixedNumber( item4.countProperty.value * itemRate, 2 );
        var itemAnswerText4 = StringUtils.format( '{0}{1}', currencySymbolString, Util.toFixed( itemCost4, 2 ) ); //TODO i18n
        var itemUnitString4 = item4.countProperty.value + ' ' + pluralName; //TODO i18n
        var itemForQuestionString4 = StringUtils.format( forQuestionString, pluralName, Util.toFixed( itemCost4, 2 ) );
        var i4 = new QuestionAnswer( item4, item4.countProperty.value, itemAnswerText4, {
          questionString: itemForQuestionString4,
          unitString: itemUnitString4,
          onCorrectAnswerCallback: this.onCorrectAnswer
        } );

        this.challengeData[ itemType ] = [ i1, i2, i3, i4 ];
      }
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
     * Generate an item with a count set from the challenge data.
     *
     * @param {ItemData} itemData
     * @param {number} setNumber - set (0|1|2|3)
     * @param {number} promptNumber - prompt (0|1|2)
     * @return {Item}
     * @private
     */
    getPromptItem: function( itemData, setNumber, promptNumber ) {

      assert && assert( setNumber < 4, 'invalid setNumber: ' + setNumber );
      assert && assert( (promptNumber < 3), 'invalid promptNumber: ' + promptNumber );

      var count = itemData.challengeData[ setNumber ][ promptNumber ];

      return new Item( itemData.type, count );
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
