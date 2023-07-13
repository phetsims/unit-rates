// Copyright 2017-2023, University of Colorado Boulder

/**
 * Functions for creating ShoppingQuestions and question sets.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import URUtils from '../../common/URUtils.js';
import unitRates from '../../unitRates.js';
import UnitRatesStrings from '../../UnitRatesStrings.js';
import ShoppingQuestion from './ShoppingQuestion.js';
import Axis from '../../common/model/Axis.js';

const ShoppingQuestionFactory = {

  /**
   * Creates a question of the form 'Unit Rate?'
   */
  createUnitRateQuestion( unitRate: number, denominatorUnits: string, numeratorAxis: Axis, denominatorAxis: Axis ): ShoppingQuestion {

    // '$0.50'
    const numerator = unitRate;
    const numeratorString = StringUtils.format( UnitRatesStrings.pattern_0cost,
      URUtils.numberToString( numerator, numeratorAxis.maxDecimals, numeratorAxis.trimZeros ) );

    // '1 Apple'
    const denominator = 1;
    const denominatorString = StringUtils.format( UnitRatesStrings.pattern_0value_1units,
      URUtils.numberToString( denominator, denominatorAxis.maxDecimals, denominatorAxis.trimZeros ),
      denominatorUnits );

    return new ShoppingQuestion( UnitRatesStrings.unitRateQuestion, unitRate, numerator, denominator, numeratorString, denominatorString, numeratorAxis );
  },

  /**
   * Creates question sets from raw data.
   *
   * @param questionQuantities - number of items for each question, see ShoppingItemData
   * @param unitRate
   * @param denominatorSingularUnits - denominator units to use for questions with singular quantities
   * @param denominatorPluralUnits - denominator units to use for questions with plural quantities
   * @param questionUnits - units used for "Apples for $10.00?" type questions
   * @param numeratorAxis
   * @param denominatorAxis
   */
  createQuestionSets( questionQuantities: number[][],
                      unitRate: number,
                      denominatorSingularUnits: string,
                      denominatorPluralUnits: string,
                      questionUnits: string,
                      numeratorAxis: Axis,
                      denominatorAxis: Axis ): ShoppingQuestion[][] {

    const questionSets: ShoppingQuestion[][] = [];

    questionQuantities.forEach( quantities => {

      const questions = [];

      // the first N-1 questions are of the form 'Cost of 3 Apples?'
      for ( let i = 0; i < quantities.length - 1; i++ ) {
        questions.push( createCostOfQuestion( quantities[ i ], unitRate, denominatorSingularUnits, denominatorPluralUnits, numeratorAxis, denominatorAxis ) );
      }

      // the last question is of the form 'Apples for $3.00?'
      questions.push( createItemsForQuestion( quantities[ quantities.length - 1 ],
        unitRate, denominatorSingularUnits, denominatorPluralUnits, questionUnits, numeratorAxis, denominatorAxis ) );

      questionSets.push( questions );
    } );

    return questionSets;
  }
};

/**
 * Creates a question of the form 'Cost of 10 Apples?' or 'Cost of 2.2 pounds?'
 * @param denominator
 * @param unitRate
 * @param denominatorSingularUnits
 * @param denominatorPluralUnits
 * @param numeratorAxis
 * @param denominatorAxis
 */
function createCostOfQuestion( denominator: number,
                               unitRate: number,
                               denominatorSingularUnits: string,
                               denominatorPluralUnits: string,
                               numeratorAxis: Axis,
                               denominatorAxis: Axis ): ShoppingQuestion {

  // 'Apples' or 'Apple'
  const units = ( denominator > 1 ) ? denominatorPluralUnits : denominatorSingularUnits;

  // 'Cost of 10 Apples?'
  const questionString = StringUtils.format( UnitRatesStrings.pattern_costOf_0quantity_1units,
    URUtils.numberToString( denominator, denominatorAxis.maxDecimals, denominatorAxis.trimZeros ),
    units );

  // answer
  const numerator = denominator * unitRate;
  const answer = Utils.toFixedNumber( numerator, numeratorAxis.maxDecimals );

  // '$3.00'
  const numeratorString = StringUtils.format( UnitRatesStrings.pattern_0cost,
    URUtils.numberToString( numerator, numeratorAxis.maxDecimals, numeratorAxis.trimZeros ) );

  // '10 Apples'
  const denominatorString = StringUtils.format( UnitRatesStrings.pattern_0value_1units,
    URUtils.numberToString( denominator, denominatorAxis.maxDecimals, denominatorAxis.trimZeros ),
    units );

  return new ShoppingQuestion( questionString, answer, numerator, denominator, numeratorString, denominatorString, numeratorAxis );
}

/**
 * Creates a question of the form 'Apples for $3.00?'
 * @param denominator
 * @param unitRate
 * @param denominatorSingularUnits
 * @param denominatorPluralUnits
 * @param questionUnits
 * @param numeratorAxis
 * @param denominatorAxis
 */
function createItemsForQuestion( denominator: number,
                                 unitRate: number,
                                 denominatorSingularUnits: string,
                                 denominatorPluralUnits: string,
                                 questionUnits: string,
                                 numeratorAxis: Axis,
                                 denominatorAxis: Axis ): ShoppingQuestion {

  const numerator = denominator * unitRate;

  // 'Apples for $4.00?'
  const questionString = StringUtils.format( UnitRatesStrings.pattern_0items_1cost, questionUnits,
    URUtils.numberToString( numerator, numeratorAxis.maxDecimals, numeratorAxis.trimZeros ) );

  // answer
  const answer = Utils.toFixedNumber( denominator, denominatorAxis.maxDecimals );

  // 'Apples' or 'Apple'
  const denominatorUnits = ( denominator > 1 ) ? denominatorPluralUnits : denominatorSingularUnits;

  // '$4.00'
  const numeratorString = StringUtils.format( UnitRatesStrings.pattern_0cost,
    URUtils.numberToString( numerator, numeratorAxis.maxDecimals, numeratorAxis.trimZeros ) );

  // '8 Apples'
  const denominatorString = StringUtils.format( UnitRatesStrings.pattern_0value_1units,
    URUtils.numberToString( denominator, denominatorAxis.maxDecimals, denominatorAxis.trimZeros ),
    denominatorUnits );

  return new ShoppingQuestion( questionString, answer, numerator, denominator, numeratorString, denominatorString, denominatorAxis );
}

unitRates.register( 'ShoppingQuestionFactory', ShoppingQuestionFactory );

export default ShoppingQuestionFactory;