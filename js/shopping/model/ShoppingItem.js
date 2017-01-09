// Copyright 2016-2017, University of Colorado Boulder

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
  var DoubleNumberLine = require( 'UNIT_RATES/common/model/DoubleNumberLine' );
  var Marker = require( 'UNIT_RATES/common/model/Marker' );
  var ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  var ShoppingQuestion = require( 'UNIT_RATES/shopping/model/ShoppingQuestion' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

  // strings
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );
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

      numerationOptions: null, // {*} options specific to the rate's numerator, see below
      denominatorOptions: null, // {*} options specific to the rate's denominator, see below

      // questions
      questionSingularUnits: itemData.singularName, // {string} units for questions with singular quantities
      questionPluralUnits: itemData.pluralName,  // {string} units for questions with plural quantities
      uniformQuestions: true, // {boolean} are all questions of the same form? see createQuestionSets

      // {number} index of the question set that is initially selected, randomly chosen
      questionSetIndex: URQueryParameters.randomEnabled ?
                        phet.joist.random.nextIntBetween( 0, itemData.questionQuantities.length - 1 ) : 0
    }, options );

    var self = this;

    // @public (read-only) options specific to the rate's numerator
    var numeratorOptions = _.extend( {
      axisLabel: dollarsString, // {string} label for the axis on the double number line
      valueFormat: currencyValueString, // {string} format with '{0}' placeholder for value
      maxDigits: 4, // {number} number of digits that can be entered via the keypad
      maxDecimals: 2, // {number} maximum number of decimal places
      trimZeros: false // {boolean} whether to trim trailing zeros from decimal places
    }, options.numeratorOptions );

    // @public (read-only) options specific to the rate's denominator
    var denominatorOptions = _.extend( {
      axisLabel: itemData.pluralName, // {string} label for the axis on the double number line
      valueFormat: '{0}', // {string} format with '{0}' placeholder for value
      maxDigits: 4, // {number} number of digits that can be entered via the keypad
      maxDecimals: 2, // {number} maximum number of decimal places
      trimZeros: true, // {boolean} whether to trim trailing zeros from decimal places
      axisRange: new Range( 0, 10 ), // {Range} range of bottom axis
      majorMarkerDecimals: 0 // {number} number of decimal places for major markers
    }, options.denominatorOptions );

    // numerator and denominator must have the same number of decimal places,
    // or we will end up with rates that share a common numerator or denominator.
    assert && assert( numeratorOptions.maxDecimals === denominatorOptions.maxDecimals,
      'maxDecimals must be the same for numerator and denominator' );

    // @public (read-only) unpack itemData
    this.unitRate = itemData.unitRate;
    this.bagRate = itemData.bagRate;
    this.numberOfBags = itemData.numberOfBags;
    this.singularName = itemData.singularName;
    this.pluralName = itemData.pluralName;
    this.itemImage = itemData.itemImage;
    this.bagImage = itemData.bagImage;

    // @public {DoubleNumberLine} double number line associated with this item
    this.doubleNumberLine = new DoubleNumberLine( new Property( this.unitRate ), {
      numeratorOptions: numeratorOptions,
      denominatorOptions: denominatorOptions
    } );

    // @public {ShoppingQuestion} 'Unit Rate?'
    this.unitRateQuestion = ShoppingQuestion.createUnitRate( itemData.unitRate,
      options.questionSingularUnits, numeratorOptions, denominatorOptions );

    // @private {ShoppingQuestion[][]} instantiate ShoppingQuestions, grouped into sets
    this.questionSets = createQuestionSets( itemData.questionQuantities, itemData.unitRate,
      options.questionSingularUnits, options.questionPluralUnits, options.uniformQuestions,
      numeratorOptions, denominatorOptions );

    // @public (read-only) {Property.<ShoppingQuestion[]>} the current set of questions
    this.questionSetProperty = new Property( this.questionSets[ options.questionSetIndex ] );

    // @private {ShoppingQuestion[][]} sets of questions that are available for selection
    this.availableQuestionSets = this.questionSets.slice();
    this.availableQuestionSets.splice( options.questionSetIndex, 1 );

    // @private {ShoppingQuestion[][]} sets of question that have already been selected
    this.selectedQuestionSets = [ this.questionSetProperty.value ];

    /**
     * When the unit-rate question is answered correctly, create a corresponding marker.
     * @param {ShoppingQuestion} question
     */
    this.unitRateQuestion.correctEmitter.addListener( function( question ) {
      var marker = Marker.createQuestionMarker( question, URColors.unitRateMarker, denominatorOptions.majorMarkerDecimals );
      self.doubleNumberLine.markers.add( marker );
    } );

    /**
     * When a question is answered correctly, create a corresponding marker.
     * @param {ShoppingQuestion} question
     */
    var questionCorrectListener = function( question ) {
      var marker = Marker.createQuestionMarker( question, URColors.questionMarker, denominatorOptions.majorMarkerDecimals );
      self.doubleNumberLine.markers.add( marker );
    };
    this.questionSets.forEach( function( questionSet ) {
      questionSet.forEach( function( question ) {
        question.correctEmitter.addListener( questionCorrectListener );
      } );
    } );
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
   * @param {*} numeratorOptions - see ShoppingItem.numeratorOptions
   * @param {*} denominatorOptions - see ShoppingItem.denominatorOptions
   * @returns {ShoppingQuestion[][]}
   */
  function createQuestionSets( questionQuantities, unitRate, singularUnits, pluralUnits, uniformQuestions, numeratorOptions, denominatorOptions ) {

    var questionSets = [];  // {ShoppingQuestion[][]}

    questionQuantities.forEach( function( quantities ) {
      var questions = [];
      for ( var i = 0; i < quantities.length; i++ ) {
        var quantity = quantities[ i ];
        if ( i < quantities.length - 1 || uniformQuestions ) {

          // e.g. 'Cost of 3 Apples?'
          questions.push( ShoppingQuestion.createCostOf( quantity, unitRate, singularUnits, pluralUnits,
            numeratorOptions, denominatorOptions ) );
        }
        else {

          // optionally, the last question has a different form, e.g. 'Apples for $3.00?'
          questions.push( ShoppingQuestion.createItemsFor( quantity, unitRate, singularUnits, pluralUnits,
            numeratorOptions, denominatorOptions ) );
        }
      }
      questionSets.push( questions );
    } );

    return questionSets;
  }

  return inherit( Object, ShoppingItem, {

    // @public
    reset: function() {

      this.doubleNumberLine.reset();

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
