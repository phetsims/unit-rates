// Copyright 2017, University of Colorado Boulder

/**
 * Functions for creating ShoppingQuestions and question sets.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ShoppingQuestion = require( 'UNIT_RATES/shopping/model/ShoppingQuestion' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );
  var Util = require( 'DOT/Util' );

  // strings
  var pattern0CostString = require( 'string!UNIT_RATES/pattern_0cost' );
  var patternCostOf0Quantity1UnitsString = require( 'string!UNIT_RATES/pattern_costOf_0quantity_1units' );
  var pattern0Items1CostString = require( 'string!UNIT_RATES/pattern_0items_1cost' );
  var pattern0Value1UnitsString = require( 'string!UNIT_RATES/pattern_0value_1units' );
  var unitRateQuestionString = require( 'string!UNIT_RATES/unitRateQuestion' );

  var ShoppingQuestionFactory = {

    /**
     * Creates a question of the form 'Unit Rate?'
     *
     * @param {number} unitRate
     * @param {string} units - units for the denominator
     * @param {Object} numeratorOptions - see ShoppingItem options.numeratorOptions
     * @param {Object} denominatorOptions - see ShoppingItem options.denominatorOptions
     * @returns {ShoppingQuestion}
     * @public
     * @static
     */
    createUnitRateQuestion: function( unitRate, units, numeratorOptions, denominatorOptions ) {

      // '$0.50'
      var numerator = unitRate;
      var numeratorString = StringUtils.format( pattern0CostString,
        URUtil.numberToString( numerator, numeratorOptions.maxDecimals, numeratorOptions.trimZeros ) );

      // '1 Apple'
      var denominator = 1;
      var denominatorString = StringUtils.format( pattern0Value1UnitsString,
        URUtil.numberToString( denominator, denominatorOptions.maxDecimals, denominatorOptions.trimZeros ),
        units );

      return new ShoppingQuestion( unitRateQuestionString, unitRate, numerator, denominator, numeratorString, denominatorString, numeratorOptions );
    },

    /**
     * Creates question sets from raw data.
     *
     * @param {number[][]} questionQuantities - number of items for each question, see ShoppingItemData
     * @param {number} unitRate
     * @param {string} singularUnits - denominator units to use for questions with singular quantities
     * @param {string} pluralUnits - denominator units to use for questions with plural quantities
     * @param {string} amountOfQuestionUnits - units used for "Apples for $10.00?" type questions
     * @param {Object} numeratorOptions - see ShoppingItem.numeratorOptions
     * @param {Object} denominatorOptions - see ShoppingItem.denominatorOptions
     * @returns {ShoppingQuestion[][]}
     * @public
     * @static
     */
    createQuestionSets: function( questionQuantities, unitRate, singularUnits, pluralUnits, amountOfQuestionUnits, numeratorOptions, denominatorOptions ) {

      var questionSets = [];  // {ShoppingQuestion[][]}

      questionQuantities.forEach( function( quantities ) {

        var questions = [];

        // the first N-1 questions are of the form 'Cost of 3 Apples?'
        for ( var i = 0; i < quantities.length - 1; i++ ) {
          questions.push( createCostOfQuestion( quantities[ i ],
            unitRate, singularUnits, pluralUnits,
            numeratorOptions, denominatorOptions ) );
        }

        // the last question is of the form 'Apples for $3.00?'
        questions.push( createItemsForQuestion( quantities[ quantities.length - 1 ],
          unitRate, singularUnits, pluralUnits, amountOfQuestionUnits,
          numeratorOptions, denominatorOptions ) );

        questionSets.push( questions );
      } );

      return questionSets;
    }
  };

  unitRates.register( 'ShoppingQuestionFactory', ShoppingQuestionFactory );

  /**
   * Creates a question of the form 'Cost of 10 Apples?' or 'Cost of 2.2 pounds?'
   * @param {number} denominator
   * @param {number} unitRate
   * @param {string} singularUnits - denominator units to use for questions with singular quantities
   * @param {string} pluralUnits - denominator units to use for questions with plural quantities
   * @param {Object} numeratorOptions - see ShoppingItem options.numeratorOptions
   * @param {Object} denominatorOptions - see ShoppingItem options.denominatorOptions
   * @returns {ShoppingQuestion}
   */
  var createCostOfQuestion = function( denominator, unitRate, singularUnits, pluralUnits, numeratorOptions, denominatorOptions ) {

    // answer
    var numerator = denominator * unitRate;
    var answer = Util.toFixedNumber( numerator, numeratorOptions.maxDecimals );

    // 'Apples' or 'Apple'
    var units = ( denominator > 1 ) ? pluralUnits : singularUnits;

    // '$3.00'
    var numeratorString = StringUtils.format( pattern0CostString,
      URUtil.numberToString( numerator, numeratorOptions.maxDecimals, numeratorOptions.trimZeros ) );

    // '10 Apples'
    var denominatorString = StringUtils.format( pattern0Value1UnitsString,
      URUtil.numberToString( denominator, denominatorOptions.maxDecimals, denominatorOptions.trimZeros ),
      units );

    // 'Cost of 10 Apples?'
    var questionString = StringUtils.format( patternCostOf0Quantity1UnitsString,
      URUtil.numberToString( denominator, denominatorOptions.maxDecimals, denominatorOptions.trimZeros ),
      units );

    return new ShoppingQuestion( questionString, answer, numerator, denominator, numeratorString, denominatorString, numeratorOptions );
  };

  /**
   * Creates a question of the form 'Apples for $3.00?'
   * @param {number} denominator
   * @param {number} unitRate
   * @param {string} singularUnits
   * @param {string} pluralUnits
   * @param {string} amountOfQuestionUnits - units used for "Apples for $10.00?" type questions
   * @param {Object} numeratorOptions - see ShoppingItem options.numeratorOptions
   * @param {Object} denominatorOptions - see ShoppingItem options.denominatorOptions
   * @returns {ShoppingQuestion}
   */
  var createItemsForQuestion = function( denominator, unitRate, singularUnits, pluralUnits, amountOfQuestionUnits, numeratorOptions, denominatorOptions ) {

    // answer
    var answer = Util.toFixedNumber( denominator, denominatorOptions.maxDecimals );

    // 'Apples' or 'Apple'
    var units = ( denominator > 1 ) ? pluralUnits : singularUnits;

    // '$4.00'
    var numerator = denominator * unitRate;
    var numeratorString = StringUtils.format( pattern0CostString,
      URUtil.numberToString( numerator, numeratorOptions.maxDecimals, numeratorOptions.trimZeros ) );

    // '8 Apples'
    var denominatorString = StringUtils.format( pattern0Value1UnitsString,
      URUtil.numberToString( denominator, denominatorOptions.maxDecimals, denominatorOptions.trimZeros ),
      units );

    // 'Apples for $4.00?'
    var questionString = StringUtils.format( pattern0Items1CostString,
      amountOfQuestionUnits,
      URUtil.numberToString( numerator, numeratorOptions.maxDecimals, numeratorOptions.trimZeros ) );

    return new ShoppingQuestion( questionString, answer, numerator, denominator, numeratorString, denominatorString, denominatorOptions );
  };

  return ShoppingQuestionFactory;
} );
