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
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var NumberKeypad = require( 'SCENERY_PHET/NumberKeypad' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var Panel = require( 'SUN/Panel' );

  // strings
  var enterString = require( 'string!UNIT_RATES/enter' );

  // constants
  var READOUT_FONT = new PhetFont( 25 );    // Font used for the numeric display
  var SPACING = 10;                         // Spacing between all nodes
  var TEXT_MAX_WIDTH  = 150;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function KeypadPanelNode( options ) {

    options = _.extend( {
      maxDigits: 4
    },  options || {} );


    var self = this;

    // @protected - all
    this.onSubmit = null;             // {function} to call when the enter/check button is pressed
    this.onListenerChanged = null;    // {funtcion} to call when the keypad listener changes

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
    var readoutBackground = new Rectangle( 0, 0, testString.width * 1.2, testString.height * 1.2, 4, 4, {
      fill: 'white',
      stroke: '#777777',
      lineWidth: 1.5,
      centerX: this.keypad.width / 2
    } );

    // Add the readout text.
    var readoutText = new Text( '', { font: READOUT_FONT } );
    this.value = '0'; // @private
    this.keypad.digitStringProperty.link( function( digitString ) {
      readoutText.text = digitString;
      readoutText.center = readoutBackground.center;
      self.value = digitString;
    } );

    // Layout
    this.keypad.top = readoutBackground.bottom + SPACING;

    // @protected
    this.checkButton = new TextPushButton( enterString, {
      font: new PhetFont( 18 ),
      baseColor: '#F2E916',
      maxWidth: TEXT_MAX_WIDTH,
      cornerRadius: 4
    });

    this.checkButton.top  = this.keypad.bottom + SPACING;
    this.checkButton.left = (this.keypad.bounds.width - this.checkButton.bounds.width) / 2;

    // Group all nodes
    var numberControlGroup = new Node( {
      children: [ this.keypad, readoutBackground, readoutText, this.checkButton ]
    } );

    Panel.call( this, numberControlGroup, {
      xMargin: SPACING,
      yMargin: SPACING,
      fill: 'rgba(0,0,0,0.05)',
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
     * Assigns a set of listeners to the keypad, there is only on listener assigned at any given time.
     * @param {function} onSubmit - called when the enter/check button is pressed
     * @param {function} onListenerChanged - called when the keypad listener changes
     * @public
     */
    setListeners: function( onSubmit, onListenerChanged ) {

      this.clear();

      if( this.onSubmit ) {
        this.checkButton.removeListener( this.onSubmit );
      }

      if( this.onListenerChanged ) {
        this.onListenerChanged.call();
      }

      this.onSubmit          = onSubmit;
      this.onListenerChanged = onListenerChanged;

      this.checkButton.addListener( onSubmit );
    },

    /**
     * Removes the currently set listener
     * @public
     */
    clearListeners: function() {

      if( this.onSubmit ) {
        this.checkButton.removeListener( this.onSubmit );
      }

      if( this.onListenerChanged ) {
        this.onListenerChanged.call();
      }

      this.onSubmit          = null;
      this.onListenerChanged = null;
    },

    /**
     * Sets the current keypad value
     * @param {Number} value - the value to set the keypad to
     * @public
     */
    setValue: function( value ) {
      this.keypad.digitStringProperty.set( value );
    },

    /**
     * Gets the current keypad value
     * @returns {Number}
     * @public
     */
    getValue: function() {
      return this.value;
    },

    /**
     * Clear the keypad value
     * @public
     */
    clear: function() {
      this.keypad.clear();
    }

  } ); // inherit

} ); // define
