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
  var KeypadPanel = require( 'UNIT_RATES/common/view/KeypadPanel' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  /**
   * @param {Node} doubleNumberLinePanel - panel that contains the double number line, for positioning the keypad
   * @param {Node} keypadLayer - layer in which the (modal) keypad will be displayed
   * @param {Object} [options]
   * @constructor
   */
  function MarkerEditor( doubleNumberLinePanel, keypadLayer, options ) {

    options = _.extend( {
      unitRate: 1, // {number} unit rate, used to compute whether numerator and denominator are a valid marker
      maxDigits: 4, // {number} maximum number of digits that can be entered on the keypad
      maxDecimals: 2, // {number} maximum number of decimal places that can be entered on the keypad
      trimZeros: true, // {boolean} whether to trim zeros that appear to the right of the decimal place
      editButtonScale: 0.5, // {number} scale applied to the edit button
      valueFormat: '{0}', // {string} format for displaying the value
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

    // keypad for entering numbers, added dynamically to keypadLayer
    var keypad = new KeypadPanel( {
      maxDigits: options.maxDigits,
      maxDecimals: options.maxDecimals,
      enterButtonListener: function() {
        self.commitEdit();
      }
    } );

    // Clicking outside the keypad cancels the edit
    var keypadLayerListener = new DownUpListener( {
      down: function( event ) {
        if ( event.trail.lastNode() === keypadLayer ) {
          self.cancelEdit();
        }
      }
    } );

    // display numerator
    this.numeratorProperty.link( function( numerator ) {
      if ( numerator === null ) {
        numeratorNode.text = '';
      }
      else {
        var valueDisplayed = ( options.trimZeros ) ? numerator : Util.toFixed( numerator, options.maxDecimals );
        numeratorNode.text = StringUtils.format( options.valueFormat, valueDisplayed );
      }
      numeratorNode.center = numeratorBox.center;
    } );

    // display denominator
    this.denominatorProperty.link( function( denominator ) {
      if ( denominator === null ) {
        denominatorNode.text = '';
      }
      else {
        var valueDisplayed = ( options.trimZeros ) ? denominator : Util.toFixed( denominator, options.maxDecimals );
        denominatorNode.text = StringUtils.format( options.valueFormat, valueDisplayed );
      }
      denominatorNode.center = denominatorBox.center;
    } );

    // Click on an edit button or in a box to begin editing the value
    var beginEditNumerator = function() {
      self.valueProperty = self.numeratorProperty;
      self.valueBox = numeratorBox;
      self.editButton = numeratorEditButton;
      self.beginEdit();
    };
    numeratorEditButton.addListener( beginEditNumerator.bind( this ) );
    numeratorBox.addInputListener( new DownUpListener( {
      down: beginEditNumerator.bind( this )
    } ) );
    var beginEditDenominator = function() {
      self.valueProperty = self.denominatorProperty;
      self.valueBox = denominatorBox;
      self.editButton = denominatorEditButton;
      self.beginEdit();
    };
    denominatorEditButton.addListener( beginEditDenominator.bind( this ) );
    denominatorBox.addInputListener( new DownUpListener( {
      down: beginEditDenominator.bind( this )
    } ) );

    this.mutate( options );

    // @private
    this.disposeMarkerEditor = function() {
      //TODO
    };

    // @private properties required by private functions related to keypad editing
    this.valueProperty = null; // will be set to the value Property that is currently being edited
    this.valueBox = null; // will be set to the value box that's currently being edited
    this.editButton = null; // will be set to the edit button that started the current edit
    this.editColor = options.editColor;
    this.keypadLocation = options.keypadLocation;
    this.keypad = keypad;
    this.keypadLayer = keypadLayer;
    this.keypadLayerListener = keypadLayerListener;
    this.doubleNumberLinePanel = doubleNumberLinePanel;
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
    },

    //TODO lots of keypad stuff in common with ShoppingQuestionNode, should be factored out
    // @private begins an edit
    beginEdit: function() {
      assert && assert( !this.keypadLayer.visible, 'invalid state for beginEdit' );

      // highlight the value box to indicate that an edit is in progress
      this.valueBox.fill = this.editColor;

      // display the keypad
      this.keypad.valueStringProperty.value = '';
      this.keypadLayer.addChild( this.keypad );
      this.keypadLayer.addInputListener( this.keypadLayerListener );
      this.keypadLayer.visible = true;

      // position the keypad relative to edit button and double number line panel
      var doubleNumberLinePanelBounds = this.keypad.globalToParentBounds( this.doubleNumberLinePanel.localToGlobalBounds( this.doubleNumberLinePanel.localBounds ) );
      var editButtonBounds = this.keypad.globalToParentBounds( this.editButton.localToGlobalBounds( this.editButton.localBounds ) );

      // Try to horizontally center the keypad on the edit button,
      // but don't let it go past the ends of the double number line panel. 
      this.keypad.centerX = editButtonBounds.centerX;
      if ( this.keypad.left < doubleNumberLinePanelBounds.left ) {
        this.keypad.left = doubleNumberLinePanelBounds.left;
      }
      else if ( this.keypad.right < doubleNumberLinePanelBounds.right ) {
        this.keypad.right = doubleNumberLinePanelBounds.right;
      }

      // Put the key pad above or below the double number line panel.
      if ( this.keypadLocation === 'above' ) {
        this.keypad.bottom = doubleNumberLinePanelBounds.top - 10;
      }
      else { // 'below'
        this.keypad.top = doubleNumberLinePanelBounds.bottom + 10;
      }
    },

    // @private ends an edit
    endEdit: function() {
      assert && assert( this.keypadLayer.visible, 'invalid state for endEdit' );

      // hide the keypad
      this.keypadLayer.visible = false;
      this.keypadLayer.removeChild( this.keypad );
      this.keypadLayer.removeInputListener( this.keypadLayerListener );

      // unhighlight the value box
      this.valueBox.fill = 'white';
    },

    // @private commits an edit
    commitEdit: function() {
      var valueString = this.keypad.valueStringProperty.value;
      if ( valueString ) {
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
