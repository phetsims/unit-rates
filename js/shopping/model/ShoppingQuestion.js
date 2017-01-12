// Copyright 2016-2017, University of Colorado Boulder

/**
 * A question that appears in the 'Questions' panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {string} questionString - the question string to be displayed
   * @param {number} answer - the correct answer
   * @param {number} numerator
   * @param {number} denominator
   * @param {string} numeratorString - the numerator to display when the answer is revealed
   * @param {string} denominatorString - the denominator to display when the answer is revealed
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestion( questionString, answer, numerator, denominator, numeratorString, denominatorString, options ) {

    options = _.extend( {
      guessFormat: '{0}', // {string} format used by StringUtils.format to format the guess
      maxDigits: 4, // {number} maximum number of digits that can be entered on the keypad
      maxDecimals: 2, // {number} maximum number of decimal places that can be entered on the keypad
      trimZeros: false // {boolean} whether to trim trailing zeros in the decimal places
    }, options );

    var self = this;

    // @public (read-only)
    this.questionString = questionString;
    this.answer = answer;
    this.numerator = numerator;
    this.denominator = denominator;
    this.numeratorString = numeratorString;
    this.denominatorString = denominatorString;

    // @public (read-only) unpack options
    this.guessFormat = options.guessFormat;
    this.maxDigits = options.maxDigits;
    this.maxDecimals = options.maxDecimals;
    this.trimZeros = options.trimZeros;

    // @public {Property.<number|null>, null indicates no guess
    this.guessProperty = new Property( null );

    // @public emit1(this) is called when the question is answered correctly
    this.correctEmitter = new Emitter();

    // Notify observers when the question is answered correctly
    this.guessProperty.link( function( guess ) { // no unlink required
      if ( guess === answer ) {
        self.correctEmitter.emit1( self );
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
