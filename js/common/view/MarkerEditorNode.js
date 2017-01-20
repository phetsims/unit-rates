// Copyright 2016-2017, University of Colorado Boulder

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
  var FontAwesomeButton = require( 'UNIT_RATES/common/view/FontAwesomeButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

  // constants
  var KEYPAD_LOCATION_VALUES = [ 'above', 'below' ];

  /**
   * @param {MarkerEditor} markerEditor
   * @param {Node} doubleNumberLinePanel - panel that contains the double number line, for positioning the keypad
   * @param {KeypadLayer} keypadLayer - layer that manages the keypad
   * @param {Object} [options]
   * @constructor
   */
  function MarkerEditorNode( markerEditor, doubleNumberLinePanel, keypadLayer, options ) {

    options = _.extend( {
      lineLength: 75, // {number} length of the vertical line between numerator and denominator values
      valueBoxWidth: 70, // {number} width of the value field, height determined by valueFont
      valueFont: new URFont( 12 ), // {Font} font for the value
      valueColor: 'black', // {Color|string} color of the value
      allowZeroEntry: false, // {boolean} whether to allow '0' to be entered in the keypad
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

    assert && assert( _.contains( KEYPAD_LOCATION_VALUES, options.keypadLocation ),
      'invalid keypadLocation: ' + options.keypadLocation );

    // numerator and denominator must have the same number of decimal places,
    // or we will end up with rates that share a common numerator or denominator.
    assert && assert( numeratorOptions.maxDecimals === denominatorOptions.maxDecimals,
      'maxDecimals must be the same for numerator and denominator' );

    Node.call( this );

    // @private
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
      iconScale: 0.5,
      baseColor: URColors.editButton,
      centerX: verticalLine.centerX,
      bottom: numeratorBox.top - options.ySpacing
    } );
    this.addChild( numeratorEditButton );
    numeratorEditButton.touchArea = numeratorEditButton.localBounds.dilatedXY( 10, 10 );

    var denominatorEditButton = new FontAwesomeButton( 'pencil_square_o', {
      iconScale: 0.5,
      baseColor: URColors.editButton,
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
      keypadLayer.beginEdit( markerEditor.numeratorProperty, {
        onBeginEdit: function() { numeratorBox.fill = URColors.edit; },
        onEndEdit: function() { numeratorBox.fill = 'white'; },
        setKeypadLocation: setKeypadLocation,
        maxDigits: numeratorOptions.maxDigits,
        maxDecimals: numeratorOptions.maxDecimals,
        allowZeroEntry: options.allowZeroEntry
      } );
    };

    // opens a keypad for editing the denominator
    var editDenominator = function() {
      keypadLayer.beginEdit( markerEditor.denominatorProperty, {
        onBeginEdit: function() { denominatorBox.fill = URColors.edit; },
        onEndEdit: function() { denominatorBox.fill = 'white'; },
        setKeypadLocation: setKeypadLocation,
        maxDigits: denominatorOptions.maxDigits,
        maxDecimals: denominatorOptions.maxDecimals,
        allowZeroEntry: options.allowZeroEntry
      } );
    };

    // Click on an edit button or box to begin editing
    numeratorEditButton.addListener( editNumerator ); // no removeListener required
    numeratorBox.addInputListener( new DownUpListener( { // no removeInputListener required
      down: editNumerator
    } ) );
    denominatorEditButton.addListener( editDenominator ); // no removeListener required
    denominatorBox.addInputListener( new DownUpListener( { // no removeInputListener required
      down: editDenominator
    } ) );

    // Observe edits to the numerator
    var numeratorObserver = function( numerator ) {
      assert && assert( !isNaN( numerator ), 'invalid numerator: ' + numerator );

      // update the numerator
      if ( numerator ) {
        numeratorNode.text = URUtil.numberToString( numerator, numeratorOptions.maxDecimals, numeratorOptions.trimZeros );
      }
      else {
        numeratorNode.text = '';
      }
      numeratorNode.fill = options.valueColor;
      numeratorNode.center = numeratorBox.center;

      // show the corresponding denominator
      if ( URQueryParameters.showAnswers && !markerEditor.denominatorProperty.value ) {
        if ( numerator ) {
          var denominator = markerEditor.numeratorProperty.value / markerEditor.unitRateProperty.value;
          denominatorNode.text = URUtil.numberToString( denominator, denominatorOptions.maxDecimals, denominatorOptions.trimZeros );
        }
        else {
          denominatorNode.text = '';
        }
        denominatorNode.fill = URColors.showAnswers;
        denominatorNode.center = denominatorBox.center;
      }
    };
    markerEditor.numeratorProperty.link( numeratorObserver ); // unlink in dispose

    // Observe edits to the denominator
    var denominatorObserver = function( denominator ) {
      assert && assert( !isNaN( denominator ), 'invalid denominator: ' + denominator );

      // update the denominator
      if ( denominator ) {
        denominatorNode.text = URUtil.numberToString( denominator, denominatorOptions.maxDecimals, denominatorOptions.trimZeros );
      }
      else {
        denominatorNode.text = '';
      }
      denominatorNode.fill = options.valueColor;
      denominatorNode.center = denominatorBox.center;

      // show the corresponding numerator
      if ( URQueryParameters.showAnswers && !markerEditor.numeratorProperty.value ) {
        if ( denominator ) {
          var numerator = markerEditor.denominatorProperty.value * markerEditor.unitRateProperty.value;
          numeratorNode.text = URUtil.numberToString( numerator, numeratorOptions.maxDecimals, numeratorOptions.trimZeros );
        }
        else {
          numeratorNode.text = '';
        }
        numeratorNode.fill = URColors.showAnswers;
        numeratorNode.center = numeratorBox.center;
      }
    };
    markerEditor.denominatorProperty.link( denominatorObserver ); // unlink in dispose

    // @private
    this.disposeMarkerEditorNode = function() {
      markerEditor.numeratorProperty.unlink( numeratorObserver );
      markerEditor.denominatorProperty.unlink( denominatorObserver );
    };

    // @private fields required by prototype functions
    this.numeratorNode = numeratorNode;
    this.denominatorNode = denominatorNode;
  }

  unitRates.register( 'MarkerEditorNode', MarkerEditorNode );

  return inherit( Node, MarkerEditorNode, {

    // @public
    dispose: function() {
      Node.prototype.dispose && Node.prototype.dispose.call( this );
      this.disposeMarkerEditorNode();
    }
  } );
} );
