// Copyright 2016-2017, University of Colorado Boulder

/**
 * KeypadLayer handles creation and management of a modal keypad.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Plane = require( 'SCENERY/nodes/Plane' );

  // sim modules
  var KeypadPanel = require( 'UNIT_RATES/common/view/KeypadPanel' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function KeypadLayer( options ) {

    options = _.extend( {
      fill: 'rgba( 0, 0, 0, 0.2 )',
      visible: false
    }, options );

    Plane.call( this, options );

    var self = this;

    // @private clicking outside the keypad cancels the edit
    this.clickOutsideListener = new DownUpListener( {
      down: function( event ) {
        if ( event.trail.lastNode() === self ) {
          self.cancelEdit();
        }
      }
    } );

    // @private these will be set when the client calls beginEdit
    this.valueProperty = null;
    this.keypad = null;
    this.allowZeroEntry = true;
    this.onEndEdit = null; // {function} called by endEdit
  }

  unitRates.register( 'KeypadLayer', KeypadLayer );

  return inherit( Plane, KeypadLayer, {

    /**
     * Begins an edit, by opening a modal keypad.
     * @param {Property.<number>} valueProperty - the Property to be set by the keypad
     * @param {Object} [options]
     */
    beginEdit: function( valueProperty, options ) {

      options = _.extend( {
        onBeginEdit: null, // {function} called by beginEdit
        onEndEdit: null, // {function} called by endEdit
        setKeypadLocation: null, // {function:KeypadPanel} called by beginEdit to set the keypad location
        maxDigits: 4, // {number} maximum number of digits that can be entered on the keypad
        maxDecimals: 2, // {number} maximum number of decimal places that can be entered on the keypad
        allowZeroEntry: true // {boolean} whether to allow '0' to be entered
      }, options );

      this.valueProperty = valueProperty;
      this.onEndEdit = options.onEndEdit;
      this.allowZeroEntry = options.allowZeroEntry;

      // create a keypad
      this.keypad = new KeypadPanel( {
        maxDigits: options.maxDigits,
        maxDecimals: options.maxDecimals,
        enterButtonListener: this.commitEdit.bind( this )
      } );

      // display the keypad
      this.addChild( this.keypad );
      this.visible = true;
      this.addInputListener( this.clickOutsideListener );

      // position the keypad
      options.setKeypadLocation && options.setKeypadLocation( this.keypad );

      // execute client-specific hook
      options.onBeginEdit && options.onBeginEdit();
    },

    // @private ends an edit
    endEdit: function() {

      // hide the keypad
      this.visible = false;
      this.removeInputListener( this.clickOutsideListener );
      this.removeChild( this.keypad );
      this.keypad.dispose();
      this.keypad = null;

      // execute client-specific hook
      this.onEndEdit && this.onEndEdit();
    },

    // @private commits an edit
    commitEdit: function() {
      var valueString = this.keypad.valueStringProperty.value;
      if ( valueString && !( !this.allowZeroEntry && valueString === '0' ) ) {
        this.endEdit();
        this.valueProperty.value = ( 1 * valueString ); // string -> number conversion
      }
      else {
        this.cancelEdit(); // not entering a value in the keypad is effectively a cancel
      }
    },

    // @private cancels an edit
    cancelEdit: function() {
      this.endEdit();
    }
  } );
} );
