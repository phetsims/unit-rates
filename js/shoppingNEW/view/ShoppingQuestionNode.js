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
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );
  var Util = require( 'DOT/Util' );

  // strings
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );

  // constants
  var DEFAULT_QUESTION_FONT = new URFont( 14 );
  var DEFAULT_VALUE_FONT = new URFont( 14 );

  /**
   * @param {string} questionString
   * @param {number} answer
   * @param {string} denominatorString
   * @param {Node} keypadLayer
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionNode( questionString, answer, denominatorString, keypadLayer, options ) {

    options = _.extend( {
      maxValue: 99.99,
      valueFormat: currencyValueString, // {string} must contain {0} placeholder for value
      valueDecimalPlaces: 2, // number of decimal places in value
      denominatorVisible: false, // is the denominator visible before the answer is visible?
      correctColor: 'green',
      wrongColor: 'red',
      neutralColor: 'black',
      editColor: 'orange',
      questionFont: DEFAULT_QUESTION_FONT,
      valueFont: DEFAULT_VALUE_FONT,
      valueXMargin: 5,
      valueYMargin: 3,
      xSpacing: 35,
      ySpacing: 5
    }, options );

    Node.call( this );

    var maxValueString = StringUtils.format( options.valueFormat, Util.toFixed( options.maxValue, options.valueDecimalPlaces ) );
    var maxValueNode = new Text( maxValueString, { font: options.valueFont } );

    // box that is either empty or displays an incorrect value. clicking in the box opens the keypad.
    var valueBoxWidth = maxValueNode.width + 2 * options.valueXMargin;
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

    // face that smiles or frowns depending on whether the answer is correct or incorrect
    var faceNode = new FaceNode( valueBox.height, {
      left: valueBox.right + options.xSpacing,
      centerY: valueBox.centerY,
      visible: false
    } );
    this.addChild( faceNode );

    // the question
    var questionTextNode = new Text( questionString, {
      font: options.questionFont,
      centerX: valueBox.centerX,
      bottom: valueBox.top - options.ySpacing,
      maxWidth: faceNode.right - editButton.left
    } );
    this.addChild( questionTextNode );

    // displays the correct or wrong answer
    var answerNode = new Text( '', {
      fill: options.neutralColor,
      font: options.valueFont,
      center: valueBox.center
    } );
    this.addChild( answerNode );

    // show the answer, if query parameter is set
    if ( URQueryParameters.showAnswers ) {
      //TODO duplicated code here
      answerNode.text = StringUtils.format( options.valueFormat, Util.toFixed( answer, options.valueDecimalPlaces ) );
      answerNode.center = valueBox.center;
      answerNode.fill = options.correctColor;
    }

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
    var denominatorNode = new Text( denominatorString, {
      fill: options.neutralColor,
      font: options.valueFont,
      centerX: valueBox.centerX,
      top: fractionLineNode.bottom + ( fractionLineNode.top - answerNode.bottom ),
      visible: options.denominatorVisible
    } );
    this.addChild( denominatorNode );

    this.mutate( options );

    // Updates the state of this node based on what the user entered on the keypad
    var updateState = function() {

      var correct = phet.joist.random.nextBoolean(); //TODO read the value on the keypad, compare to answer

      editButton.visible = !correct;

      valueBox.visible = !correct;
      valueBox.stroke = correct ? options.neutralColor : options.wrongColor;

      answerNode.text = StringUtils.format( options.valueFormat, Util.toFixed( answer, options.valueDecimalPlaces ) );
      answerNode.center = valueBox.center;
      answerNode.fill = correct ? options.correctColor : options.wrongColor;

      fractionLineNode.stroke = denominatorNode.fill = correct ? options.correctColor : options.neutralColor;
      if ( !options.denominatorVisible ) {
        fractionLineNode.visible = denominatorNode.visible = correct;
      }

      faceNode.visible = true;
      if ( correct ) {
        faceNode.smile();
      }
      else {
        faceNode.frown();
      }
    };

    // Clicking on editButton or valueBox opens the keypad
    editButton.addListener( updateState );
    valueBox.addInputListener( new DownUpListener( {
      down: updateState.bind( this )
    } ) );
  }

  unitRates.register( 'ShoppingQuestionNode', ShoppingQuestionNode );

  return inherit( Node, ShoppingQuestionNode );
} );
