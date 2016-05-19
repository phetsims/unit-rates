// Copyright 2002-2016, University of Colorado Boulder

/**
 * A phet-scenery/NumberDisplay w/ an edit button and external keypad integration
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Range = require( 'DOT/Range' );

  // constants
  var TEXT_MAX_WIDTH            = 125;
  var TEMP_EDIT_BUTTON_CONTENT  = new Text( 'E', { font: new PhetFont( 10 ), fontWeight: 'bold', maxWidth: 30 } );

  /**
   *
   * @param {NumberKeypad} keypad
   * @param {Object} [options]
   * @constructor
   */
  function AnswerNumberDisplayNode( keypad, valueProperty, correctValue, pattern, options ) {

    options = _.extend( {
      preNumberString:      '',
      postPostString:       '',
      numberRange:          new Range(0, 15),
      font:                 new PhetFont( 12 ),
      decimalPlaces:        2,
      buttonPosition:       'left',
      buttonSpacing:        0,
      defaultTextColor:     'rgba(0,0,0,0)',
      correctTextColor:     'rgba(0,0,0,1)',
      incorrectTextColor:   'rgba(255,0,0,1)',
      defaultBorderColor:   'rgba(0,0,0,0)',
      correctBorderColor:   'rgba(0,0,0,0)',
      incorrectBorderColor: 'rgba(0,0,0,1)',
      focusBorderColor:     'rgba(0,0,0,1)'
    },  options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    this.keypad         = keypad;
    this.valueProperty  = valueProperty;
    this.correctValue   = correctValue;

    // colors
    this.defaultTextColor     = options.defaultTextColor;
    this.correctTextColor     = options.correctTextColor;
    this.incorrectTextColor   = options.incorrectTextColor;
    this.defaultBorderColor   = options.defaultBorderColor;
    this.focusBorderColor     = options.focusBorderColor;
    this.correctBorderColor   = options.correctBorderColor;
    this.incorrectBorderColor = options.incorrectBorderColor;

    //  NumberDisplay options
    var numberDisplayOptions = {
      font: options.font,
      xMargin: 5,
      yMargin: 2,
      decimalPlaces: options.decimalPlaces,
      maxWidth: TEXT_MAX_WIDTH,
      numberFill: this.correctTextColor,
      backgroundStroke: this.correctTextColor,
      pickable: false
    };
    this.numberDisplay = new NumberDisplay( this.valueProperty, options.numberRange, '', pattern, numberDisplayOptions );

    var editButtonOptions = {
      content:TEMP_EDIT_BUTTON_CONTENT,
      baseColor: URConstants.EDIT_CONTROL_COLOR,
      pickable: true,
      listener: function() {
        self.showKeypad();
    } };

    if( options.buttonPosition === 'left') {
      editButtonOptions = _.extend( {
        right: this.numberDisplay.left - options.buttonSpacing,
        centerY: this.numberDisplay.centerY
      }, editButtonOptions );
    }
    else if( options.buttonPosition === 'right') {
      editButtonOptions = _.extend( {
        left: this.numberDisplay.right + options.buttonSpacing,
        centerY: this.numberDisplay.centerY
      }, editButtonOptions );
    }
    else if( options.buttonPosition === 'top') {
      editButtonOptions = _.extend( {
        centerX: this.numberDisplay.centerX,
        bottom: this.numberDisplay.top - options.buttonSpacing
      }, editButtonOptions );
    }
    else if( options.buttonPosition === 'bottom') {
      editButtonOptions = _.extend( {
        centerX: this.numberDisplay.centerX,
        top: this.numberDisplay.bottom + options.buttonSpacing
      }, editButtonOptions );
    }
    else {
      assert && assert( true, 'invalid buttonPosition for AnswerNumberDisplayNode' );
    }

    this.editButton = new RectangularPushButton( editButtonOptions );
    options.children = [ this.editButton, this.numberDisplay ];

    Node.call( this, options );

    this.updateEditState();
  }

  unitRates.register( 'AnswerNumberDisplayNode', AnswerNumberDisplayNode );

  return inherit( Node, AnswerNumberDisplayNode, {

    /**
     * Makes the keypad visible and links up it's built-in property to the update function
     * @protected
     */
    showKeypad: function() {
      var self = this;

      this.keypad.digitStringProperty.unlinkAll();
      this.keypad.visible = true;
      this.keypad.clear();
      this.keypad.digitStringProperty.link( function( value, oldValue ) {
        // check for bogus keypad values
        if( isNaN( value ) || !isFinite( value ) ) {
            value = 0;
        }
        self.valueProperty.value = Number( value );
        self.updateEditState();
      } );
    },

    /**
     * Hides the keypad and unlinks
     * @protected
     */
    hideKeypad: function() {
      this.keypad.visible = false;
      this.keypad.digitStringProperty.unlinkAll();
      this.keypad.digitStringProperty.value = 0;
    },

    /**
     * Changes various color/draggable attributes based on whether the edited values are correct.
     * @protected
     */
    updateEditState: function() {

      // get the current keypad value
      var userValue = Number( this.valueProperty.value );

      // Check for correct answer
      if( userValue === this.correctValue ) {
        // set normal display attributes
        this.editButton.visible = false;
        this.numberDisplay.setNumberFill( this.correctTextColor );
        this.numberDisplay.setBackgroundStroke( this.correctBorderColor );

        // dismiss the keypad
        this.hideKeypad();
      }
      else {
        // set 'incorrect' display attributes
        this.editButton.visible = true;
        this.numberDisplay.setNumberFill( userValue === 0 ? this.defaultTextColor : this.incorrectTextColor );
        this.numberDisplay.setBackgroundStroke( this.incorrectBorderColor );
      }
    }


  } );  // define

} );  // inherit
