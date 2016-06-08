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
   * @param {KeypadPanel} keypad
   * @param {ChallengeQuestionAnswer} qna
   * @param {string} pattern
   * @param {Object} [options]
   * @constructor
   */
  function AnswerNumberDisplayNode( keypad, qna, pattern, options ) {

    options = _.extend( {
      preNumberString:      '',
      postPostString:       '',
      numberRange:          new Range(0, 15),
      font:                 new PhetFont( 10 ),
      decimalPlaces:        2,
      buttonPosition:       'left',
      buttonSpacing:        0,
      defaultTextColor:     'rgba(0,0,0,0)',
      correctTextColor:     'rgba(0,0,0,1)',
      incorrectTextColor:   'rgba(255,0,0,1)',
      defaultBorderColor:   'rgba(0,0,0,0)',
      correctBorderColor:   'rgba(0,0,0,0)',
      incorrectBorderColor: 'rgba(0,0,0,1)',
      focusBorderColor:     'rgba(230,132,5,1)'
    },  options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    this.keypad         = keypad;
    this.hasKeypadFocus = false;
    this.qna            = qna;

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
      xMargin: 2,
      yMargin: 2,
      decimalPlaces: options.decimalPlaces,
      maxWidth: TEXT_MAX_WIDTH,
      numberFill: this.correctTextColor,
      backgroundStroke: this.correctTextColor,
      backgroundFill: 'rgba(0,0,0,0)',
      pickable: false
    };
    this.numberDisplay = new NumberDisplay( this.qna.valueProperty, options.numberRange, '', pattern, numberDisplayOptions );

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

    // check answers on user input
    this.qna.valueProperty.link( function( value, oldValue ) {
      self.updateEditState();
    } );
  }

  unitRates.register( 'AnswerNumberDisplayNode', AnswerNumberDisplayNode );

  return inherit( Node, AnswerNumberDisplayNode, {

    /**
     * Makes the keypad visible and links up it's listeners
     * @protected
     */
    showKeypad: function() {

      var self = this;

      this.hasKeypadFocus = true;

      this.numberDisplay.setBackgroundStroke( this.focusBorderColor );

      // FIXME:
      this.keypad.setListeners( function() {
          // onSubmit
          self.qna.valueProperty.value = self.keypad.getValue();
          self.updateEditState();
        }, function() {
          // onListenerChanged
          self.hasKeypadFocus = false;
          self.updateEditState();
        }
      );

      this.keypad.visible = true;
      this.keypad.clear();
    },

    /**
     * Hides the keypad and unlinks
     * @protected
     */
    hideKeypad: function() {
      this.keypad.visible = false;
    },

    /**
     * Changes various color/draggable attributes based on whether the display has keyboard focus
     * and if edited values are correct or.
     * @protected
     */
    updateEditState: function() {

      // Check for correct answer
      if( this.qna.isAnswerCorrect() ) {
        // set correct display attributes
        this.editButton.visible = false;
        this.numberDisplay.setNumberFill( this.correctTextColor );
        this.numberDisplay.setBackgroundStroke( this.correctBorderColor );

        // dismiss the keypad
        this.hideKeypad();
      }
      else {
        // set 'incorrect' display attributes
        this.editButton.visible = true;
        this.numberDisplay.setNumberFill( this.qna.isAnswerZero() ? this.defaultTextColor : this.incorrectTextColor );
        this.numberDisplay.setBackgroundStroke( this.hasKeypadFocus ? this.focusBorderColor : this.incorrectBorderColor );
      }
    }

  } );  // define

} );  // inherit
