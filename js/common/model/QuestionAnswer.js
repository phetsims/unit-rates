// Copyright 2002-2016, University of Colorado Boulder

/**
 * A container class for a question & answer pair
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Property = require( 'AXON/Property' );
  var Util = require( 'DOT/Util' );

  // constants
  var DEFAULT_ANSWER_VALUE = -1;

  /**
   * @param {Item} item - the item associated with this question
   * @param {number} answerValue - the correct answer value
   * @param {number} answerText - the text to display on a correct answer value
   * @param {Object} [options]
   * @constructor
   */
  function QuestionAnswer( item, answerValue, answerText, options ) {

    options = _.extend( {
      questionString: '',
      unitString:     '',
      onCorrectAnswerCallback: null   // function called when the question has been answered correctly
    },  options || {} );

    var self = this;

    // @public (read-only) - all
    this.item           = item;                                 // {Item} associated with this question
    this.questionString = options.questionString;               // {string} question to be asked
    this.unitString     = options.unitString;                   // {string} unit
    this.answerValue    = answerValue;                          // {number} the correct answer value
    this.answerText     = answerText;                           // {Text} the correct answer text
    this.valueProperty  = new Property( DEFAULT_ANSWER_VALUE ); // user's answer input property

    // @protected - {function}
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

  unitRates.register( 'QuestionAnswer', QuestionAnswer );

  return inherit( Object, QuestionAnswer, {

    /**
     * Sets the answer to correct or not
     * @param {number} answerValue - the correct answer value
     * @public
     */
    setAnswerValue: function( answerValue ) {
      this.answerValue = answerValue;              // {number} the correct answer value
    },

    /**
     * Sets the answer to correct or not
     * @param {boolean} state
     * @public
     */
    setCorrect: function( state ) {
      this.valueProperty.value = ( state ? this.answerValue : DEFAULT_ANSWER_VALUE);
    },

    /**
     * Convenience function telling if the current user input is a valid value
     * @returns {boolean}
     * @public
     */
    isAnswerValid: function() {
      return ( this.valueProperty.value >= 0 );
    },

    /**
     * Convenience function telling if the current user input matches the correct value
     * @returns {boolean}
     * @public
     */
    isAnswerCorrect: function() {
      return ( Number( this.answerValue ) === Number( this.valueProperty.value ) );
    },

    /**
     * Returns the number of decimal places in the current answer value (i.e. 1.1 = 1, 1.33 = 2, 1.234 = 3)
     * @return {number}
     * @public
     */
    getAnswerPrecision: function() {

      function roundDecimals(value, decimals) {
        return Number(Util.roundSymmetric(value+'e'+decimals)+'e-'+decimals);
      }

      var count = roundDecimals( this.valueProperty.value, 2 );

      if ( !isFinite( count ) ) {
        return 0;
      }

      var e = 1;
      var p = 0;
      while ( Util.roundSymmetric( count * e ) / e !== count ) {
        e *= 10; p++;
      }
      return p;
    },

    /**
     * Reset to the initial state
     * @public
     */
    reset: function() {
      this.valueProperty.reset();
    },

    // @public
    dispose: function() {
      this.valueProperty.unlinkAll();
    }

  } );  // inherit

} );  // define
