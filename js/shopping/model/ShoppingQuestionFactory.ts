// Copyright 2017-2023, University of Colorado Boulder

/**
 * Functions for creating ShoppingQuestions and question sets.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import unitRates from '../../unitRates.js';
import ShoppingQuestion from './ShoppingQuestion.js';
import Axis from '../../common/model/Axis.js';
import { TReadOnlyProperty } from '../../../../axon/js/imports.js';
import CostOfQuestion from './CostOfQuestion.js';
import ItemsForQuestion from './ItemsForQuestion.js';

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
        questions.push( new CostOfQuestion( quantities[ i ], unitRate, denominatorSingularUnitsStringProperty,
          denominatorPluralUnitsStringProperty, numeratorAxis, denominatorAxis ) );
      }

      // the last question is of the form 'Apples for $3.00?'
      questions.push( new ItemsForQuestion( quantities[ quantities.length - 1 ],
        unitRate, denominatorSingularUnitsStringProperty, denominatorPluralUnitsStringProperty,
        questionUnitsStringProperty, numeratorAxis, denominatorAxis ) );

      questionSets.push( questions );
    } );

    return questionSets;
  }
};

unitRates.register( 'ShoppingQuestionFactory', ShoppingQuestionFactory );

export default ShoppingQuestionFactory;