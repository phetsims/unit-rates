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
  var EditButton = require( 'UNIT_RATES/common/view/EditButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadPanel = require( 'UNIT_RATES/shoppingNEW/view/KeypadPanel' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ShadowText = require( 'SCENERY_PHET/ShadowText' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DEFAULT_QUESTION_FONT = new URFont( 14 );
  var DEFAULT_VALUE_FONT = new URFont( 14 );
  var ICON_FONT = new URFont( 36 );

  /**
   * @param {Question} question - model element for the question
   * @param {Node} questionsPanel - panel that contains the question, for positioning the keypad
   * @param {Node} keypadLayer - layer in which the (modal) keypad will be displayed
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionNode( question, questionsPanel, keypadLayer, options ) {

    options = _.extend( {
      valueBoxWidth: 70, // {number} width of the value field
      denominatorVisible: false, // {boolean} is the denominator visible before the answer is visible?
      correctColor: 'green', // {Color|string} color for the correct answer
      incorrectColor: 'red', // {Color|string} color for an incorrect guess
      neutralColor: 'black', // {Color|string} color for UI elements that are agnostic about whether the guess is correct
      editColor: 'yellow', // {Color|string} value box is filled with this color while editing
      questionFont: DEFAULT_QUESTION_FONT, // {Font} font for the question
      valueFont: DEFAULT_VALUE_FONT, // {Font} font for the value
      valueXMargin: 5, // {number} horizontal margin inside the value box
      valueYMargin: 3, // {number} vertical margin inside the value box
      xSpacing: 25, // {number} horizontal spacing between UI elements
      ySpacing: 5  // {number} vertical spacing between UI elements
    }, options );

    Node.call( this );

    var self = this;

    // local vars to improve readability
    var answer = question.answer;
    var guessFormat = question.guessFormat;
    var maxDecimals = question.maxDecimals;

    // box that is either empty or displays an incorrect value. clicking in the box opens the keypad.
    var valueBoxWidth = options.valueBoxWidth;
    var valueBoxHeight = new Text( '0', { font: options.valueFont } ).height + ( 2 * options.valueYMargin );
    var valueBox = new Rectangle( 0, 0, valueBoxWidth, valueBoxHeight, {
      stroke: 'black',
      fill: 'white',
      cursor: 'pointer'
    } );
    this.addChild( valueBox );

    // edit button opens the keypad
    var editButton = new EditButton();
    this.addChild( editButton );
    editButton.setScaleMagnitude( valueBox.height / editButton.height );
    editButton.right = valueBox.left - options.xSpacing;
    editButton.centerY = valueBox.centerY;

    // @private check mark to indicate correct answer
    var correctIconNode = new ShadowText( '\u2713', {
      // fill: 'rgb( 102, 183, 0 )',
      fill: options.correctColor,
      font: ICON_FONT,
      left: valueBox.right + options.xSpacing,
      centerY: valueBox.centerY,
      visible: false
    } );
    this.addChild( correctIconNode );

    // the question
    var questionTextNode = new Text( question.questionString, {
      font: options.questionFont,
      centerX: valueBox.centerX,
      bottom: valueBox.top - options.ySpacing,
      maxWidth: correctIconNode.right - editButton.left
    } );
    this.addChild( questionTextNode );

    // displays the user's guess
    var guessNode = new Text( '', {
      fill: options.neutralColor,
      font: options.valueFont,
      center: valueBox.center
    } );
    this.addChild( guessNode );

    // numerator
    var numeratorNode = new Text( question.numeratorString, {
      fill: options.correctColor,
      font: options.valueFont,
      center: valueBox.center,
      visible: false
    } );
    this.addChild( numeratorNode );

    // horizontal line in the fraction
    var fractionLineNode = new Line( 0, 0, 1.2 * valueBox.width, 0, {
      stroke: options.neutralColor,
      lineWidth: 1,
      centerX: valueBox.centerX,
      top: valueBox.bottom + 4,
      visible: options.denominatorVisible
    } );
    this.addChild( fractionLineNode );

    // denominator in the fraction
    var denominatorNode = new Text( question.denominatorString, {
      fill: options.neutralColor,
      font: options.valueFont,
      centerX: valueBox.centerX,
      top: fractionLineNode.bottom + ( fractionLineNode.top - guessNode.bottom ),
      visible: options.denominatorVisible
    } );
    this.addChild( denominatorNode );

    // keypad for entering numbers, added dynamically to keypadLayer
    var keypad = new KeypadPanel( {
      maxDigits: question.maxDigits,
      maxDecimals: question.maxDecimals,
      enterButtonListener: function() {
        commitEdit();
      }
    } );

    // Clicking outside the keypad cancels the edit
    var keypadLayerListener = new DownUpListener( {
      down: function( event ) {
        if ( event.trail.lastNode() === keypadLayer ) {
          cancelEdit();
        }
      }
    } );

    this.mutate( options );

    // Begins an edit
    var beginEdit = function() {
      URQueryParameters.log && console.log( 'beginEdit' );
      assert && assert( !keypadLayer.visible, 'invalid state for endEdit' );

      valueBox.fill = options.editColor; // highlight the value box to indicate an edit is in progress
      keypad.valueStringProperty.value = '';
      keypadLayer.addChild( keypad );
      keypadLayer.addInputListener( keypadLayerListener );
      keypadLayer.visible = true;

      // position the keypad relative to the Questions panel
      var questionsPanelBounds = keypad.globalToParentBounds( questionsPanel.localToGlobalBounds( questionsPanel.localBounds ) );
      keypad.right = questionsPanelBounds.minX - 10;
      keypad.bottom = questionsPanelBounds.maxY;
    };

    // Ends an edit
    var endEdit = function() {
      URQueryParameters.log && console.log( 'endEdit' );
      assert && assert( keypadLayer.visible, 'invalid state for endEdit' );
      keypadLayer.visible = false;
      keypadLayer.removeChild( keypad );
      keypadLayer.removeInputListener( keypadLayerListener );
      valueBox.fill = 'white';
    };

    // Ends and commits an edit
    var commitEdit = function() {
      URQueryParameters.log && console.log( 'commitEdit' );
      var valueString = keypad.valueStringProperty.value;
      if ( valueString ) {
        endEdit();
        question.guessProperty.value = ( 1 * keypad.valueStringProperty.value ); // string -> number conversion
      }
      else {
        cancelEdit();
      }
    };

    // Ends and cancels an edit
    var cancelEdit = function() {
      URQueryParameters.log && console.log( 'cancelEdit' );
      endEdit();
    };

    // Update when the guess changes
    var guessObserver = function( guess ) {

      // compare guess to answer using the desired number of decimal places
      var correct = ( guess === answer );

      // update the guess
      if ( guess ) {
        var guessDisplayed = ( question.restrictGuessDecimalPlaces ) ? Util.toFixed( guess, maxDecimals ) : guess;
        guessNode.text = StringUtils.format( guessFormat, guessDisplayed );
        guessNode.fill = correct ? options.correctColor : options.incorrectColor;
      }
      else if ( URQueryParameters.showAnswers ) {
        // show the answer, if query parameter is set
        guessNode.text = StringUtils.format( guessFormat, ( question.restrictGuessDecimalPlaces ) ? Util.toFixed( answer, maxDecimals ) : answer );
        guessNode.fill = options.neutralColor;
      }
      else {
        guessNode.text = '';
      }
      guessNode.visible = !correct;
      guessNode.center = valueBox.center;

      // update other UI elements
      editButton.visible = !correct;
      valueBox.visible = !correct;
      correctIconNode.visible = correct;
      numeratorNode.visible = correct;
      fractionLineNode.stroke = denominatorNode.fill = ( correct ? options.correctColor : options.neutralColor );
      if ( !options.denominatorVisible ) {
        fractionLineNode.visible = denominatorNode.visible = correct;
      }
    };
    question.guessProperty.link( guessObserver );

    // Clicking on editButton or valueBox opens the keypad
    editButton.addListener( beginEdit );
    valueBox.addInputListener( new DownUpListener( {
      down: beginEdit.bind( this )
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
