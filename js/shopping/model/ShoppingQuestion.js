// Copyright 2016-2019, University of Colorado Boulder

/**
 * A question that appears in the 'Questions' panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SunConstants = require( 'SUN/SunConstants' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {string} questionString - the question string to be displayed
   * @param {number} answer - the correct answer
   * @param {number} numerator
   * @param {number} denominator
   * @param {string} numeratorString - the numerator to display when the answer is revealed
   * @param {string} denominatorString - the denominator to display when the answer is revealed
   * @param {Object} [answerOptions] - formatting for the answer (and guesses)
   * @constructor
   */
  function ShoppingQuestion( questionString, answer, numerator, denominator, numeratorString, denominatorString, answerOptions ) {

    var self = this;

    // @public (read-only)
    this.answerOptions = _.extend( {
      valueFormat: SunConstants.VALUE_NUMBERED_PLACEHOLDER, // {string} format used by StringUtils.format to format the guess
      maxDigits: 4, // {number} maximum number of digits that can be entered on the keypad
      maxDecimals: 2, // {number} maximum number of decimal places that can be entered on the keypad
      trimZeros: false // {boolean} whether to trim trailing zeros in the decimal places
    }, answerOptions );

    // @public (read-only)
    this.questionString = questionString;
    this.answer = answer;
    this.numerator = numerator;
    this.denominator = denominator;
    this.numeratorString = numeratorString;
    this.denominatorString = denominatorString;

    // @public {Property.<number|null>, the user's guess, null indicates no guess
    this.guessProperty = new Property( null );

    // @public emit(this) is called when the question is answered correctly
    this.correctEmitter = new Emitter( { validationEnabled: false } );

    // Notify observers when the question is answered correctly
    this.guessProperty.link( function( guess ) { // no unlink required
      if ( guess === answer ) {
        self.correctEmitter.emit( self );
      }
    } );
  }

  unitRates.register( 'ShoppingQuestion', ShoppingQuestion );

  return inherit( Object, ShoppingQuestion, {

    // @public
    reset: function() {
      this.guessProperty.reset();
    }
  } );
} );
