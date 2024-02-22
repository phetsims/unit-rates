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
import { DerivedStringProperty, TReadOnlyProperty } from '../../../../axon/js/imports.js';

const ShoppingQuestionFactory = {

  /**
   * Creates question sets from raw data.
   *
   * @param questionQuantities - number of items for each question, see ShoppingItemData
   * @param unitRate
   * @param denominatorSingularUnitsStringProperty - denominator units to use for questions with singular quantities
   * @param denominatorPluralUnitsStringProperty - denominator units to use for questions with plural quantities
   * @param questionUnitsStringProperty - units used for "Apples for $10.00?" type questions
   * @param numeratorAxis
   * @param denominatorAxis
   */
  createQuestionSets( questionQuantities: number[][],
                      unitRate: number,
                      denominatorSingularUnitsStringProperty: TReadOnlyProperty<string>,
                      denominatorPluralUnitsStringProperty: TReadOnlyProperty<string>,
                      questionUnitsStringProperty: TReadOnlyProperty<string>,
                      numeratorAxis: Axis,
                      denominatorAxis: Axis ): ShoppingQuestion[][] {

    const questionSets: ShoppingQuestion[][] = [];

    questionQuantities.forEach( quantities => {

      const questions = [];

      // the first N-1 questions are of the form 'Cost of 3 Apples?'
      for ( let i = 0; i < quantities.length - 1; i++ ) {
        questions.push( createCostOfQuestion( quantities[ i ], unitRate, denominatorSingularUnitsStringProperty,
          denominatorPluralUnitsStringProperty, numeratorAxis, denominatorAxis ) );
      }

      // the last question is of the form 'Apples for $3.00?'
      questions.push( createItemsForQuestion( quantities[ quantities.length - 1 ],
        unitRate, denominatorSingularUnitsStringProperty, denominatorPluralUnitsStringProperty,
        questionUnitsStringProperty, numeratorAxis, denominatorAxis ) );

      questionSets.push( questions );
    } );

    return questionSets;
  }
};

/**
 * Creates a question of the form 'Cost of 10 Apples?' or 'Cost of 2.2 pounds?'
 * @param denominator
 * @param unitRate
 * @param denominatorSingularUnitsStringProperty
 * @param denominatorPluralUnitsStringProperty
 * @param numeratorAxis
 * @param denominatorAxis
 */
function createCostOfQuestion( denominator: number,
                               unitRate: number,
                               denominatorSingularUnitsStringProperty: TReadOnlyProperty<string>,
                               denominatorPluralUnitsStringProperty: TReadOnlyProperty<string>,
                               numeratorAxis: Axis,
                               denominatorAxis: Axis ): ShoppingQuestion {

  // 'Apples' or 'Apple'
  const unitsStringProperty = ( denominator > 1 ) ? denominatorPluralUnitsStringProperty : denominatorSingularUnitsStringProperty;

  // 'Cost of 10 Apples?'
  const questionStringProperty = new DerivedStringProperty(
    [ UnitRatesStrings.pattern_costOf_0quantity_1unitsStringProperty, unitsStringProperty ],
    ( patternString, unitsString ) => {
      const valueString = URUtils.numberToString( denominator, denominatorAxis.maxDecimals, denominatorAxis.trimZeros );
      return StringUtils.format( patternString, valueString, unitsString );
    } );

  // answer
  const numerator = denominator * unitRate;
  const answer = Utils.toFixedNumber( numerator, numeratorAxis.maxDecimals );

  // '$3.00'
  const numeratorStringProperty = new DerivedStringProperty(
    [ UnitRatesStrings.pattern_0costStringProperty ],
    patternString => {
      const valueString = URUtils.numberToString( numerator, numeratorAxis.maxDecimals, numeratorAxis.trimZeros );
      return StringUtils.format( patternString, valueString );
    } );

  // '10 Apples'
  const denominatorStringProperty = new DerivedStringProperty(
    [ UnitRatesStrings.pattern_0value_1unitsStringProperty, unitsStringProperty ],
    ( patternString, unitsString ) => {
      const valueString = URUtils.numberToString( denominator, denominatorAxis.maxDecimals, denominatorAxis.trimZeros );
      return StringUtils.format( patternString, valueString, unitsString );
    } );

  return new ShoppingQuestion( questionStringProperty, answer, numerator, denominator, numeratorStringProperty,
    denominatorStringProperty, numeratorAxis );
}

/**
 * Creates a question of the form 'Apples for $3.00?'
 * @param denominator
 * @param unitRate
 * @param denominatorSingularUnitsStringProperty
 * @param denominatorPluralUnitsStringProperty
 * @param questionUnitsStringProperty
 * @param numeratorAxis
 * @param denominatorAxis
 */
function createItemsForQuestion( denominator: number,
                                 unitRate: number,
                                 denominatorSingularUnitsStringProperty: TReadOnlyProperty<string>,
                                 denominatorPluralUnitsStringProperty: TReadOnlyProperty<string>,
                                 questionUnitsStringProperty: TReadOnlyProperty<string>,
                                 numeratorAxis: Axis,
                                 denominatorAxis: Axis ): ShoppingQuestion {

  const numerator = denominator * unitRate;

  // 'Apples for $4.00?'
  const questionStringProperty = new DerivedStringProperty(
    [ UnitRatesStrings.pattern_0items_1costStringProperty, questionUnitsStringProperty ],
    ( patternString, questionUnitsString ) => {
      const valueString = URUtils.numberToString( numerator, numeratorAxis.maxDecimals, numeratorAxis.trimZeros );
      return StringUtils.format( patternString, questionUnitsString, valueString );
    } );

  // answer
  const answer = Utils.toFixedNumber( denominator, denominatorAxis.maxDecimals );

  // '$4.00'
  const numeratorStringProperty = new DerivedStringProperty( [ UnitRatesStrings.pattern_0costStringProperty ],
    patternString => {
      const valueString = URUtils.numberToString( numerator, numeratorAxis.maxDecimals, numeratorAxis.trimZeros );
      return StringUtils.format( patternString, valueString );
    } );

  // 'Apples' or 'Apple'
  const denominatorUnitsStringProperty = ( denominator > 1 ) ? denominatorPluralUnitsStringProperty : denominatorSingularUnitsStringProperty;

  // '8 Apples'
  const denominatorStringProperty = new DerivedStringProperty(
    [ UnitRatesStrings.pattern_0value_1unitsStringProperty, denominatorUnitsStringProperty ],
    ( patternString, unitsString ) => {
      const valueString = URUtils.numberToString( denominator, denominatorAxis.maxDecimals, denominatorAxis.trimZeros );
      return StringUtils.format( patternString, valueString, unitsString );
    } );

  return new ShoppingQuestion( questionStringProperty, answer, numerator, denominator, numeratorStringProperty,
    denominatorStringProperty, denominatorAxis );
}

unitRates.register( 'ShoppingQuestionFactory', ShoppingQuestionFactory );

export default ShoppingQuestionFactory;