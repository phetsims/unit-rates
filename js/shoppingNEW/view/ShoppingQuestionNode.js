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

  // constants
  var DEFAULT_QUESTION_FONT = new URFont( 14 );
  var DEFAULT_VALUE_FONT = new URFont( 14 );
  var ICON_FONT = new URFont( 36 );

  /**
   * @param {Question} question
   * @param {Node} keypadLayer
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionNode( question, keypadLayer, options ) {

    options = _.extend( {

      //TODO maxValue should be computed from Question model
      maxValue: 99.99, // {number} for computing value width
      minValueBoxWidth: 60, // {number} minimum width of the value field
      denominatorVisible: false, // is the denominator visible before the answer is visible?
      correctColor: 'green',
      incorrectColor: 'red',
      neutralColor: 'black',
      editColor: 'yellow',
      questionFont: DEFAULT_QUESTION_FONT,
      valueFont: DEFAULT_VALUE_FONT,
      valueXMargin: 5,
      valueYMargin: 3,
      xSpacing: 30,
      ySpacing: 5
    }, options );

    Node.call( this );

    // local vars to improve readability
    var answer = question.answer;
    var guessFormat = question.guessFormat;
    var decimalPlaces = question.decimalPlaces;

    var maxValueString = StringUtils.format( guessFormat, Util.toFixed( options.maxValue, decimalPlaces ) );
    var maxValueNode = new Text( maxValueString, { font: options.valueFont } );

    // box that is either empty or displays an incorrect value. clicking in the box opens the keypad.
    var valueBoxWidth = Math.max( options.minValueBoxWidth, maxValueNode.width + 2 * options.valueXMargin );
    var valueBoxHeight = maxValueNode.height + 2 * options.valueYMargin;
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

    // show the answer, if query parameter is set
    if ( URQueryParameters.showAnswers ) {
      guessNode.text = StringUtils.format( guessFormat, Util.toFixed( answer, decimalPlaces ) );
      guessNode.center = valueBox.center;
      guessNode.fill = options.correctColor;
    }

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
      enterButtonListener: function() { commitEdit(); },

      //TODO add an option for position the keypad relative to the questions
      centerX: 500,
      centerY: 400
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

    //TODO move functions below here to prototype
    // Begins an edit
    var beginEdit = function() {
      URQueryParameters.log && console.log( 'beginEdit' );
      assert && assert( !keypadLayer.visible, 'invalid state for endEdit' );
      valueBox.fill = options.editColor; // highlight the value box to indicate an edit is in progress
      keypad.valueStringProperty.value = '';
      keypadLayer.addChild( keypad );
      keypadLayer.addInputListener( keypadLayerListener );
      keypadLayer.visible = true;
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
        var valueNumber = ( 1 * keypad.valueStringProperty.value ); // string -> number conversion
        setValue( valueNumber );
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

    /**
     * Updates the state of this node based on what the user entered on the keypad
     *
     * @param {number} value
     */
    var setValue = function( value ) {

      assert && assert( typeof value === 'number', 'value must be a number: ' + value );

      // compare guess to answer using the desired number of decimal places
      var correct = ( Util.toFixedNumber( value, decimalPlaces ) === Util.toFixedNumber( answer, decimalPlaces ) );

      editButton.visible = !correct;

      valueBox.visible = !correct;

      guessNode.visible = !correct;
      guessNode.text = StringUtils.format( guessFormat, Util.toFixed( value, decimalPlaces ) );
      guessNode.center = valueBox.center;
      guessNode.fill = correct ? options.correctColor : options.incorrectColor;

      numeratorNode.visible = correct;
      fractionLineNode.stroke = denominatorNode.fill = ( correct ? options.correctColor : options.neutralColor );
      if ( !options.denominatorVisible ) {
        fractionLineNode.visible = denominatorNode.visible = correct;
      }

      correctIconNode.visible = correct;
    };

    // Clicking on editButton or valueBox opens the keypad
    editButton.addListener( beginEdit );
    valueBox.addInputListener( new DownUpListener( {
      down: beginEdit.bind( this )
    } ) );
  }

  unitRates.register( 'ShoppingQuestionNode', ShoppingQuestionNode );

  return inherit( Node, ShoppingQuestionNode );
} );
