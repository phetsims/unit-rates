// Copyright 2016, University of Colorado Boulder

/**
 * A node that looks like a calculator (w/ decimal key) and allows the user to enter digits.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberKeypad = require( 'SCENERY_PHET/NumberKeypad' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  // strings
  var enterString = require( 'string!UNIT_RATES/enter' );

  // constants
  var READOUT_FONT = new PhetFont( 25 );    // Font used for the numeric display
  var SPACING = 10;                         // Spacing (horizontal & vertical) between all nodes
  var TEXT_MAX_WIDTH = 150;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function KeypadPanelNode( options ) {

    options = _.extend( {
      maxDigits: 4
    }, options );

    // @public
    this.visibleProperty = new Property( true );

    // @protected - all
    this.onSubmit = null;             // {function}() to call when the enter/check button is pressed
    this.onListenerChanged = null;    // {function}() to call when the keypad listener changes

    // @protected
    this.keypad = new NumberKeypad( {
      maxDigits: options.maxDigits,
      decimalPointKey: true
    } );

    // Add the number readout background.
    var testString = new Text( '0.', { font: READOUT_FONT } );
    _.times( options.maxDigits, function() {
      testString.text += '9';
    } );

    // @protected
    this.readoutBackground = new Rectangle( 0, 0, testString.width * 1.2, testString.height * 1.2, 4, 4, {
      fill: 'white',
      stroke: '#777777',
      lineWidth: 1.5,
      centerX: this.keypad.width / 2
    } );

    // @protected - add the readout text.
    this.readoutText = new Text( '', { font: READOUT_FONT } );

    // update the value on keypad user interaction
    this.onKeypadDigitStringChangeBound = this.onKeypadDigitStringChange.bind( this );
    this.keypad.digitStringProperty.link( this.onKeypadDigitStringChangeBound );

    // Layout
    this.keypad.top = this.readoutBackground.bottom + SPACING;

    // @protected
    this.enterButton = new TextPushButton( enterString, {
      font: new PhetFont( 18 ),
      baseColor: PhetColorScheme.PHET_YELLOW,
      maxWidth: TEXT_MAX_WIDTH,
      cornerRadius: 4
    } );

    this.enterButton.top = this.keypad.bottom + SPACING;
    this.enterButton.left = (this.keypad.bounds.width - this.enterButton.bounds.width) / 2;

    // Group all nodes
    var numberControlGroup = new Node( {
      children: [ this.keypad, this.readoutBackground, this.readoutText, this.enterButton ]
    } );

    Panel.call( this, numberControlGroup, {
      xMargin: SPACING,
      yMargin: SPACING,
      fill: 'rgb( 230, 230, 230 )',
      stroke: 'gray',
      lineWidth: 1,
      resize: false,
      backgroundPickable: true,
      visible: false
    } );

    // Pass options through to parent class.
    this.mutate( options );
  }

  unitRates.register( 'KeypadPanelNode', KeypadPanelNode );

  return inherit( Panel, KeypadPanelNode, {

    /**
     * Sets visible & public property to false
     *
     * @public
     */
    hide: function() {
      this.visible = false;
      this.visibleProperty.value = this.visible;
    },

    /**
     * Sets visible & public property to true
     *
     * @public
     */
    show: function() {
      this.visible = true;
      this.visibleProperty.value = this.visible;
    },

    /**
     * Callback for the keypad string change
     *
     * @param {string} digitString - called when the keypad listener changes
     * @public
     */
    onKeypadDigitStringChange: function( digitString ) {
      this.readoutText.text = digitString;
      this.readoutText.center = this.readoutBackground.center;
    },

    /**
     * Assigns a set of listeners to the keypad, there is only one listener assigned at any given time. That listener
     * is considered to have the focus from the keypad
     *
     * @param {function()} onSubmit - called when the enter/check button is pressed
     * @param {function()} onListenerChanged - called when the keypad listener changes
     * @public
     */
    setListeners: function( onSubmit, onListenerChanged ) {

      var self = this;

      this.clear();

      if ( this.onSubmit ) {
        this.enterButton.removeListener( this.onSubmit );
      }

      if ( this.onListenerChanged ) {
        this.onListenerChanged.call();
      }

      this.onSubmit = onSubmit;
      this.onListenerChanged = onListenerChanged;

      // when the enter button is pressed, call the submit callback and close/clear the keypad
      this.enterButton.addListener( function() {
        if ( self.onSubmit ) {
          self.onSubmit.call();
        }
        self.hide();
        self.clear();
        self.clearListeners();
      } );
    },

    /**
     * Removes the currently set listener
     *
     * @public
     */
    clearListeners: function() {

      // remove the listener
      if ( this.onSubmit ) {
        this.enterButton.removeListener( this.onSubmit );
      }

      // call the current listener before removing it.
      if ( this.onListenerChanged ) {
        this.onListenerChanged.call();
      }

      this.onSubmit = null;
      this.onListenerChanged = null;
    },

    /**
     * Sets the current keypad value
     *
     * @param {number} value - the value to set the keypad to
     * @public
     */
    setValue: function( value ) {
      this.keypad.digitStringProperty.value = value;
    },

    /**
     * Gets the current keypad value
     *
     * @returns {number}
     * @public
     */
    getValue: function() {
      return Number( this.keypad.digitStringProperty.value );
    },

    /**
     * Clear the keypad value
     *
     * @public
     */
    clear: function() {
      this.keypad.clear();
    },

    // @public
    dispose: function() {
      this.keypad.digitStringProperty.unlink( this.onKeypadDigitStringChangeBound );
    }

  } ); // inherit

} ); // define
