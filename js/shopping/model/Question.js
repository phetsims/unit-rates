// Copyright 2016, University of Colorado Boulder

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
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Util = require( 'DOT/Util' );

  // strings
  var costOfNUnitsString = require( 'string!UNIT_RATES/costOfNUnits' );
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );
  var itemsForAmountString = require( 'string!UNIT_RATES/itemsForAmount' );
  var unitRateQuestionString = require( 'string!UNIT_RATES/unitRateQuestion' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  /**
   * @param {string} questionString - the question string to be displayed
   * @param {number} answer - the correct answer
   * @param {string} numeratorString - the numerator to display when the answer is revealed
   * @param {string} denominatorString - the denominator to display when the answer is revealed
   * @param {Object} [options]
   * @constructor
   */
  function Question( questionString, answer, numeratorString, denominatorString, options ) {

    options = _.extend( {
      maxDigits: 4, // {number} maximum number of digits to enter on the keypad
      maxDecimals: 2, // {number} maximum number of decimal places to enter on the keypad
      restrictGuessDecimalPlaces: true, // {boolean} whether to restrict display of guess to show exactly options.maxDecimals
      guessFormat: '{0}' // {string} format used by StringUtils.format to format the guess
    }, options );

    var self = this;

    // @public (read-only)
    this.questionString = questionString;
    this.answer = answer;
    this.numeratorString = numeratorString;
    this.denominatorString = denominatorString;
    this.maxDigits = options.maxDigits;
    this.maxDecimals = options.maxDecimals;
    this.restrictGuessDecimalPlaces = options.restrictGuessDecimalPlaces;
    this.guessFormat = options.guessFormat;

    // @public {Property.<number|null>, null indicates no guess
    this.guessProperty = new Property( null );

    // @public emit1(this) is called when the question is answered correctly
    this.correctEmitter = new Emitter();

    // Notify observers when the question is answered correctly
    this.guessProperty.link( function( guess ) {
      if ( guess === answer ) {
        self.correctEmitter.emit1( self );
      }
    } );
  }

  unitRates.register( 'Question', Question );

  return inherit( Object, Question, {

    // @public
    reset: function() {
      this.guessProperty.reset();
    }
  }, {

    /**
     * Creates a question of the form 'Unit Rate?'
     * @param {number} unitRate
     * @param {string} units
     * @param {Object} [options] - options to Question constructor
     * @returns {Question}
     * @public
     * @static
     */
    createUnitRate: function( unitRate, units, options ) {

      options = _.extend( {
        guessFormat: currencyValueString, // {string} format for the guessed value
        maxDecimals: 2
      }, options );

      // 'Unit Rate?'
      var questionString = unitRateQuestionString;

      // '$0.50'
      var numeratorString = StringUtils.format( currencyValueString, Util.toFixed( unitRate, 2 ) );

      // '1 Apple'
      var denominatorString = StringUtils.format( valueUnitsString, 1, units );

      return new Question( questionString, unitRate, numeratorString, denominatorString, options );
    },

    /**
     * Creates a question of the form 'Cost of 10 Apples?' or 'Cost of 2.2 pounds?'
     * @param {number} quantity
     * @param {number} unitRate
     * @param {string} singularName
     * @param {string} pluralName
     * @param {Object} [options] - options to Question constructor
     * @returns {Question}
     * @public
     * @static
     */
    createCostOf: function( quantity, unitRate, singularName, pluralName, options ) {

      options = _.extend( {
        guessFormat: currencyValueString, // {string} format for the guessed value
        maxDecimals: 2
      }, options );

      // 'Apples' or 'Apple'
      var units = ( quantity > 1 ) ? pluralName : singularName;

      // cost
      var answer = Util.toFixedNumber( quantity * unitRate, 2 );

      // 'Cost of 10 Apples?'
      var questionString = StringUtils.format( costOfNUnitsString, quantity, units );

      // '$3.00'
      var numeratorString = StringUtils.format( currencyValueString, Util.toFixed( answer, 2 ) );

      // '10 Apples'
      var denominatorString = StringUtils.format( valueUnitsString, quantity, units );

      return new Question( questionString, answer, numeratorString, denominatorString, options );
    },

    /**
     * Creates a question of the form 'Apples for $3.00?'
     * @param {number} quantity
     * @param {number} unitRate
     * @param {string} singularName
     * @param {string} pluralName
     * @param {Object} [options] - options to Question constructor
     * @returns {Question}
     * @public
     * @static
     */
    createItemsFor: function( quantity, unitRate, singularName, pluralName, options ) {

      options = _.extend( {
        guessFormat: '{0}', // {string} format for the guessed value
        maxDigits: 3,
        maxDecimals: 1,
        restrictGuessDecimalPlaces: false
      }, options );

      // 'Apples' or 'Apple'
      var units = ( quantity > 1 ) ? pluralName : singularName;

      // '$4.00'
      var numeratorString = StringUtils.format( currencyValueString, Util.toFixed( quantity * unitRate, 2 ) );

      // '8 Apples'
      var denominatorString = StringUtils.format( valueUnitsString, Util.toFixed( quantity, 0 ), units );

      // 'Apples for $4.00?'
      var questionString = StringUtils.format( itemsForAmountString, pluralName, numeratorString );

      return new Question( questionString, quantity, numeratorString, denominatorString, options );
    }
  } );
} );
