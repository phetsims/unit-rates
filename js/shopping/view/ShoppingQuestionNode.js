// Copyright 2016, University of Colorado Boulder

/**
 * Displays a question and associated answer in the Shopping screen.
 * Values are entered via a keypad.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ShadowText = require( 'SCENERY_PHET/ShadowText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // sim modules
  var FontAwesomeButton = require( 'UNIT_RATES/common/view/FontAwesomeButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

  /**
   * @param {ShoppingQuestion} question - model element for the question
   * @param {Node} questionsPanel - panel that contains the question, for positioning the keypad
   * @param {KeypadLayer} keypadLayer - layer that manages the keypad
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionNode( question, questionsPanel, keypadLayer, options ) {

    options = _.extend( {
      valueBoxWidth: 70, // {number} width of the value field, height determined by valueFont
      denominatorVisible: false, // {boolean} is the denominator visible before the answer is visible?
      neutralColor: 'black', // {Color|string} color for UI elements that are agnostic about whether the guess is correct
      questionFont: new URFont( 14 ), // {Font} font for the question
      valueFont: new URFont( 14 ), // {Font} font for the value
      checkMarkFont: new URFont( 36 ), // {Font} font for check mark
      valueYMargin: 3, // {number} vertical margin inside the value box
      xSpacing: 25, // {number} horizontal spacing between UI elements
      ySpacing: 5  // {number} vertical spacing between UI elements
    }, options );

    Node.call( this );

    // local vars to improve readability
    var answer = question.answer;
    var guessFormat = question.guessFormat;
    var maxDecimals = question.maxDecimals;

    // box that is either empty or displays an incorrect value
    var valueBoxWidth = options.valueBoxWidth;
    var valueBoxHeight = new Text( '0', { font: options.valueFont } ).height + ( 2 * options.valueYMargin );
    var valueBox = new Rectangle( 0, 0, valueBoxWidth, valueBoxHeight, {
      stroke: 'black',
      fill: 'white',
      cursor: 'pointer'
    } );
    this.addChild( valueBox );
    valueBox.touchArea = valueBox.localBounds.dilatedXY( 5, 5 );

    // edit button
    var editButton = new FontAwesomeButton( 'pencil_square_o', {
      iconScale: 0.5,
      baseColor: URColors.editButton,
      right: valueBox.left - options.xSpacing,
      centerY: valueBox.centerY
    } );
    this.addChild( editButton );
    editButton.touchArea = editButton.localBounds.dilatedXY( 10, 10 );

    // check mark to indicate that the question has been correctly answered
    var checkMarkNode = new ShadowText( '\u2713', {
      fill: URColors.checkMark,
      font: options.checkMarkFont,
      left: valueBox.right + options.xSpacing,
      centerY: valueBox.centerY,
      visible: false
    } );
    this.addChild( checkMarkNode );

    // the question
    var questionTextNode = new Text( question.questionString, {
      font: options.questionFont,
      centerX: valueBox.centerX,
      bottom: valueBox.top - options.ySpacing,
      maxWidth: checkMarkNode.right - editButton.left
    } );
    this.addChild( questionTextNode );

    // the user's guess, as entered via the keypad
    var guessNode = new Text( '', {
      fill: options.neutralColor,
      font: options.valueFont,
      center: valueBox.center
    } );
    this.addChild( guessNode );

    // numerator in the revealed answer
    var numeratorNode = new Text( question.numeratorString, {
      fill: URColors.correctQuestion,
      font: options.valueFont,
      center: valueBox.center,
      visible: false
    } );
    this.addChild( numeratorNode );

    // fraction line in the revealed answer
    var fractionLineNode = new Line( 0, 0, 1.2 * valueBox.width, 0, {
      stroke: options.neutralColor,
      lineWidth: 1,
      centerX: valueBox.centerX,
      top: valueBox.bottom + 4,
      visible: options.denominatorVisible
    } );
    this.addChild( fractionLineNode );

    // denominator in the revealed answer
    var denominatorNode = new Text( question.denominatorString, {
      fill: options.neutralColor,
      font: options.valueFont,
      centerX: valueBox.centerX,
      top: fractionLineNode.bottom + ( fractionLineNode.top - guessNode.bottom ),
      visible: options.denominatorVisible
    } );
    this.addChild( denominatorNode );

    this.mutate( options );

    // Update when the guess changes
    var guessObserver = function( guess ) {

      // compare guess to answer using the desired number of decimal places
      var correct = ( guess === answer );

      // update the guess
      if ( guess !== null ) {
        guessNode.text = URUtil.formatNumber( guessFormat, guess, maxDecimals, question.trimZeros );
        guessNode.fill = correct ? URColors.correctQuestion : URColors.incorrectQuestion;
      }
      else if ( URQueryParameters.showAnswers ) {
        // show the answer, if query parameter is set
        guessNode.text = URUtil.formatNumber( guessFormat, answer, maxDecimals, question.trimZeros );
        guessNode.text = URUtil.formatNumber( guessFormat, answer, maxDecimals, question.trimZeros );
        guessNode.fill = URColors.showAnswers;
      }
      else {
        guessNode.text = '';
      }
      guessNode.visible = !correct;
      guessNode.center = valueBox.center;

      // update other UI elements
      editButton.visible = !correct;
      valueBox.visible = !correct;
      checkMarkNode.visible = correct;
      numeratorNode.visible = correct;
      fractionLineNode.stroke = denominatorNode.fill = ( correct ? URColors.correctQuestion : options.neutralColor );
      if ( !options.denominatorVisible ) {
        fractionLineNode.visible = denominatorNode.visible = correct;
      }
    };
    question.guessProperty.link( guessObserver ); // unlink in dispose

    // highlight the value box to indicate that an edit is in progress
    var onBeginEdit = function() {
      valueBox.fill = URColors.edit;
    };

    // clear highlight to indicate that the edit is completed
    var onEndEdit = function() {
      valueBox.fill = 'white';
    };

    // position the keypad relative to the Questions panel
    var setKeypadLocation = function( keypad ) {
      var questionsPanelBounds = keypad.globalToParentBounds( questionsPanel.localToGlobalBounds( questionsPanel.localBounds ) );
      keypad.right = questionsPanelBounds.left - 10;
      keypad.bottom = questionsPanelBounds.bottom;
    };

    // opens a keypad to edit the user's guess
    var editValue = function() {
      keypadLayer.beginEdit( question.guessProperty, {
        onBeginEdit: onBeginEdit,
        onEndEdit: onEndEdit,
        setKeypadLocation: setKeypadLocation,
        maxDigits: question.maxDigits,
        maxDecimals: question.maxDecimals
      } );
    };

    // Click on editButton or in valueBox to begin editing
    editButton.addListener( editValue ); // no removeListener required
    valueBox.addInputListener( new DownUpListener( { // no removeInputListener required
      down: editValue
    } ) );

    // @private cleanup that's specific to this Node
    this.disposeShoppingQuestionNode = function() {
      question.guessProperty.unlink( guessObserver );
    };
  }

  unitRates.register( 'ShoppingQuestionNode', ShoppingQuestionNode );

  return inherit( Node, ShoppingQuestionNode, {

    // @public
    dispose: function() {
      this.disposeShoppingQuestionNode();
    }
  } );
} );
