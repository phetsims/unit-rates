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
  var EditNumberDisplayNode = require( 'UNIT_RATES/common/view/EditNumberDisplayNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var VERICAL_SPACING       = 4;
  var HORIZONTAL_SPACING    = 30;
  var TEXT_FONT             = new PhetFont( 12 );
  var TEXT_MAX_WIDTH        = 125;
  var DIVISOR_WIDTH         = 75;
  var DEFAULT_TEXT_COLOR    = 'rgba(0,0,0,0)';
  var DEFAULT_BORDER_COLOR  = 'rgba(0,0,0,1)';

  /**
   *
   * @param {ChallengeQuestionAnswer} qna
   * @param {NumberKeypad} keypad
   * @param {Object} [options]
   * @constructor
   */
  function ChallengeQuestionAnswerNode( qna, keypad, options ) {

    options = _.extend( {
      showUnitText:         false,
      preValueString:       '',
      postValueString:      '',
      decimalPlaces:        2,
      defaultTextColor:     'rgba(0,0,0,0)',
      correctTextColor:     'rgba(0,0,0,1)',
      incorrectTextColor:   'rgba(255,0,0,1)',
      defaultBorderColor:   'rgba(0,0,0,1)',
      correctBorderColor:   'rgba(0,0,0,0)',
      incorrectBorderColor: 'rgba(0,0,0,1)'
    },  options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    this.qna = qna;
    this.keypad = keypad;
    this.defaultTextColor     = options.defaultTextColor;
    this.correctTextColor     = options.correctTextColor;
    this.incorrectTextColor   = options.incorrectTextColor;
    this.defaultBorderColor   = options.defaultBorderColor;
    this.correctBorderColor   = options.correctBorderColor;
    this.incorrectBorderColor = options.incorrectBorderColor;

    this.challengeText = new Text( this.qna.questionString, {
      left: 0,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );

    var pattern = options.preValueString + '{0}' + options.postValueString;
    this.editNumberDisplay = new EditNumberDisplayNode( keypad, qna.valueProperty, pattern, {
        centerX: this.challengeText.centerX - HORIZONTAL_SPACING,
        top: this.challengeText.bottom + VERICAL_SPACING,
        buttonSpacing: HORIZONTAL_SPACING,
        font: new PhetFont( 14 ),
        decimalPlaces: options.decimalPlaces,
        textColor: this.defaultTextColor
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
      self.checkAnswer();
    } );

    options.children = [ this.challengeText, this.editNumberDisplay, this.faceNode, this.unitLine, this.unitText ];

    Node.call( this, options );
  }

  unitRates.register( 'ChallengeQuestionAnswerNode', ChallengeQuestionAnswerNode );

  return inherit( Node, ChallengeQuestionAnswerNode, {

    /**
     * Changes various color/visibility attributes based on the users answer
     * @protected
     */
    checkAnswer: function() {
      if( this.qna.isAnswerCorrect() ) {
        this.faceNode.smile();
        this.faceNode.visible = true;
        this.unitLine.visible = true;
        this.unitText.visible = true;
        this.faceNode.visible = true;
        this.editNumberDisplay.hideEditButton();
        this.editNumberDisplay.setTextColor( this.correctTextColor );
        this.editNumberDisplay.setBorderColor( this.correctBorderColor );
        this.challengeText.setFill( this.correctTextColor );
        this.unitText.setFill( this.correctTextColor );
        this.unitLine.setStroke( this.correctTextColor );

        // reset the keypad
        this.keypad.visible = false;
        this.keypad.clear();
      }
      else if( !this.qna.isAnswerZero() ) {
        this.faceNode.frown();
        this.faceNode.visible = true;
        this.editNumberDisplay.setTextColor( this.incorrectTextColor );
        if( !this.editNumberDisplay.hasKeypadFocus ) {
          this.editNumberDisplay.setBorderColor( this.incorrectBorderColor );
        }
      }
      else {
        this.faceNode.visible = false;
        this.editNumberDisplay.setTextColor( DEFAULT_TEXT_COLOR );
        this.editNumberDisplay.setBorderColor( DEFAULT_BORDER_COLOR );
      }
    }

  } );  // define

} );  // inherit
