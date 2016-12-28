// Copyright 2016, University of Colorado Boulder

/**
 * An item in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );

  // sim modules
  var ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  var ShoppingQuestion = require( 'UNIT_RATES/shopping/model/ShoppingQuestion' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

  // strings
  var dollarsString = require( 'string!UNIT_RATES/dollars' );

  /**
   * @param {Object} itemData - data structure that describes a type of item, see for example Fruit.APPLES.
   *   Using a data structure like this is an alternative to having a large number of constructor parameters.
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItem( itemData, options ) {

    // verify that itemData has all required properties
    assert && ShoppingItemData.assertIsItemData( itemData );
    assert && assert( itemData.questionQuantities.length > 1, 'more than 1 set of questions is required' );

    options = _.extend( {

      topAxisLabel: dollarsString, // {string} label for the top axis of the double number line
      bottomAxisLabel: itemData.pluralName, // {string} label for the bottom axis of the double number line
      bottomAxisRange: new Range( 0, 10 ), // {Range} range of bottom axis
      bottomAxisMaxDecimals: 1, // {number} maximum number of decimal places for the bottom axis

      questionSingularUnits: itemData.singularName, // {string} units for questions with singular quantities
      questionPluralUnits: itemData.pluralName,  // {string} units for questions with plural quantities
      uniformQuestions: true, // {boolean} are all questions of the same form? see createQuestionSets

      // {number} index of the question set that is initially selected, randomly chosen
      questionSetIndex: URQueryParameters.randomEnabled ?
                        phet.joist.random.nextIntBetween( 0, itemData.questionQuantities.length - 1 ) : 0
    }, options );

    // @public (read-only) unpack itemData
    this.unitRate = itemData.unitRate;
    this.bagRate = itemData.bagRate;
    this.numberOfBags = itemData.numberOfBags;
    this.singularName = itemData.singularName;
    this.pluralName = itemData.pluralName;
    this.itemImage = itemData.itemImage;
    this.bagImage = itemData.bagImage;

    // @public (read-only) unpack options
    this.topAxisLabel = options.topAxisLabel;
    this.bottomAxisLabel = options.bottomAxisLabel;
    this.bottomAxisRange = options.bottomAxisRange;
    this.bottomAxisMaxDecimals = options.bottomAxisMaxDecimals;

    // @public {ShoppingQuestion} 'Unit Rate?'
    this.unitRateQuestion = ShoppingQuestion.createUnitRate( itemData.unitRate, options.questionSingularUnits );

    // @private {ShoppingQuestion[][]} instantiate ShoppingQuestions, grouped into sets
    this.questionSets = createQuestionSets( itemData.questionQuantities, itemData.unitRate,
      options.questionSingularUnits, options.questionPluralUnits, options.uniformQuestions );

    // @public (read-only) {Property.<ShoppingQuestion[]>} the current set of questions
    this.questionSetProperty = new Property( this.questionSets[ options.questionSetIndex ] );

    // @private {ShoppingQuestion[][]} sets of questions that are available for selection
    this.availableQuestionSets = this.questionSets.slice();
    this.availableQuestionSets.splice( options.questionSetIndex, 1 );

    // @private {ShoppingQuestion[][]} sets of question that have already been selected
    this.selectedQuestionSets = [ this.questionSetProperty.value ];
  }

  unitRates.register( 'ShoppingItem', ShoppingItem );

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
   * @returns {ShoppingQuestion[][]}
   */
  function createQuestionSets( questionQuantities, unitRate, singularUnits, pluralUnits, uniformQuestions ) {

    var questionSets = [];  // {ShoppingQuestion[][]}

    questionQuantities.forEach( function( quantities ) {
      var questions = [];
      for ( var i = 0; i < quantities.length; i++ ) {
        var quantity = quantities[ i ];
        if ( i < quantities.length - 1 || uniformQuestions ) {

          // e.g. 'Cost of 3 Apples?'
          questions.push( ShoppingQuestion.createCostOf( quantity, unitRate, singularUnits, pluralUnits ) );
        }
        else {

          // optionally, the last question has a different form, e.g. 'Apples for $3.00?'
          questions.push( ShoppingQuestion.createItemsFor( quantity, unitRate, singularUnits, pluralUnits ) );
        }
      }
      questionSets.push( questions );
    } );

    return questionSets;
  }

  return inherit( Object, ShoppingItem, {

    // @public
    reset: function() {

      // reset all ShoppingQuestions
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
