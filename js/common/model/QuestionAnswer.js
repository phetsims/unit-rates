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
   * @param {string} questionString
   * @param {string | number} unitString
   * @param {number} answerValue
   * @constructor
   */
  function QuestionAnswer( answerValue, options ) {

    options = _.extend( {
      questionString: '',
      unitString:     ''
    },  options || {} );


    // @public
    this.questionString = options.questionString;
    this.unitString     = options.unitString;
    this.answerValue    = answerValue;              // the correct answer value
    this.valueProperty  = new Property( -1 );        // user's answer input property
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
    }

  } );

} );
