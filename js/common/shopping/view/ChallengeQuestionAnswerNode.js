// Copyright 2016, University of Colorado Boulder

/**
 * The node for a single Challenge question. Each node uses a QuestionAnswer instance to determine correctness.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var EditNumberDisplayNode = require( 'UNIT_RATES/common/view/EditNumberDisplayNode' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  var VERTICAL_SPACING = 4;                  // vertical space between UI components
  var HORIZONTAL_SPACING = 30;                 // horizontal space between UI components
  var TEXT_FONT = new PhetFont( 12 ); // Font to use for all text
  var TEXT_MAX_WIDTH = 125;
  var DIVISOR_WIDTH = 75;                 // width of the horizontal line between the number entry & unit text
  var DEFAULT_TEXT_COLOR = 'rgba(0,0,0,0)';
  var DEFAULT_BORDER_COLOR = 'rgba(0,0,0,1)';

  /**
   * @param {QuestionAnswer} qna
   * @param {NumberKeypad} keypad - shared keypad node
   * @param {Object} [options]
   * @constructor
   */
  function ChallengeQuestionAnswerNode( qna, keypad, options ) {

    options = _.extend( {
      showUnitText: false,              // is the unit text string displayed or not
      preValueString: '',                 // text shown before the value in the number display node
      postValueString: '',                 // text shown after the value in the number display node
      decimalPlaces: 2,                  // # of decimal places to use in the number display node
      defaultTextColor: 'rgba(0,0,0,0)',
      correctTextColor: 'rgba(0,0,0,1)',
      incorrectTextColor: 'rgba(255,0,0,1)',
      defaultBorderColor: 'rgba(0,0,0,1)',
      correctBorderColor: 'rgba(0,0,0,0)',
      incorrectBorderColor: 'rgba(0,0,0,1)'
    }, options );
    assert && assert( !options.children, 'additional children not supported' );

    // @public (read-only)
    this.qna = qna;

    // @protected - all
    this.keypad = keypad;
    this.defaultTextColor = options.defaultTextColor;
    this.correctTextColor = options.correctTextColor;
    this.incorrectTextColor = options.incorrectTextColor;
    this.defaultBorderColor = options.defaultBorderColor;
    this.correctBorderColor = options.correctBorderColor;
    this.incorrectBorderColor = options.incorrectBorderColor;

    // @protected - the challenge question
    this.challengeText = new Text( this.qna.questionString, {
      left: 0,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );

    // @protected - current value display
    var pattern = options.preValueString + '{0}' + options.postValueString;
    this.editNumberDisplay = new EditNumberDisplayNode( keypad, qna.valueProperty, pattern, {
      centerX: this.challengeText.centerX - HORIZONTAL_SPACING,
      top: this.challengeText.bottom + VERTICAL_SPACING,
      buttonSpacing: HORIZONTAL_SPACING,
      font: new PhetFont( 14 ),
      decimalPlaces: options.decimalPlaces,
      textMaxWidth: 75,
      textColor: this.defaultTextColor
    } );

    // @protected - alternate label to display when correct
    this.correctTextDisplay = new Text( this.qna.answerText, {
      centerX: this.challengeText.centerX,
      top: this.challengeText.bottom + 2 * VERTICAL_SPACING,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      fill: this.correctTextColor,
      visible: false
    } );

    // @protected - smile or frown image corresponding to correct/incorrect answers
    this.faceNode = new FaceNode( 18, {
      left: this.editNumberDisplay.right + HORIZONTAL_SPACING,
      centerY: this.editNumberDisplay.centerY,
      headLineWidth: 1,
      visible: false
    } );

    // @protected - unit divider line
    this.unitLine = new Path( new Shape()
      .moveTo( this.challengeText.centerX - DIVISOR_WIDTH / 2, this.editNumberDisplay.bottom + VERTICAL_SPACING )
      .lineTo( this.challengeText.centerX + DIVISOR_WIDTH / 2, this.editNumberDisplay.bottom + VERTICAL_SPACING ), {
      stroke: 'black',
      lineWidth: 1.25,
      visible: options.showUnitText
    } );

    // @protected - unit label
    this.unitText = new Text( this.qna.unitString, {
      centerX: this.challengeText.centerX,
      top: this.unitLine.bottom + 2,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      visible: options.showUnitText
    } );

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    // check the answer on user value input
    this.checkAnswerBound = this.checkAnswer.bind( this );
    this.qna.valueProperty.link( this.checkAnswerBound );

    options.children = [ this.challengeText, this.editNumberDisplay, this.correctTextDisplay, this.faceNode,
      this.unitLine, this.unitText ];

    Node.call( this, options );
  }

  unitRates.register( 'ChallengeQuestionAnswerNode', ChallengeQuestionAnswerNode );

  return inherit( Node, ChallengeQuestionAnswerNode, {

    /**
     * Changes various color/visibility attributes based on the users answer
     *
     * @protected
     */
    checkAnswer: function() {

      if ( !this.qna.isAnswerValid() ) {         // invalid = aka. a default state, before the user has input any answers
        this.faceNode.visible = false;
        this.editNumberDisplay.setTextColor( DEFAULT_TEXT_COLOR );
        this.editNumberDisplay.setBorderColor( DEFAULT_BORDER_COLOR );
      }
      else if ( this.qna.isAnswerCorrect() ) {   // correct answers
        this.faceNode.smile();
        this.faceNode.visible = true;
        this.unitLine.visible = true;
        this.unitText.visible = true;
        this.faceNode.visible = true;
        this.editNumberDisplay.setVisible( false );
        this.editNumberDisplay.setTextColor( this.correctTextColor );
        this.editNumberDisplay.setBorderColor( this.correctBorderColor );
        //this.challengeText.setFill( this.correctTextColor );
        this.unitText.setFill( this.correctTextColor );
        this.unitLine.setStroke( this.correctTextColor );

        this.editNumberDisplay.setVisible( false );
        this.correctTextDisplay.visible = true;
      }
      else {                                     // incorrect answers
        this.faceNode.frown();
        this.faceNode.visible = true;
        this.editNumberDisplay.setTextColor( this.incorrectTextColor );
        if ( !this.editNumberDisplay.hasKeypadFocus ) {
          this.editNumberDisplay.setBorderColor( this.incorrectBorderColor );
        }
      }
    },

    // @public
    dispose: function() {
      this.editNumberDisplay.dispose();
      this.qna.valueProperty.unlink( this.checkAnswerBound );
    }

  } );  // define

} );  // inherit
