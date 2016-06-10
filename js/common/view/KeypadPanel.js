// Copyright 2016, University of Colorado Boulder

/**
 * A scenery node that looks like a calculator and allows the user to enter digits.
 *
 * @author
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
  var READOUT_FONT = new PhetFont( 25 );
  var SPACING = 10;

  /**
   * @param {Function} onSubmit
   * @constructor
   */
  function KeypadPanel( options ) {

    options = _.extend( {
      maxDigits: 4
    },  options || {} );


    var self = this;

    this.onSubmit = null;
    this.onListenerChanged = null;

    // Add the keypad.
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

    this.checkButton = new TextPushButton( enterString, {
      font: new PhetFont( 18 ),
      baseColor: '#F2E916',
      cornerRadius: 4
    });

    this.checkButton.top  = this.keypad.bottom + SPACING;
    this.checkButton.left = (this.keypad.bounds.width - this.checkButton.bounds.width) / 2;

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

  unitRates.register( 'KeypadPanel', KeypadPanel );

  return inherit( Panel, KeypadPanel, {

    /**
     *
     * @public
     */
    setListeners: function( onSubmit, onListenerChanged) {

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
     *
     * @public
     */
    getValue: function() {
      return this.value;
    },

    /**
     *
     * @public
     */
    setValue: function( value ) {
      this.keypad.digitStringProperty.set( value );
    },

    /**
     *
     * @public
     */
    clear: function() {
      this.keypad.clear();
    }

  } );

} );
