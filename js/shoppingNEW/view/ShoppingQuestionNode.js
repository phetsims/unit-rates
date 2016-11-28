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
  var Candy = require( 'UNIT_RATES/shoppingNEW/model/Candy' );
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var EditButton = require( 'UNIT_RATES/common/view/EditButton' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadPanel = require( 'UNIT_RATES/shoppingNEW/view/KeypadPanel' );
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
  var costOfNUnitsString = require( 'string!UNIT_RATES/costOfNUnits' );
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );
  var itemsForAmountString = require( 'string!UNIT_RATES/itemsForAmount' );
  var poundString = require( 'string!UNIT_RATES/pound' );
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var unitRateQuestionString = require( 'string!UNIT_RATES/unitRateQuestion' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  // constants
  var DEFAULT_QUESTION_FONT = new URFont( 14 );
  var DEFAULT_VALUE_FONT = new URFont( 14 );

  /**
   * @param {string} questionString
   * @param {number} answer
   * @param {string} numeratorString
   * @param {string} denominatorString
   * @param {Node} keypadLayer
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionNode( questionString, answer, numeratorString, denominatorString, keypadLayer, options ) {

    assert && assert( typeof answer === 'number', 'answer must be a number: ' + answer );

    options = _.extend( {
      maxValue: 99.99, // {number} for computing value width
      valueFormat: '{0}', // {string} must contain {0} placeholder for value
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
      ySpacing: 5,
      minValueBoxWidth: 60
    }, options );

    Node.call( this );

    var maxValueString = StringUtils.format( options.valueFormat, Util.toFixed( options.maxValue, options.valueDecimalPlaces ) );
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

    // displays the user's guess
    var guessNode = new Text( '', {
      fill: options.neutralColor,
      font: options.valueFont,
      center: valueBox.center
    } );
    this.addChild( guessNode );

    // show the answer, if query parameter is set
    if ( URQueryParameters.showAnswers ) {
      guessNode.text = StringUtils.format( options.valueFormat, Util.toFixed( answer, options.valueDecimalPlaces ) );
      guessNode.center = valueBox.center;
      guessNode.fill = options.correctColor;
    }

    // numerator
    var numeratorNode = new Text( numeratorString, {
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
    var denominatorNode = new Text( denominatorString, {
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
      valueBox.stroke = options.editColor; // highlight the value box to indicate an edit is in progress
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
      valueBox.stroke = options.neutralColor; // unhighlight the value box to indicate the edit is done
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
      var correct = ( Util.toFixedNumber( value, options.valueDecimalPlaces ) === Util.toFixedNumber( answer, options.valueDecimalPlaces ) );

      editButton.visible = !correct;

      valueBox.visible = !correct;
      valueBox.stroke = correct ? options.neutralColor : options.wrongColor;

      guessNode.visible = !correct;
      guessNode.text = StringUtils.format( options.valueFormat, Util.toFixed( value, options.valueDecimalPlaces ) );
      guessNode.center = valueBox.center;
      guessNode.fill = correct ? options.correctColor : options.wrongColor;

      numeratorNode.visible = correct;
      fractionLineNode.stroke = denominatorNode.fill = ( correct ? options.correctColor : options.neutralColor );
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
    editButton.addListener( beginEdit );
    valueBox.addInputListener( new DownUpListener( {
      down: beginEdit.bind( this )
    } ) );
  }

  unitRates.register( 'ShoppingQuestionNode', ShoppingQuestionNode );

  return inherit( Node, ShoppingQuestionNode, {}, {

    /**
     * Creates a question of the form 'Unit Rate?'
     * @param {ShoppingItem} shoppingItem
     * @param {Node} keypadLayer
     * @returns {ShoppingQuestionNode}
     */
    createUnitRateNode: function( shoppingItem, keypadLayer ) {

      // Candy unit rate is per pound, other types are per item
      var units = ( shoppingItem instanceof Candy ) ? poundString : shoppingItem.singularName;

      // args for ShoppingQuestionNode constructor
      var questionString = unitRateQuestionString;
      var answer = Util.toFixedNumber( shoppingItem.unitRate, 2 );
      var numeratorString = StringUtils.format( currencyValueString, Util.toFixed( shoppingItem.unitRate, 2 ) );
      var denominatorString = StringUtils.format( valueUnitsString, 1, units );

      return new ShoppingQuestionNode( questionString, answer, numeratorString, denominatorString, keypadLayer, {
        valueFormat: currencyValueString,
        denominatorVisible: true
      } );
    },

    /**
     * Creates a question node of the form 'Cost of 3 Apples?' or 'Cost of 2 pounds?'
     * @param {number} quantity
     * @param {ShoppingItem} shoppingItem
     * @param {Node} keypadLayer
     * @returns {ShoppingQuestionNode}
     * @public
     * @static
     */
    createCostOfNode: function( quantity, shoppingItem, keypadLayer ) {

      // Candy quantity is in pounds, other types are in number of items
      var units;
      if ( shoppingItem instanceof Candy ) {
        units = ( quantity > 1 ) ? poundsString : poundString;
      }
      else {
        units = ( quantity > 1 ) ? shoppingItem.pluralName : shoppingItem.singularName;
      }

      // args for ShoppingQuestionNode constructor
      var answer = Util.toFixedNumber( quantity * shoppingItem.unitRate, 2 );
      var questionString = StringUtils.format( costOfNUnitsString, quantity, units );
      var numeratorString = StringUtils.format( currencyValueString, Util.toFixed( answer, 2 ) );
      var denominatorString = StringUtils.format( valueUnitsString, quantity, units );

      return new ShoppingQuestionNode( questionString, answer, numeratorString, denominatorString, keypadLayer, {
        valueFormat: currencyValueString
      } );
    },

    /**
     * Creates a question node of the form 'Apples for $3.00?'
     * @param {number} quantity
     * @param {ShoppingItem} shoppingItem
     * @param {Node} keypadLayer
     * @returns {ShoppingQuestionNode}
     * @public
     * @static
     */
    createAmountOfNode: function( quantity, shoppingItem, keypadLayer ) {
      assert && assert( Util.isInteger( quantity ), 'quantity should be an integer: ' + quantity );

      var units = ( quantity > 1 ) ? shoppingItem.pluralName : shoppingItem.singularName;

      // args for ShoppingQuestionNode constructor
      var answer = quantity;
      var costString = StringUtils.format( currencyValueString, Util.toFixed( quantity * shoppingItem.unitRate, 2 ) );
      var questionString = StringUtils.format( itemsForAmountString, shoppingItem.pluralName, costString );
      var numeratorString = costString;
      var denominatorString = StringUtils.format( valueUnitsString, quantity, units );

      return new ShoppingQuestionNode( questionString, answer, numeratorString, denominatorString, keypadLayer );
    }

  } );
} );
