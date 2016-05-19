// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var AnswerNumberDisplayNode = require( 'UNIT_RATES/common/view/AnswerNumberDisplayNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var TEXT_FONT  = new PhetFont( 12 );
  var TEXT_MAX_WIDTH  = 125;

  /**
   *
   * @param {ChallengeQuestionAnswer} challenge
   * @param {NumberKeypad} keypad
   * @param {Object} [options]
   * @constructor
   */
  function ChallengeQuestionAnswerNode( challenge, keypad, options ) {

    options = _.extend( {
      preValueString: '',
      postValueString: '',
      decimalPlaces: 2
    },  options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    this.challenge = challenge;
    this.keypad = keypad;

    this.challengeText = new Text( this.challenge.question, {
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );

    var pattern = options.preValueString + '{0}' + options.postValueString;
    this.editNumberDisplay = new AnswerNumberDisplayNode( keypad, this.challenge.valueProperty,
      this.challenge.answer, pattern, {
        centerX: this.challengeText.centerX,
        top: this.challengeText.bottom,
        decimalPlaces: options.decimalPlaces,
        buttonSpacing: 25
    } );

    options.children = [ this.challengeText, this.editNumberDisplay ];

    Node.call( this, options );
  }

  unitRates.register( 'ChallengeQuestionAnswerNode', ChallengeQuestionAnswerNode );

  return inherit( Node, ChallengeQuestionAnswerNode, {

  } );  // define

} );  // inherit
