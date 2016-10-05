// Copyright 2016, University of Colorado Boulder

/**
 * A phet-scenery/NumberDisplay w/ an edit button and external/shared keypad integration
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {KeypadPanelNode} keypad - shared keypad
   * @param {Property.<Number>} valueProperty - used to receive input from the keypad
   * @param {string} pattern - the text pattern to display in the NumberDisplay
   * @param {Object} [options]
   * @constructor
   */
  function EditNumberDisplayNode( keypad, valueProperty, pattern, options ) {

    options = _.extend( {
      numberRange: new RangeWithValue( 0, 200 ),   // valid range for the number display
      font: new PhetFont( 10 ),             // font used for the number display
      decimalPlaces: 2,                              // # decimal places for the number display
      buttonPosition: 'left',                         // edit button position (left|right|top|bottom|)
      buttonSpacing: 0,                              // space between the edit button & number display
      textMaxWidth: 30,
      textColor: 'rgba(0,0,0,1)',
      borderColor: 'rgba(0,0,0,1)',
      backgroundColor: 'rgba(0,0,0,0)',
      focusBorderColor: 'rgba(230,132,5,1)'             // border color when the edit button has been pressed
    }, options );
    assert && assert( !options.children, 'additional children not supported' );

    // @protected - all
    this.keypad = keypad;
    this.keypadFocus = false;                    // state used to indicate the shared keypad focus on this node
    this.valueProperty = valueProperty;

    // @protected - all colors
    this.textColor = options.textColor;
    this.borderColor = options.borderColor;
    this.backgroundColor = options.backgroundColor;
    this.focusBorderColor = options.focusBorderColor;

    // NumberDisplay options
    var numberDisplayOptions = {
      valuePattern: pattern,
      font: options.font,
      xMargin: 2,
      yMargin: 2,
      decimalPlaces: options.decimalPlaces,
      numberFill: this.textColor,
      numberMaxWidth: options.textMaxWidth,
      backgroundStroke: this.borderColor,
      backgroundFill: this.backgroundColor,
      pickable: false
    };

    // @protected
    this.numberDisplay = new NumberDisplay( valueProperty, options.numberRange, numberDisplayOptions );

    var editButtonOptions = {
      content: new FontAwesomeNode( 'pencil_square_o', { scale: 0.32 } ),
      baseColor: 'yellow',
      pickable: true
    };

    // positioning the edit button
    if ( options.buttonPosition === 'left' ) {
      editButtonOptions = _.extend( {
        right: this.numberDisplay.left - options.buttonSpacing,
        centerY: this.numberDisplay.centerY
      }, editButtonOptions );
    }
    else if ( options.buttonPosition === 'right' ) {
      editButtonOptions = _.extend( {
        left: this.numberDisplay.right + options.buttonSpacing,
        centerY: this.numberDisplay.centerY
      }, editButtonOptions );
    }
    else if ( options.buttonPosition === 'top' ) {
      editButtonOptions = _.extend( {
        centerX: this.numberDisplay.centerX,
        bottom: this.numberDisplay.top - options.buttonSpacing
      }, editButtonOptions );
    }
    else if ( options.buttonPosition === 'bottom' ) {
      editButtonOptions = _.extend( {
        centerX: this.numberDisplay.centerX,
        top: this.numberDisplay.bottom + options.buttonSpacing
      }, editButtonOptions );
    }
    else {
      assert && assert( false, 'invalid buttonPosition for EditNumberDisplayNode' );
    }

    // @protected - all
    this.editButton = new RectangularPushButton( editButtonOptions );
    this.editButtonListener = this.showKeypad.bind( this );
    this.editButton.addListener( this.editButtonListener );

    options.children = [ this.editButton, this.numberDisplay ];

    Node.call( this, options );
  }

  unitRates.register( 'EditNumberDisplayNode', EditNumberDisplayNode );

  return inherit( Node, EditNumberDisplayNode, {

    /**
     * Sets the visibility for the number display
     *
     * @param {boolean} visible
     * @public
     */
    setVisible: function( visible ) {
      this.numberDisplay.visible = visible;
      this.editButton.visible = visible;
    },

    /**
     * Sets the font for the number display
     *
     * @param {Font} font
     * @public
     */
    setFont: function( font ) {
      this.numberDisplay.setNumberFont( font );
    },

    /**
     * Sets the current text color
     *
     * @param {Color|String} color
     * @public
     */
    setTextColor: function( color ) {
      this.textColor = color;
      this.numberDisplay.setNumberFill( this.textColor );
    },

    /**
     * Sets the current border color
     *
     * @param {Color|String} color
     * @public
     */
    setBorderColor: function( color ) {
      this.borderColor = color;
      this.numberDisplay.setBackgroundStroke( this.borderColor );
    },

    /**
     * Sets the current background color
     *
     * @param {Color|String} color
     * @public
     */
    setBackgroundColor: function( color ) {
      this.backgroundColor = color;
      this.numberDisplay.setBackgroundFill( this.backgroundColor );
    },

    /**
     * Sets the visibility for the edit button
     *
     * @param {boolean} visible
     * @public
     */
    setEditButtonVisible: function( visible ) {
      this.editButton.visible = visible;
    },

    /**
     * Makes the keypad visible, links up it's listeners & changes the NumberDisplay border color
     *
     * @public
     */
    showKeypad: function() {
      var self = this;

      if ( this.keypadFocus ) {
        return;
      }

      this.keypadFocus = true;

      this.numberDisplay.setBackgroundStroke( this.focusBorderColor );

      // Set keypad listeners to this instance of the EditNumberDisplayNode
      this.keypad.setListeners( function() {
          // onSubmit - let this instance know when the keypad value changes
          self.valueProperty.value = self.keypad.getValue();
          self.keypad.clear();
        }, function() {
          // onListenerChanged - let this instance know when it's focus goes away
          self.keypadFocus = false;
          self.numberDisplay.setBackgroundStroke( self.borderColor );
        }
      );

      this.keypad.show();
      this.keypad.clear();
    },

    /**
     * Hides the keypad
     *
     * @public
     */
    hideKeypad: function() {
      this.keypad.hide();
    },

    /**
     * Returns the current keypad focus state
     *
     * @returns {boolean}
     * @public
     */
    hasKeypadFocus: function() {
      return this.keypadFocus;
    },

    // @public
    dispose: function() {
      this.keypad.clearListeners();
      this.editButton.removeListener( this.editButtonListener );
      !assert && this.editButton.dispose();  // SUN buttons dispose fails when assertions are enabled - see sun/#212
      this.numberDisplay.dispose();
    }

  } );  // define

} );  // inherit
