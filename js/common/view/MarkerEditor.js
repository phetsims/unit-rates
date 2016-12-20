// Copyright 2016, University of Colorado Boulder

/**
 * Maker editor, used to manually enter markers on the double number line.
 * Values are entered via a keypad.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var DownUpListener = require( 'SCENERY/input/DownUpListener' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // sim modules
  var EditButton = require( 'UNIT_RATES/common/view/EditButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );

  /**
   * @param {Node} doubleNumberLinePanel - panel that contains the double number line, for positioning the keypad
   * @param {KeypadLayer} keypadLayer - layer that manages the keypad
   * @param {Object} [options]
   * @constructor
   */
  function MarkerEditor( doubleNumberLinePanel, keypadLayer, options ) {

    options = _.extend( {
      unitRate: 1, // {number} unit rate, used to compute whether numerator and denominator are a valid marker
      numeratorMaxDigits: 4, // {number} maximum number of numerator digits that can be entered on the keypad
      numeratorMaxDecimals: 2, // {number} maximum number of numerator decimal places that can be entered on the keypad
      denominatorMaxDigits: 4, // {number} maximum number of denominator digits that can be entered on the keypad
      denominatorMaxDecimals: 1, // {number} maximum number of denominator decimal places that can be entered on the keypad
      numeratorTrimZeros: false, // {boolean} whether to trim zeros in numerator that appear to the right of the decimal place
      denominatorTrimZeros: true, // {boolean} whether to trim zeros in denominator that appear to the right of the decimal place
      editButtonScale: 0.5, // {number} scale applied to the edit button
      numeratorFormat: currencyValueString, // {string} format for displaying the numerator
      denominatorFormat: '{0}', // {string} format for displaying the denominator
      lineLength: 40, // {number} length of the vertical line between numerator and denominator values
      valueBoxWidth: 70, // {number} width of the value field, height determined by valueFont
      valueFont: new URFont( 14 ), // {Font} font for the value
      editColor: 'yellow', // {Color|string} value box is filled with this color while editing
      valueXMargin: 5, // {number} horizontal margin inside the value box
      valueYMargin: 3, // {number} vertical margin inside the value box
      ySpacing: 5,  // {number} vertical spacing between UI elements
      keypadLocation: 'below' // {string} 'above' or 'below' doubleNumberLinePanel
    }, options );

    assert && assert( options.keypadLocation.options === 'above' || options.keypadLocation === 'below',
      'invalid keypadLocation: ' + options.keypadLocation );

    Node.call( this );

    var self = this;

    // @public (read-only)
    this.numeratorProperty = new Property( null );
    this.denominatorProperty = new Property( null );

    // vertical line
    var verticalLine = new Line( 0, 0, 0, options.lineLength, {
      stroke: 'black'
    } );
    this.addChild( verticalLine );

    // common to both value boxes
    var valueBoxWidth = options.valueBoxWidth;
    var valueBoxHeight = new Text( '0', { font: options.valueFont } ).height + ( 2 * options.valueYMargin );
    var valueBoxOptions = {
      stroke: 'black',
      fill: 'white',
      cursor: 'pointer'
    };

    // box for the numerator
    var numeratorBox = new Rectangle( 0, 0, valueBoxWidth, valueBoxHeight, _.extend( {}, valueBoxOptions, {
      centerX: verticalLine.centerX,
      bottom: verticalLine.top
    } ) );
    this.addChild( numeratorBox );

    // box for the denominator
    var denominatorBox = new Rectangle( 0, 0, valueBoxWidth, valueBoxHeight, _.extend( {}, valueBoxOptions, {
      centerX: verticalLine.centerX,
      top: verticalLine.bottom
    } ) );
    this.addChild( denominatorBox );

    var numeratorNode = new Text( '', {
      fill: options.neutralColor,
      font: options.valueFont,
      center: numeratorBox.center
    } );
    this.addChild( numeratorNode );

    var denominatorNode = new Text( '', {
      fill: options.neutralColor,
      font: options.valueFont,
      center: denominatorBox.center
    } );
    this.addChild( denominatorNode );

    var numeratorEditButton = new EditButton( {
      scale: options.editButtonScale,
      centerX: verticalLine.centerX,
      bottom: numeratorBox.top - options.ySpacing
    } );
    this.addChild( numeratorEditButton );

    var denominatorEditButton = new EditButton( {
      scale: options.editButtonScale,
      centerX: verticalLine.centerX,
      top: denominatorBox.bottom + options.ySpacing
    } );
    this.addChild( denominatorEditButton );

    // display numerator
    this.numeratorProperty.link( function( numerator ) {
      if ( numerator === null ) {
        numeratorNode.text = '';
      }
      else {
        var valueDisplayed = ( options.numeratorTrimZeros ) ? numerator : Util.toFixed( numerator, options.numeratorMaxDecimals );
        numeratorNode.text = StringUtils.format( options.numeratorFormat, valueDisplayed );
      }
      numeratorNode.center = numeratorBox.center;
    } );

    // display denominator
    this.denominatorProperty.link( function( denominator ) {
      if ( denominator === null ) {
        denominatorNode.text = '';
      }
      else {
        var valueDisplayed = ( options.denominatorTrimZeros ) ? denominator : Util.toFixed( denominator, options.denominatorMaxDecimals );
        denominatorNode.text = StringUtils.format( options.denominatorFormat, valueDisplayed );
      }
      denominatorNode.center = denominatorBox.center;
    } );

    // Sets the location of the keypad
    var setKeypadLocation = function( keypad ) {

      // This algorithm assumes that both buttons have the same centerX,
      // so either button can be used for horizontal positioning.
      assert && assert( numeratorEditButton.centerX === denominatorEditButton.centerX );

      // position the keypad relative to edit button and double number line panel
      var doubleNumberLinePanelBounds = keypad.globalToParentBounds( doubleNumberLinePanel.localToGlobalBounds( doubleNumberLinePanel.localBounds ) );
      var editButtonBounds = keypad.globalToParentBounds( numeratorEditButton.localToGlobalBounds( numeratorEditButton.localBounds ) );

      // Try to horizontally center the keypad on the edit button,
      // but don't let it go past the ends of the double number line panel.
      keypad.centerX = editButtonBounds.centerX;
      if ( keypad.left < doubleNumberLinePanelBounds.left ) {
        keypad.left = doubleNumberLinePanelBounds.left;
      }
      else if ( keypad.right > doubleNumberLinePanelBounds.right ) {
        keypad.right = doubleNumberLinePanelBounds.right;
      }

      // Put the key pad above or below the double number line panel.
      if ( options.keypadLocation === 'above' ) {
        keypad.bottom = doubleNumberLinePanelBounds.top - 10;
      }
      else { // 'below'
        keypad.top = doubleNumberLinePanelBounds.bottom + 10;
      }
    };

    // opens a keypad for editing the numerator
    var editNumerator = function() {
      keypadLayer.beginEdit( self.numeratorProperty, {
        onBeginEdit: function() { numeratorBox.fill = options.editColor; },
        onEndEdit: function() { numeratorBox.fill = 'white'; },
        setKeypadLocation: setKeypadLocation,
        maxDigits: options.numeratorMaxDigits,
        maxDecimals: options.numeratorMaxDecimals
      } );
    };

    // opens a keypad for editing the denominator
    var editDenominator = function() {
      keypadLayer.beginEdit( self.denominatorProperty, {
        onBeginEdit: function() { denominatorBox.fill = options.editColor; },
        onEndEdit: function() { denominatorBox.fill = 'white'; },
        setKeypadLocation: setKeypadLocation,
        maxDigits: options.denominatorMaxDigits,
        maxDecimals: options.denominatorMaxDecimals
      } );
    };

    // Click on an edit button or box to begin editing
    numeratorEditButton.addListener( editNumerator );
    numeratorBox.addInputListener( new DownUpListener( {
      down: editNumerator
    } ) );
    denominatorEditButton.addListener( editDenominator );
    denominatorBox.addInputListener( new DownUpListener( {
      down: editDenominator
    } ) );

    this.mutate( options );

    // @private
    this.disposeMarkerEditor = function() {
      //TODO
    };
  }

  unitRates.register( 'MarkerEditor', MarkerEditor );

  return inherit( Node, MarkerEditor, {

    // @public
    reset: function() {
      //TODO
      this.numeratorProperty.reset();
      this.denominatorProperty.reset();
    },

    // @public
    dispose: function() {
      this.disposeMarkerEditor();
    }
  } );
} );
