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
   * @param {Property} valueProperty
   * @param {string} pattern
   * @param {Object} [options]
   * @constructor
   */
  function EditNumberDisplayNode( keypad, valueProperty, pattern, options ) {

    options = _.extend( {
      preNumberString:      '',
      postPostString:       '',
      numberRange:          new Range(0, 15),
      font:                 new PhetFont( 10 ),
      decimalPlaces:        2,
      buttonPosition:       'left',
      buttonSpacing:        0,
      textColor:            'rgba(0,0,0,1)',
      borderColor:          'rgba(0,0,0,1)',
      backgroundColor:      'rgba(255,255,255,1)',
      focusBorderColor:     'rgba(230,132,5,1)'
    },  options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    this.keypad         = keypad;
    this.hasKeypadFocus = false;
    this.valueProperty  = valueProperty;

    // colors
    this.textColor        = options.textColor;
    this.borderColor      = options.borderColor;
    this.backgroundColor  = options.backgroundColor;
    this.focusBorderColor = options.focusBorderColor;

    //  NumberDisplay options
    var numberDisplayOptions = {
      font: options.font,
      xMargin: 2,
      yMargin: 2,
      decimalPlaces: options.decimalPlaces,
      maxWidth: TEXT_MAX_WIDTH,
      numberFill: this.textColor,
      backgroundStroke: this.borderColor,
      backgroundFill: this.backgroundColor,
      pickable: false
    };
    this.numberDisplay = new NumberDisplay( valueProperty, options.numberRange, '', pattern, numberDisplayOptions );

    var editButtonOptions = {
      content:TEMP_EDIT_BUTTON_CONTENT,
      baseColor: URConstants.EDIT_CONTROL_COLOR,
      pickable: true,
      listener: function() {
        self.showKeypad();
    } };

    if( options.buttonPosition === 'left' ) {
      editButtonOptions = _.extend( {
        right: this.numberDisplay.left - options.buttonSpacing,
        centerY: this.numberDisplay.centerY
      }, editButtonOptions );
    }
    else if( options.buttonPosition === 'right' ) {
      editButtonOptions = _.extend( {
        left: this.numberDisplay.right + options.buttonSpacing,
        centerY: this.numberDisplay.centerY
      }, editButtonOptions );
    }
    else if( options.buttonPosition === 'top' ) {
      editButtonOptions = _.extend( {
        centerX: this.numberDisplay.centerX,
        bottom: this.numberDisplay.top - options.buttonSpacing
      }, editButtonOptions );
    }
    else if( options.buttonPosition === 'bottom' ) {
      editButtonOptions = _.extend( {
        centerX: this.numberDisplay.centerX,
        top: this.numberDisplay.bottom + options.buttonSpacing
      }, editButtonOptions );
    }
    else {
      assert && assert( true, 'invalid buttonPosition for EditNumberDisplayNode' );
    }

    this.editButton = new RectangularPushButton( editButtonOptions );
    options.children = [ this.editButton, this.numberDisplay ];

    Node.call( this, options );
  }

  unitRates.register( 'EditNumberDisplayNode', EditNumberDisplayNode );

  return inherit( Node, EditNumberDisplayNode, {

    /**
     *
     * @public
     */
    setFont: function( font ) {
      this.numberDisplay.setNumberFont( font );
    },

    /**
     *
     * @public
     */
    setTextColor: function( color ) {
      this.textColor = color;
      this.numberDisplay.setNumberFill( this.textColor );
    },

    /**
     *
     * @public
     */
    setBorderColor: function( color ) {
      this.borderColor = color;
      this.numberDisplay.setBackgroundStroke( this.borderColor );
    },

     /**
     *
     * @public
     */
    setBackgroundColor: function( color ) {
      this.backgroundColor = color;
      this.numberDisplay.setBackgroundFill( this.backgroundColor );
    },

    /**
     * Makes the keypad visible and links up it's listeners
     * @public
     */
    showEditButton: function() {
      this.editButton.visible = true;
    },

    /**
     * Makes the keypad visible and links up it's listeners
     * @public
     */
    hideEditButton: function() {
      this.editButton.visible = false;
    },

    /**
     * Makes the keypad visible and links up it's listeners
     * @public
     */
    showKeypad: function() {

      var self = this;

      this.hasKeypadFocus = true;

      this.numberDisplay.setBackgroundStroke( this.focusBorderColor );

      // FIXME:
      this.keypad.setListeners( function() {
          // onSubmit
          self.valueProperty.value = self.keypad.getValue();
          self.keypad.clear();
        }, function() {
          // onListenerChanged
          self.hasKeypadFocus = false;
          self.numberDisplay.setBackgroundStroke( self.borderColor );
        }
      );

      this.keypad.visible = true;
      this.keypad.clear();
    },

    /**
     * Hides the keypad and unlinks
     * @public
     */
    hideKeypad: function() {
      this.keypad.visible = false;
    },

    /**
     *
     * @public
     */
    hasKeypadFocus: function() {
      return this.hasKeypadFocus;
    }

  } );  // define

} );  // inherit
