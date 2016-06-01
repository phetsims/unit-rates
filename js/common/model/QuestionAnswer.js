// Copyright 2002-2016, University of Colorado Boulder

/**
 * All the challenge information for all items
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
      unitString: ''
    },  options || {} );


    // @public
    this.questionString = options.questionString;
    this.unitString     = options.unitString;
    this.answerValue    = answerValue;
    this.valueProperty  = new Property( 0 );
  }

  unitRates.register( 'QuestionAnswer', QuestionAnswer );

  return inherit( Object, QuestionAnswer, {

    /**
     *
     * @public
     */
    isAnswerZero: function() {
      return( this.valueProperty.value === 0 );
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
