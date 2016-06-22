// Copyright 2002-2016, University of Colorado Boulder

/**
 * A container for a 'question' & answer
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
   * @param {Item} item
   * @param {number} answerValue
   * @param {Object} [options]
   * @constructor
   */
  function QuestionAnswer( item, answerValue, options ) {

    options = _.extend( {
      questionString: '',
      unitString:     '',
      onCorrectAnswerCallback: null
    },  options || {} );

    var self = this;

    // @public
    this.item           = item;
    this.questionString = options.questionString;
    this.unitString     = options.unitString;
    this.answerValue    = answerValue;              // the correct answer value
    this.valueProperty  = new Property( -1 );       // user's answer input property

    // @protected
    this.onCorrectAnswerCallback = options.onCorrectAnswerCallback;

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
     *
     * @public
     */
    isAnswerValid: function() {
      return( this.valueProperty.value >= 0 );
    },

    /**
     *
     * @public
     */
    isAnswerCorrect: function() {
      return( Number( this.answerValue ) === Number( this.valueProperty.value ) );
    },

    /**
     *
     * @public
     */
    reset: function() {
      this.valueProperty.reset();
    }

  } );

} );
