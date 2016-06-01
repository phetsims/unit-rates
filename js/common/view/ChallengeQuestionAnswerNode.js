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
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var VERICAL_SPACING     = 4;
  var HORIZONTAL_SPACING  = 30;
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
      decimalPlaces: 2,
      correctTextColor: 'rgb(0,0,0,1)'
    },  options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    this.qna = qna;
    this.keypad = keypad;
    this.correctTextColor = options.correctTextColor;

    this.challengeText = new Text( this.qna.questionString, {
      left: 0,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );

    var pattern = options.preValueString + '{0}' + options.postValueString;
    this.editNumberDisplay = new AnswerNumberDisplayNode( keypad, qna, pattern, {
        centerX: this.challengeText.centerX - HORIZONTAL_SPACING,
        top: this.challengeText.bottom + VERICAL_SPACING,
        buttonSpacing: HORIZONTAL_SPACING,
        font: new PhetFont( 14 ),
        decimalPlaces: options.decimalPlaces,
        correctTextColor: options.correctTextColor
    } );

    this.faceNode = new FaceNode( 18, {
      left: this.editNumberDisplay.right + HORIZONTAL_SPACING,
      centerY: this.editNumberDisplay.centerY,
      headLineWidth: 1,
      visible: false
    } );

    // unit line
    this.unitLine = new Path( new Shape()
        .moveTo( this.challengeText.centerX - DIVISOR_WIDTH / 2, this.editNumberDisplay.bottom + VERICAL_SPACING )
        .lineTo( this.challengeText.centerX + DIVISOR_WIDTH / 2, this.editNumberDisplay.bottom + VERICAL_SPACING ), {
      stroke: 'black',
      lineWidth: 1.25,
      visible: options.showUnitText
    } );

    // unit label
    this.unitText = new Text( this.qna.unitString, {
      centerX: this.challengeText.centerX,
      top: this.unitLine.bottom + 2,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      visible: options.showUnitText
    } );

    // show unit text, change color & smile on correct value
    this.qna.valueProperty.link( function( value, oldValue ) {
      if( self.qna.isAnswerCorrect() ) {
        self.unitLine.visible = true;
        self.unitText.visible = true;
        self.faceNode.visible = true;
        self.challengeText.setFill( self.correctTextColor );
        self.unitText.setFill( self.correctTextColor );
        self.unitLine.setStroke( self.correctTextColor );
        self.faceNode.smile();
      }
      else if( !self.qna.isAnswerZero() ){
        self.faceNode.visible = true;
        self.faceNode.frown();
      }
      else {
        self.faceNode.visible = false;
      }
    } );

    options.children = [ this.challengeText, this.editNumberDisplay, this.faceNode, this.unitLine, this.unitText ];

    Node.call( this, options );
  }

  unitRates.register( 'ChallengeQuestionAnswerNode', ChallengeQuestionAnswerNode );

  return inherit( Node, ChallengeQuestionAnswerNode, {

  } );  // define

} );  // inherit
