// Copyright 2016, University of Colorado Boulder

/**
 * An item in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Question = require( 'UNIT_RATES/shoppingNEW/model/Question' );
  var Property = require( 'AXON/Property' );
  var ShoppingItemData = require( 'UNIT_RATES/shoppingNEW/model/ShoppingItemData' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

  /**
   * @param {Object} itemData - data structure that describes a type of item, see for example Fruit.APPLES
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItem( itemData, options ) {

    // verify that itemData is a complete specification
    assert && ShoppingItemData.assertIsItemData( itemData );

    options = _.extend( {
      questionSingularUnits: itemData.singularName, // {string} units to use for questions with singular quantities
      questionPluralUnits: itemData.pluralName,  // {string} units to use for questions with plural quantities
      uniformQuestions: true, // {boolean} are all Questions of the same form? see createQuestionSets

      // {number} index of the question set that is initially selected, randomly chosen
      questionSetIndex: URQueryParameters.randomEnabled ?
                        phet.joist.random.nextIntBetween( 0, itemData.questionQuantities.length - 1 ) : 0
    }, options );

    // @public (read-only)
    this.unitRate = itemData.unitRate;
    this.bagRate = itemData.bagRate;
    this.numberOfBags = itemData.numberOfBags;
    this.singularName = itemData.singularName;
    this.pluralName = itemData.pluralName;
    this.numeratorName = itemData.numeratorName;
    this.denominatorName = itemData.denominatorName;
    this.itemImage = itemData.itemImage;
    this.bagImage = itemData.bagImage;

    // @public {Question} 'Unit Rate?'
    this.unitRateQuestion = Question.createUnitRate( itemData.unitRate, options.questionSingularUnits );

    // @private {Question[][]} instantiate Questions, grouped into sets
    this.questionSets = createQuestionSets( itemData.questionQuantities, itemData.unitRate,
      options.questionSingularUnits, options.questionPluralUnits, options.uniformQuestions );

    // @public {Property.<Question[]>} the current set of questions
    this.questionSetProperty = new Property( this.questionSets[ options.questionSetIndex ] );

    // @private {Question[][]} sets of questions that are available for selection
    this.availableQuestionSets = this.questionSets.slice();
    this.availableQuestionSets.splice( options.questionSetIndex, 1 );

    // @private {Question[][]} sets of question that have already been selected
    this.selectedQuestionSets = [ this.questionSetProperty.value ];
  }

  unitRates.register( 'ShoppingItem', ShoppingItem );

  /**
   * Verifies that an object has all of the properties required to be considered 'item data'.
   * This verification occurs only when assertions are enabled. The first missing property
   * results in an assertion failure. For an example of itemData, see Fruit.APPLES.
   * @param {*} itemData
   */
  function assertItemData( itemData ) {

    // itemData requires these properties
    var propertyNames = [
      'unitRate', 'bagRate', 'numberOfBags',
      'singularName', 'pluralName',
      'numeratorName', 'denominatorName',
      'itemImage', 'bagImage',
      'questionQuantities'
    ];

    propertyNames.forEach( function( propertyName ) {
      assert && assert( _.has( itemData, propertyName ), 'missing property: ' + propertyName );
    } );
  }

  /**
   * Creates question sets from raw data.
   *
   * @param {number[][]} questionQuantities - number of items for each question, see for example Fruit.APPLES
   * @param {number} unitRate
   * @param {string} singularUnits - units to use for questions with singular quantities
   * @param {string} pluralUnits - units to use for questions with plural quantities
   * @param {boolean} uniformQuestions -
   *        true: all questions are of the same form, e.g. 'Cost of 3 Apples?'
   *        false: the last question will have a different form, e.g. 'Apples for $3.00?'
   * @returns {Question[][]}
   */
  function createQuestionSets( questionQuantities, unitRate, singularUnits, pluralUnits, uniformQuestions ) {

    var questionSets = [];  // {Question[][]}

    questionQuantities.forEach( function( quantities ) {
      var questions = [];
      for ( var i = 0; i < quantities.length; i++ ) {
        var quantity = quantities[ i ];
        if ( i < quantities.length - 1 || uniformQuestions ) {

          // e.g. 'Cost of 3 Apples?'
          questions.push( Question.createCostOf( quantity, unitRate, singularUnits, pluralUnits ) );
        }
        else {

          // optionally, the last question has a different form, e.g. 'Apples for $3.00?'
          questions.push( Question.createItemsFor( quantity, unitRate, singularUnits, pluralUnits ) );
        }
      }
      questionSets.push( questions );
    } );

    return questionSets;
  }

  return inherit( Object, ShoppingItem, {

    // @public
    reset: function() {

      // reset all Questions
      this.unitRateQuestion.reset();
      this.questionSets.forEach( function( questionSet ) {
        questionSet.forEach( function( question ) {
          question.reset();
        } );
      } );

      // choose the next set of questions
      this.nextQuestionSet();
    },

    /**
     * Randomly chooses the next set of questions. The same set will not be selected consecutively,
     * and a selected set will not be re-selected until all sets have been selected.
     * @public
     */
    nextQuestionSet: function() {

      // replenish the available sets of questions, excluding the current set of questions
      if ( this.availableQuestionSets.length === 0 ) {
        var currentQuestionSet = this.questionSetProperty.value;
        this.availableQuestionSets = this.selectedQuestionSets;
        this.availableQuestionSets.splice( this.availableQuestionSets.indexOf( currentQuestionSet ), 1 );
        this.selectedQuestionSets = [ currentQuestionSet ];
      }

      // randomly select a set of questions
      var nextIndex = URQueryParameters.randomEnabled ? phet.joist.random.nextIntBetween( 0, this.availableQuestionSets.length - 1 ) : 0;
      var nextQuestionSet = this.availableQuestionSets[ nextIndex ];
      assert && assert( nextQuestionSet, 'nextQuestionSet is null, nextIndex=' + nextIndex );
      assert && assert( nextQuestionSet !== this.questionSetProperty.value, 'repeated questions' );

      // move the set of questions from available to selected
      this.availableQuestionSets.splice( this.availableQuestionSets.indexOf( nextQuestionSet ), 1 );
      this.selectedQuestionSets.push( nextQuestionSet );

      this.questionSetProperty.value = nextQuestionSet;
    }
  } );
} );
