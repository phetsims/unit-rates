// Copyright 2016-2023, University of Colorado Boulder

/**
 * A question that appears in the 'Questions' panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import unitRates from '../../unitRates.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

type AnswerOptions = {
  valueFormat?: string; // format used by StringUtils.format to format the guess
  maxDigits?: number; // maximum number of digits that can be entered on the keypad
  maxDecimals?: number; // maximum number of decimal places that can be entered on the keypad
  trimZeros?: boolean; // whether to trim trailing zeros in the decimal places
};

export default class ShoppingQuestion {

  public readonly questionString: string;
  public readonly answer: number;
  public readonly numerator: number;
  public readonly denominator: number;
  public readonly numeratorString: string;
  public readonly denominatorString: string;
  public readonly answerOptions: AnswerOptions;

  public readonly guessProperty: Property<number | null>; // the user's guess, null indicates no guess
  public readonly correctEmitter: Emitter<[ShoppingQuestion]>; // emit is called when the question is answered correctly

  /**
   * @param questionString - the question string to be displayed
   * @param answer - the correct answer
   * @param numerator
   * @param denominator
   * @param numeratorString - the numerator to display when the answer is revealed
   * @param denominatorString - the denominator to display when the answer is revealed
   * @param [answerOptions] - formatting for the answer (and guesses)
   */
  public constructor( questionString: string, answer: number, numerator: number, denominator: number,
                      numeratorString: string, denominatorString: string, answerOptions?: AnswerOptions ) {

    this.questionString = questionString;
    this.answer = answer;
    this.numerator = numerator;
    this.denominator = denominator;
    this.numeratorString = numeratorString;
    this.denominatorString = denominatorString;

    this.answerOptions = combineOptions<AnswerOptions>( {
      valueFormat: SunConstants.VALUE_NUMBERED_PLACEHOLDER, // {string} format used by StringUtils.format to format the guess
      maxDigits: 4, // {number} maximum number of digits that can be entered on the keypad
      maxDecimals: 2, // {number} maximum number of decimal places that can be entered on the keypad
      trimZeros: false // {boolean} whether to trim trailing zeros in the decimal places
    }, answerOptions );

    this.guessProperty = new Property<number | null>( null );

    this.correctEmitter = new Emitter( {
      parameters: [ { valueType: ShoppingQuestion } ]
    } );

    // Notify observers when the question is answered correctly, no unlink required
    this.guessProperty.link( guess => {
      if ( guess === answer ) {
        this.correctEmitter.emit( this );
      }
    } );
  }

  public reset(): void {
    this.guessProperty.reset();
  }
}

unitRates.register( 'ShoppingQuestion', ShoppingQuestion );