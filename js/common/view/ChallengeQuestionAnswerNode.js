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
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var VERICAL_SPACING     = 5;
  var HORIZONTAL_SPACING  = 25;
  var TEXT_FONT           = new PhetFont( 12 );
  var TEXT_MAX_WIDTH      = 125;
  var DIVISOR_WIDTH       = 75;

  /**
   *
   * @param {ChallengeQuestionAnswer} qna
   * @param {NumberKeypad} keypad
   * @param {Object} [options]
   * @constructor
   */
  function ChallengeQuestionAnswerNode( qna, keypad, options ) {

    options = _.extend( {
      showUnitText: false,
      preValueString: '',
      postValueString: '',
      decimalPlaces: 2
    },  options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    this.qna = qna;
    this.keypad = keypad;

    var challengeText = new Text( this.qna.questionString, {
      left: 0,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );

    var pattern = options.preValueString + '{0}' + options.postValueString;
    this.editNumberDisplay = new AnswerNumberDisplayNode( keypad, this.qna.valueProperty,
      this.qna.answerValue, pattern, {
        centerX: challengeText.centerX - HORIZONTAL_SPACING,
        top: challengeText.bottom + VERICAL_SPACING,
        decimalPlaces: options.decimalPlaces,
        buttonSpacing: HORIZONTAL_SPACING
    } );

    // unit line
    this.unitLine = new Path( new Shape()
        .moveTo( challengeText.centerX - DIVISOR_WIDTH / 2, this.editNumberDisplay.bottom + VERICAL_SPACING )
        .lineTo( challengeText.centerX + DIVISOR_WIDTH / 2, this.editNumberDisplay.bottom + VERICAL_SPACING ), {
      stroke: 'black',
      lineWidth: 1.25,
      visible: options.showUnitText
    } );

    // unit label
    this.unitText = new Text( this.qna.unitString, {
      centerX: challengeText.centerX,
      top: this.unitLine.bottom + 2,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      visible: options.showUnitText
    } );

    // show unit text on correct value
    this.qna.valueProperty.link( function( value, oldValue ) {
      if( value === self.qna.answerValue ) {
        self.unitLine.visible = true;
        self.unitText.visible = true;
      }
    } );

    options.children = [ challengeText, this.editNumberDisplay, this.unitLine, this.unitText ];

    Node.call( this, options );
  }

  unitRates.register( 'ChallengeQuestionAnswerNode', ChallengeQuestionAnswerNode );

  return inherit( Node, ChallengeQuestionAnswerNode, {

  } );  // define

} );  // inherit
