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
  var Util = require( 'DOT/Util' );

  // sim modules
  var FontAwesomeButton = require( 'UNIT_RATES/common/view/FontAwesomeButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

  /**
   * @param {Property.<number>} unitRateProperty
   * @param {Node} doubleNumberLinePanel - panel that contains the double number line, for positioning the keypad
   * @param {KeypadLayer} keypadLayer - layer that manages the keypad
   * @param {Object} [options]
   * @constructor
   */
  function MarkerEditor( unitRateProperty, doubleNumberLinePanel, keypadLayer, options ) {

    options = _.extend( {
      lineLength: 75, // {number} length of the vertical line between numerator and denominator values
      valueBoxWidth: 70, // {number} width of the value field, height determined by valueFont
      valueFont: new URFont( 12 ), // {Font} font for the value
      valueColor: 'black', // {Color|string} color of the value
      showAnswersColor: 'lightGray', // {Color|string} color of the value when 'showAnswers' query parameter is present
      editColor: 'yellow', // {Color|string} box is filled with this color while editing value
      valueXMargin: 5, // {number} horizontal margin inside the value box
      valueYMargin: 3, // {number} vertical margin inside the value box
      ySpacing: 5,  // {number} vertical spacing between UI elements
      keypadLocation: 'below', // {string} 'above' or 'below' doubleNumberLinePanel
      numerationOptions: null, // {*} options specific to the rate's numerator, see below
      denominatorOptions: null // {*} options specific to the rate's denominator, see below
    }, options );

    var numeratorOptions = _.extend( {
      maxDigits: 4, // {number} maximum number of digits that can be entered via keypad
      maxDecimals: 1, // {number} maximum number of decimal places that can be entered via keypad
      trimZeros: false // {boolean} whether to trim trailing zeros from decimal places
    }, options.numeratorOptions );

    var denominatorOptions = _.extend( {
      maxDigits: 4, // {number} maximum number of digits that can be entered via keypad
      maxDecimals: 1, // {number} maximum number of decimal places that can be entered via keypad
      trimZeros: false // {boolean} whether to trim trailing zeros from decimal places
    }, options.denominatorOptions );

    assert && assert( options.keypadLocation.options === 'above' || options.keypadLocation === 'below',
      'invalid keypadLocation: ' + options.keypadLocation );

    // numerator and denominator must have the same number of decimal places,
    // or we will end up with rates that share a common numerator or denominator.
    assert && assert( numeratorOptions.maxDecimals === denominatorOptions.maxDecimals,
      'maxDecimals must be the same for numerator and denominator' );

    Node.call( this );

    var self = this;

    // @private
    this.unitRateProperty = unitRateProperty;
    this.maxDecimals = denominatorOptions.maxDecimals;

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

    var numeratorEditButton = new FontAwesomeButton( 'pencil_square_o', {
      baseColor: 'yellow',
      iconScale: 0.5,
      centerX: verticalLine.centerX,
      bottom: numeratorBox.top - options.ySpacing
    } );
    this.addChild( numeratorEditButton );
    numeratorEditButton.touchArea = numeratorEditButton.localBounds.dilatedXY( 10, 10 );

    var denominatorEditButton = new FontAwesomeButton( 'pencil_square_o', {
      baseColor: 'yellow',
      iconScale: 0.5,
      centerX: verticalLine.centerX,
      top: denominatorBox.bottom + options.ySpacing
    } );
    this.addChild( denominatorEditButton );
    denominatorEditButton.touchArea = denominatorEditButton.localBounds.dilatedXY( 10, 10 );

    this.mutate( options );

    // Sets the location of the keypad
    var setKeypadLocation = function( keypad ) {

      // This algorithm assumes that both buttons have the same centerX,
      // so either button can be used for horizontal positioning.
      assert && assert( numeratorEditButton.centerX === denominatorEditButton.centerX );

      // position the keypad relative to edit button and double number line panel
      var doubleNumberLinePanelBounds =
        keypad.globalToParentBounds( doubleNumberLinePanel.localToGlobalBounds( doubleNumberLinePanel.localBounds ) );
      var editButtonBounds =
        keypad.globalToParentBounds( numeratorEditButton.localToGlobalBounds( numeratorEditButton.localBounds ) );

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
        maxDigits: numeratorOptions.maxDigits,
        maxDecimals: numeratorOptions.maxDecimals
      } );
    };

    // opens a keypad for editing the denominator
    var editDenominator = function() {
      keypadLayer.beginEdit( self.denominatorProperty, {
        onBeginEdit: function() { denominatorBox.fill = options.editColor; },
        onEndEdit: function() { denominatorBox.fill = 'white'; },
        setKeypadLocation: setKeypadLocation,
        maxDigits: denominatorOptions.maxDigits,
        maxDecimals: denominatorOptions.maxDecimals
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
      if ( numerator === null ) {
        numeratorNode.text = '';
      }
      else {
        numeratorNode.text = URUtil.numberToString( numerator, numeratorOptions.maxDecimals, numeratorOptions.trimZeros );

        // compute the corresponding denominator
        var denominator = Util.toFixedNumber( numerator / unitRateProperty.value, denominatorOptions.maxDecimals );

        // clear the denominator if it doesn't match the numerator
        if ( denominator !== self.denominatorProperty.value ) {
          self.denominatorProperty.value = null;

          // show the denominator that corresponds to this numerator
          if ( URQueryParameters.showAnswers ) {
            denominatorNode.text = URUtil.numberToString( denominator, denominatorOptions.maxDecimals, denominatorOptions.trimZeros );
            denominatorNode.fill = options.showAnswersColor;
            denominatorNode.center = denominatorBox.center;
          }
        }
      }
      numeratorNode.fill = options.valueColor;
      numeratorNode.center = numeratorBox.center;
    } );

    // display denominator
    this.denominatorProperty.link( function( denominator ) {
      if ( denominator === null ) {
        denominatorNode.text = '';
      }
      else {
        denominatorNode.text = URUtil.numberToString( denominator, denominatorOptions.maxDecimals, denominatorOptions.trimZeros );

        // compute the corresponding numerator
        var numerator = Util.toFixedNumber( denominator * unitRateProperty.value, numeratorOptions.maxDecimals );

        // clear the numerator if it doesn't match the denominator
        if ( numerator !== self.numeratorProperty.value ) {
          self.numeratorProperty.value = null;

          // show the numerator that corresponds to this denominator
          if ( URQueryParameters.showAnswers ) {
            numeratorNode.text = URUtil.numberToString( numerator, numeratorOptions.maxDecimals, numeratorOptions.trimZeros );
            numeratorNode.fill = options.showAnswersColor;
            numeratorNode.center = numeratorBox.center;
          }
        }
      }
      denominatorNode.fill = options.valueColor;
      denominatorNode.center = denominatorBox.center;
    } );

    // if the unit rate changes, cancel any edit that is in progress
    var unitRateObserver = function() {
      self.reset();
    };
    unitRateProperty.link( unitRateObserver );

    // @private
    this.disposeMarkerEditor = function() {
      unitRateProperty.unlink( unitRateObserver );
      this.numeratorProperty.unlinkAll();
      this.denominatorProperty.unlinkAll();
    };
  }

  unitRates.register( 'MarkerEditor', MarkerEditor );

  return inherit( Node, MarkerEditor, {

    /**
     * Do the numerator and denominator values represent a valid marker?
     * @returns {boolean}
     * @public
     */
    isValidMarker: function() {
      return ( this.numeratorProperty.value !== null && this.denominatorProperty.value !== null );
    },

    /**
     * Gets a valid denominator for what is currently entered in the editor.
     * @return {number|null} - null indicates that a valid denominator cannot be determined
     * @public
     */
    getValidDenominator: function() {
      if ( this.numeratorProperty.value === null && this.denominatorProperty.value === null ) {
        return null;
      }
      else {
        var denominator = this.denominatorProperty.value;
        if ( denominator === null ) {
          denominator = this.numeratorProperty.value / this.unitRateProperty.value;
        }
        return Util.toFixedNumber( denominator, this.maxDecimals );
      }
    },

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
