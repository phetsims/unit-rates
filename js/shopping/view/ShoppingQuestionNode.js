// Copyright 2016-2018, University of Colorado Boulder

/**
 * Displays a question and associated answer in the Shopping screen.
 * Values are entered via a keypad.
 * Layout is specified in https://github.com/phetsims/unit-rates/issues/152
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
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
      valueYMargin: 1, // {number} vertical margin inside the value box
      xSpacing: 25, // {number} horizontal spacing between UI elements
      ySpacing: 5,  // {number} vertical spacing between UI elements
      fractionYSpacing: 3 // {number} vertical space above and below fraction line
    }, options );

    Node.call( this );

    // local vars to improve readability
    var answer = question.answer;
    var answerOptions = question.answerOptions;

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

    // edit button, to the right of the box
    var editButton = new RectangularPushButton( {
      content: new FontAwesomeNode( 'pencil_square_o', { scale: URConstants.EDIT_ICON_SCALE } ),
      baseColor: URColors.editButton,
      left: valueBox.right + options.xSpacing,
      centerY: valueBox.centerY
    } );
    this.addChild( editButton );
    editButton.touchArea = editButton.localBounds.dilatedXY( 10, 10 );

    // strut to the left of the box, same width as editButton
    // See layout specification in https://github.com/phetsims/unit-rates/issues/152
    var strut = new HStrut( editButton.width, {
      right: valueBox.left - options.xSpacing,
      centerY: valueBox.centerY
    } );
    this.addChild( strut );

    // check mark to right of box, to indicate that the question has been correctly answered
    var checkMarkNode = new FontAwesomeNode( 'check', {
      scale: 0.75,
      fill: URColors.checkMark,
      left: valueBox.right + options.xSpacing,
      centerY: valueBox.centerY,
      visible: false
    } );
    this.addChild( checkMarkNode );

    // the question, centered above the box
    var questionTextNode = new Text( question.questionString, {
      font: options.questionFont,
      centerX: valueBox.centerX,
      bottom: valueBox.top - options.ySpacing,
      maxWidth: 180 // i18n, determined empirically
    } );
    this.addChild( questionTextNode );

    // the user's guess, as entered via the keypad, appears centered in the box
    var guessNode = new Text( '', {
      pickable: false, // so it doesn't interfere with clicking in valueBox to open keypad
      fill: options.neutralColor,
      font: options.valueFont,
      center: valueBox.center,
      maxWidth: 0.8 * valueBoxWidth
    } );
    this.addChild( guessNode );

    // numerator in the revealed answer, replaces the box when the answer is correct
    var numeratorNode = new Text( question.numeratorString, {
      fill: URColors.correctQuestion,
      font: options.valueFont,
      center: valueBox.center,
      visible: false,
      maxWidth: 100 // i18n, determined empirically
    } );
    this.addChild( numeratorNode );

    // fraction line in the revealed answer
    var fractionLineNode = new Line( 0, 0, 1.1 * valueBox.width, 0, {
      stroke: options.neutralColor,
      lineWidth: 1,
      centerX: valueBox.centerX,
      top: valueBox.bottom + options.fractionYSpacing,
      visible: options.denominatorVisible
    } );
    this.addChild( fractionLineNode );

    // denominator in the revealed answer
    var denominatorNode = new Text( question.denominatorString, {
      fill: options.neutralColor,
      font: options.valueFont,
      centerX: valueBox.centerX,
      top: fractionLineNode.bottom + options.fractionYSpacing,
      visible: options.denominatorVisible,
      maxWidth: 100 // i18n, determined empirically
    } );
    this.addChild( denominatorNode );

    this.mutate( options );

    // Update when the guess changes
    var guessObserver = function( guess ) {

      // compare guess to answer using the desired number of decimal places
      var correct = ( guess === answer );

      // update the guess
      if ( guess !== null ) {
        guessNode.text = URUtil.formatNumber( answerOptions.valueFormat, guess, answerOptions.maxDecimals, answerOptions.trimZeros );
        guessNode.fill = correct ? URColors.correctQuestion : URColors.incorrectQuestion;
      }
      else if ( phet.chipper.queryParameters.showAnswers ) {

        // show the answer, if query parameter is set
        guessNode.text = URUtil.formatNumber( answerOptions.valueFormat, answer, answerOptions.maxDecimals, answerOptions.trimZeros );
        guessNode.text = URUtil.formatNumber( answerOptions.valueFormat, answer, answerOptions.maxDecimals, answerOptions.trimZeros );
        guessNode.fill = URColors.showAnswers;
      }
      else {
        guessNode.text = '';
      }
      guessNode.visible = !correct;
      guessNode.center = valueBox.center; // center guess in box

      // update other UI elements
      editButton.visible = !correct;
      valueBox.visible = !correct;
      checkMarkNode.visible = correct;
      numeratorNode.visible = correct;
      fractionLineNode.stroke = denominatorNode.fill = ( correct ? URColors.correctQuestion : options.neutralColor );

      // The denominator is sometimes visibile at all times (e.g. for the 'Unit Rate?' question).
      // If it's not visible at all times, make it visible when the answer is revealed.
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
        maxDigits: answerOptions.maxDigits,
        maxDecimals: answerOptions.maxDecimals
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
      editButton.dispose(); // workaround for memory leak https://github.com/phetsims/unit-rates/issues/207
    };
  }

  unitRates.register( 'ShoppingQuestionNode', ShoppingQuestionNode );

  return inherit( Node, ShoppingQuestionNode, {

    // @public
    dispose: function() {
      this.disposeShoppingQuestionNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
