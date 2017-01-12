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
      uniformQuestions: true // {boolean} are all questions of the same form? see createQuestionSets
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

    // Randomize the order of the question sets
    if ( URQueryParameters.randomEnabled ) {
      this.questionSets = phet.joist.random.shuffle( this.questionSets );
    }

    // @private index of the question set that's being shown
    this.questionSetsIndexProperty = new Property( 0 );

    // @public (read-only) {Property.<ShoppingQuestion[]>} the current set of questions
    this.questionSetProperty = new Property( this.questionSets[ this.questionSetsIndexProperty.value ] );

    this.questionSetsIndexProperty.lazyLink( function( questionSetsIndex ) { // no unlink required
      self.questionSetProperty.value = self.questionSets[ questionSetsIndex ];
    } );

    /**
     * When a question is answered correctly, create a corresponding marker.
     * @param {ShoppingQuestion} question
     */
    var questionCorrectListener = function( question ) {
      var marker = Marker.createQuestionMarker( question, URColors.questionMarker, denominatorOptions.majorMarkerDecimals );
      self.doubleNumberLine.addMarker( marker );
    };
    this.unitRateQuestion.correctEmitter.addListener( questionCorrectListener ); // no removeListener required
    this.questionSets.forEach( function( questionSet ) {
      questionSet.forEach( function( question ) {
        question.correctEmitter.addListener( questionCorrectListener ); // no removeListener required
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

      // rest current question set
      this.questionSetsIndexProperty.reset();
    },

    /**
     * Gets the next set of questions.
     * While the order of the sets is random, we cycle through the sets in the same order each time.
     * @public
     */
    nextQuestionSet: function() {

      assert && assert( this.questionSets.length > 1, 'this implementation requires more than 1 question set' );

      // adjust the index to point to the next question set
      if ( this.questionSetsIndexProperty.value < this.questionSets.length - 1 ) {
        this.questionSetsIndexProperty.value = this.questionSetsIndexProperty.value + 1;
      }
      else {
        this.questionSetsIndexProperty.value = 0;
      }
    }
  } );
} );
