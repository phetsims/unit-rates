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
   * @param {string} unit
   * @param {number} answer
   * @constructor
   */
  function ChallengeQuestionAnswer( question, unit, answer ) {

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
