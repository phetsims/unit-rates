// Copyright 2016, University of Colorado Boulder

/**
 * A container class for a question & answer pair
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Util = require( 'DOT/Util' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  var DEFAULT_ANSWER_VALUE = -1;    // in this sim all correct answers are positive, so this us used to indicate 'unanswered'

  /**
   * @param {Object} item - an Object to associate with this question
   * @param {number} answerValue - the correct answer value
   * @param {number} answerText - the text to display on a correct answer value
   * @param {Object} [options]
   * @constructor
   */
  function OLDQuestionAnswer( item, answerValue, answerText, options ) {

    options = _.extend( {
      questionString: '',
      unitString: '',
      decimalPlaces: 2,
      onCorrectAnswerCallback: null   // function called when the question has been answered correctly
    }, options );

    var self = this;

    // @public (read-only)
    this.item = item; // {Item} associated with this question
    this.questionString = options.questionString; // {string} question to be asked
    this.unitString = options.unitString; // {string} unit
    this.decimalPlaces = options.decimalPlaces; // the number of decimals to use when evaluating correctness
    this.answerValue = answerValue; // {number} the correct answer value
    this.answerText = answerText; // {Text} the correct answer text
    this.valueProperty = new Property( DEFAULT_ANSWER_VALUE ); // user's answer input property

    // @protected {function}
    this.onCorrectAnswerCallback = options.onCorrectAnswerCallback;

    // make callback on correct answer
    if ( this.onCorrectAnswerCallback ) {
      this.valueProperty.link( function( value, oldValue ) {
        if ( self.isAnswerCorrect() ) {
          self.onCorrectAnswerCallback();
        }
      } );
    }
  }

  unitRates.register( 'OLDQuestionAnswer', OLDQuestionAnswer );

  return inherit( Object, OLDQuestionAnswer, {

    /**
     * Sets the answer value
     *
     * @param {number} answerValue - the correct answer value
     * @public
     */
    setAnswerValue: function( answerValue ) {
      this.answerValue = answerValue;              // {number} the correct answer value
    },

    /**
     * Sets the answer to correct or not
     *
     * @param {boolean} state
     * @public
     */
    setCorrect: function( state ) {
      this.valueProperty.value = ( state ? this.answerValue : DEFAULT_ANSWER_VALUE);
    },

    /**
     * Convenience function telling if the current user input is a valid value
     *
     * @returns {boolean}
     * @public
     */
    isAnswerValid: function() {
      return ( this.valueProperty.value >= 0 );
    },

    /**
     * Convenience function telling if the current user input matches the correct value
     *
     * @returns {boolean}
     * @public
     */
    isAnswerCorrect: function() {
      return ( Util.toFixedNumber( this.answerValue, this.decimalPlaces ) ===
               Util.toFixedNumber( this.valueProperty.value, this.decimalPlaces ) );
    },

    /**
     * Returns the number of decimal places in the current answer value (i.e. 1.1 = 1, 1.33 = 2, 1.234 = 3)
     *
     * @return {number}
     * @public
     */
    getAnswerPrecision: function() {

      function roundDecimals( value, decimals ) {
        return Number( Util.roundSymmetric( value.toString() + 'e' + decimals.toString() ) + 'e-' + decimals );
      }

      var count = roundDecimals( this.valueProperty.value, 2 );

      if ( !isFinite( count ) ) {
        return 0;
      }

      var e = 1;
      var p = 0;
      while ( Util.roundSymmetric( count * e ) / e !== count ) {
        e *= 10;
        p++;
      }
      return p;
    },

    // @public
    reset: function() {
      this.valueProperty.reset();
    },

    // @public
    dispose: function() {
      this.valueProperty.unlinkAll();
      this.valueProperty.dispose();
    }

  } );  // inherit

} );  // define
