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
  var Text = require( 'SCENERY/nodes/Text' );

  // sim modules
  var EditButton = require( 'UNIT_RATES/common/view/EditButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

  // strings
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );

  /**
   * @param {Property.<number>} unitRateProperty
   * @param {Node} doubleNumberLinePanel - panel that contains the double number line, for positioning the keypad
   * @param {KeypadLayer} keypadLayer - layer that manages the keypad
   * @param {Object} [options]
   * @constructor
   */
  function MarkerEditor( unitRateProperty, doubleNumberLinePanel, keypadLayer, options ) {

    options = _.extend( {

      // numerator
      numeratorFormat: currencyValueString, // {string} format for displaying the numerator
      numeratorMaxDigits: 4, // {number} maximum number of numerator digits that can be entered on the keypad
      numeratorMaxDecimals: 2, // {number} maximum number of numerator decimal places that can be entered on the keypad
      numeratorTrimZeros: false, // {boolean} whether to trim trailing zeros in numerator's decimal places

      // denominator
      denominatorFormat: '{0}', // {string} format for displaying the denominator
      denominatorMaxDigits: 4, // {number} maximum number of denominator digits that can be entered on the keypad
      denominatorMaxDecimals: 1, // {number} maximum number of denominator decimal places that can be entered on the keypad
      denominatorTrimZeros: true, // {boolean} whether to trim trailing zeros in denominator's decimal places

      // general
      editButtonScale: 0.5, // {number} scale applied to the edit button
      lineLength: 40, // {number} length of the vertical line between numerator and denominator values
      valueBoxWidth: 70, // {number} width of the value field, height determined by valueFont
      valueFont: new URFont( 14 ), // {Font} font for the value
      valueColor: 'black', // {Color|string} color of the value
      showAnswersColor: 'lightGray', // {Color|string} color of the value when 'showAnswers' query parameter is present
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

    this.mutate( options );

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

    // display numerator
    this.numeratorProperty.link( function( numerator ) {

      var denominator = numerator / unitRateProperty.value;

      if ( numerator === null ) {
        numeratorNode.text = '';
      }
      else {
        numeratorNode.text = URUtil.formatNumber( options.numeratorFormat, numerator, options.numeratorMaxDecimals, options.numeratorTrimZeros );

        // show the denominator that corresponds to this numerator
        if ( URQueryParameters.showAnswers ) {
          denominatorNode.text = URUtil.formatNumber( options.denominatorFormat, denominator, options.denominatorMaxDecimals, options.denominatorTrimZeros );
          denominatorNode.fill = options.showAnswersColor;
          denominatorNode.center = denominatorBox.center;
        }
      }
      numeratorNode.fill = options.valueColor;
      numeratorNode.center = numeratorBox.center;

      //TODO if ( denominator === denominatorProperty.value ) { create a marker } else { animate to numerator & clear denominator }
    } );

    // display denominator
    this.denominatorProperty.link( function( denominator ) {

      var numerator = denominator * unitRateProperty.value;

      if ( denominator === null ) {
        denominatorNode.text = '';
      }
      else {
        denominatorNode.text = URUtil.formatNumber( options.denominatorFormat, denominator, options.denominatorMaxDecimals, options.denominatorTrimZeros );

        // show the numerator that corresponds to this denominator
        if ( URQueryParameters.showAnswers ) {
          numeratorNode.text = URUtil.formatNumber( options.numeratorFormat, numerator, options.numeratorMaxDecimals, options.numeratorTrimZeros );
          numeratorNode.fill = options.showAnswersColor;
          numeratorNode.center = numeratorBox.center;
        }
      }
      denominatorNode.fill = options.valueColor;
      denominatorNode.center = denominatorBox.center;

      //TODO if ( numerator === numeratorProperty.value ) { create a marker } else { animate to denominator & clear numerator }
    } );

    var unitRateObserver = function() {
      //TODO
    };
    unitRateProperty.link( unitRateObserver );

    // @private
    this.disposeMarkerEditor = function() {
      unitRateProperty.unlink( unitRateObserver );
    };
  }

  unitRates.register( 'MarkerEditor', MarkerEditor );

  return inherit( Node, MarkerEditor, {

    // @public
    reset: function() {
      this.numeratorProperty.reset();
      this.denominatorProperty.reset();
    },

    // @public
    dispose: function() {
      this.disposeMarkerEditor();
    }
  } );
} );
