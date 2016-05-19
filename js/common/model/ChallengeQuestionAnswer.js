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
   * @param {string} question
   * @param {string} showUnit
   * @param {number} answer
   * @param {Object} [options]
   * @constructor
   */
  function ChallengeQuestionAnswer( question, unit, answer, options ) {

    options = _.extend( {
      label1: '',
      label2: ''
    },  options || {} );

    // @public
    this.question      = question;
    this.unit          = unit;
    this.answer        = answer;
    this.valueProperty = new Property( 0 );
  }

  unitRates.register( 'ChallengeQuestionAnswer', ChallengeQuestionAnswer );

  return inherit( Object, ChallengeQuestionAnswer, {

  } );

} );
