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

  /**
   * @param {Item} item - the item associated with this question
   * @param {number} answerValue - the correct answer value
   * @param {Object} [options]
   * @constructor
   */
  function QuestionAnswer( item, answerValue, options ) {

    options = _.extend( {
      questionString: '',
      unitString:     '',
      onCorrectAnswerCallback: null   // function called when the question has been answered correctly
    },  options || {} );

    var self = this;

    // @public (read-only) - all
    this.item           = item;                     // {Item} associated with this question
    this.questionString = options.questionString;   // {string} question to be asked
    this.unitString     = options.unitString;       // {string} unit
    this.answerValue    = answerValue;              // {number} the correct answer value
    this.valueProperty  = new Property( -1 );       // user's answer input property

    // @protected - {function}
    this.onCorrectAnswerCallback = options.onCorrectAnswerCallback;

    // make callback on correct answer
    if( options.onCorrectAnswerCallback ) {
      this.valueProperty.link( function( value, oldValue ) {
        if( self.isAnswerCorrect() ) {
          self.onCorrectAnswerCallback();
        }
      } );
    }
  }

  unitRates.register( 'QuestionAnswer', QuestionAnswer );

  return inherit( Object, QuestionAnswer, {

    /**
     * Convenience function telling if the current user input is a valid value
     * @returns {boolean}
     * @public
     */
    isAnswerValid: function() {
      return( this.valueProperty.value >= 0 );
    },

    /**
     * Convenience function telling if the current user input matches the correct value
     * @returns {boolean}
     * @public
     */
    isAnswerCorrect: function() {
      return( Number( this.answerValue ) === Number( this.valueProperty.value ) );
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
      console.log('QuestionAnswer dispose');
      this.valueProperty.unlinkAll();
    }

  } );  // inherit

} );  // define
