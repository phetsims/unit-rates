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
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

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
  function ShoppingQuestion( questionString, answer, numeratorString, denominatorString, options ) {

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
    this.guessProperty.link( function( guess ) {
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
  }, {

    /**
     * Creates a question of the form 'Unit Rate?'
     * @param {number} unitRate
     * @param {string} units
     * @param {Object} numeratorOptions - see ShoppingItem options.numeratorOptions
     * @param {Object} denominatorOptions - see ShoppingItem options.denominatorOptions
     * @returns {ShoppingQuestion}
     * @public
     * @static
     */
    createUnitRate: function( unitRate, units, numeratorOptions, denominatorOptions ) {

      // 'Unit Rate?'
      var questionString = unitRateQuestionString;

      // '$0.50'
      var numeratorString = StringUtils.format( currencyValueString,
        URUtil.numberToString( unitRate, numeratorOptions.maxDecimals, numeratorOptions.trimZeros ) );

      // '1 Apple'
      var denominatorString = StringUtils.format( valueUnitsString,
        URUtil.numberToString( 1, denominatorOptions.maxDecimals, denominatorOptions.trimZeros ),
        units );

      return new ShoppingQuestion( questionString, unitRate, numeratorString, denominatorString, {
        guessFormat: numeratorOptions.valueFormat,
        maxDigits: numeratorOptions.maxDigits,
        maxDecimals: numeratorOptions.maxDecimals,
        trimZeros: numeratorOptions.trimZeros
      } );
    },

    /**
     * Creates a question of the form 'Cost of 10 Apples?' or 'Cost of 2.2 pounds?'
     * @param {number} quantity
     * @param {number} unitRate
     * @param {string} singularName
     * @param {string} pluralName
     * @param {Object} numeratorOptions - see ShoppingItem options.numeratorOptions
     * @param {Object} denominatorOptions - see ShoppingItem options.denominatorOptions
     * @returns {ShoppingQuestion}
     * @public
     * @static
     */
    createCostOf: function( quantity, unitRate, singularName, pluralName, numeratorOptions, denominatorOptions ) {

      // 'Apples' or 'Apple'
      var units = ( quantity > 1 ) ? pluralName : singularName;

      // cost
      var answer = Util.toFixedNumber( quantity * unitRate, numeratorOptions.maxDecimals );

      // 'Cost of 10 Apples?'
      var questionString = StringUtils.format( costOfNUnitsString,
        URUtil.numberToString( quantity, denominatorOptions.maxDecimals, denominatorOptions.trimZeros ),
        units );

      // '$3.00'
      var numeratorString = StringUtils.format( currencyValueString,
        URUtil.numberToString( answer, numeratorOptions.maxDecimals, numeratorOptions.trimZeros ) );

      // '10 Apples'
      var denominatorString = StringUtils.format( valueUnitsString,
        URUtil.numberToString( quantity, denominatorOptions.maxDecimals, denominatorOptions.trimZeros ),
        units );

      return new ShoppingQuestion( questionString, answer, numeratorString, denominatorString, {
        guessFormat: numeratorOptions.valueFormat,
        maxDigits: numeratorOptions.maxDigits,
        maxDecimals: numeratorOptions.maxDecimals,
        trimZeros: numeratorOptions.trimZeros
      } );
    },

    /**
     * Creates a question of the form 'Apples for $3.00?'
     * @param {number} quantity
     * @param {number} unitRate
     * @param {string} singularName
     * @param {string} pluralName
     * @param {Object} numeratorOptions - see ShoppingItem options.numeratorOptions
     * @param {Object} denominatorOptions - see ShoppingItem options.denominatorOptions
     * @returns {ShoppingQuestion}
     * @public
     * @static
     */
    createItemsFor: function( quantity, unitRate, singularName, pluralName, numeratorOptions, denominatorOptions ) {

      // 'Apples' or 'Apple'
      var units = ( quantity > 1 ) ? pluralName : singularName;

      // '$4.00'
      var numeratorString = StringUtils.format( currencyValueString,
        URUtil.numberToString( unitRate, numeratorOptions.maxDecimals, numeratorOptions.trimZeros ) );

      // '8 Apples'
      var denominatorString = StringUtils.format( valueUnitsString,
        URUtil.numberToString( quantity, denominatorOptions.maxDecimals, denominatorOptions.trimZeros ),
        units );

      // 'Apples for $4.00?'
      var questionString = StringUtils.format( itemsForAmountString, pluralName, numeratorString );

      return new ShoppingQuestion( questionString, quantity, numeratorString, denominatorString, {
        guessFormat: denominatorOptions.valueFormat,
        maxDigits: denominatorOptions.maxDigits,
        maxDecimals: denominatorOptions.maxDecimals,
        trimZeros: denominatorOptions.trimZeros
      } );
    }
  } );
} );
