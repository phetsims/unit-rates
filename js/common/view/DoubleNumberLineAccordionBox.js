// Copyright 2016, University of Colorado Boulder

/**
 * Displays a double number line in an accordion box, with a marker editor and eraser button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // sim modules
  var DoubleNumberLineNode = require( 'UNIT_RATES/common/view/DoubleNumberLineNode' );
  var FontAwesomeButton = require( 'UNIT_RATES/common/view/FontAwesomeButton' );
  var MarkerEditor = require( 'UNIT_RATES/common/view/MarkerEditor' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  var doubleNumberLineString = require( 'string!UNIT_RATES/doubleNumberLine' );

  // constants
  var AXIS_LABEL_OPTIONS = {
    font: new URFont( 14 ),
    fill: 'black',
    maxWidth: 50 // determined empirically
  };

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Node} keypadLayer - layer in which the (modal) keypad will be displayed
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineAccordionBox( shoppingItem, keypadLayer, options ) {

    options = _.extend( {
      expandedProperty: new Property( true ),
      titleNode: new Text( doubleNumberLineString, { font: new URFont( 18 ), maxWidth: 300 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 10,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,
      bottomAxisMaxDecimals: 1,
      horizontalAxisLength: 575
    }, options );

    //TODO in ShoppingLabScreen, unit rate is mutable, and should be part of the ShoppingLabItem model element
     var unitRateProperty = new Property( shoppingItem.unitRate );

    var doubleNumberLineNode = new DoubleNumberLineNode( unitRateProperty, {
      horizontalAxisLength: options.horizontalAxisLength,
      topAxisLabel: new Text( shoppingItem.topAxisLabel, AXIS_LABEL_OPTIONS ),
      bottomAxisLabel: new Text( shoppingItem.bottomAxisLabel, AXIS_LABEL_OPTIONS ),
      bottomAxisMaxDecimals: shoppingItem.bottomAxisMaxDecimals,
      bottomAxisRange: shoppingItem.bottomAxisRange,
      x: 0,
      y: 0
    } );

    var markerEditor = new MarkerEditor( unitRateProperty, this, keypadLayer, {
      denominatorMaxDecimals: options.bottomAxisMaxDecimals,
      right: doubleNumberLineNode.left - 5,
      centerY: doubleNumberLineNode.centerY
    } );

    var undoButton = new FontAwesomeButton( 'undo', {
      baseColor: 'rgb( 242, 242, 242 )',
      iconScale: 0.5,
      listener: function() {
        markerEditor.reset();
        //TODO erase the marker that was most recently added using the editor
      },
      center: markerEditor.center
    } );
    undoButton.touchArea = undoButton.localBounds.dilatedXY( 5, 5 );

    var eraserButton = new EraserButton( {
      baseColor: 'rgb( 242, 242, 242 )',
      listener: function() {
        //TODO erase markers that were created using the marker editor or by interacting with the scale
      }
    } );
    eraserButton.touchArea = eraserButton.localBounds.dilatedXY( 5, 5 );

    var contentNode = new VBox( {
      resize: false,
      align: 'right',
      spacing: 5,
      children: [
        new Node( { children: [ doubleNumberLineNode, undoButton, markerEditor ] } ),
        eraserButton
      ]
    } );

    AccordionBox.call( this, contentNode, options );

    // maps the denominator to a view coordinate on the double number line
    assert && assert( doubleNumberLineNode.x === 0 );
    var modelToView = new LinearFunction(
      shoppingItem.bottomAxisRange.min, shoppingItem.bottomAxisRange.max,
      0, 0.96 * options.horizontalAxisLength );

    // Observe marker editor, to position the editor and create markers.
    var markerEditorObserver = function() {

      if ( markerEditor.numeratorProperty.value === null && markerEditor.denominatorProperty.value === null ) {

        // move marker editor back to home position
        markerEditor.right = doubleNumberLineNode.left - 5;
      }
      else {
        var denominator = markerEditor.denominatorProperty.value;
        if ( denominator === null ) {
          denominator = Util.toFixedNumber( markerEditor.numeratorProperty.value / unitRateProperty.value, options.bottomAxisMaxDecimals );
        }
        assert && assert( denominator >= 0, 'invalid denominator: ' + denominator );

        if ( denominator > shoppingItem.bottomAxisRange.max ) {

          // move marker editor to right of axis arrows
          markerEditor.centerX = doubleNumberLineNode.x + options.horizontalAxisLength + 5;
        }
        else {
          markerEditor.centerX = doubleNumberLineNode.x + modelToView( denominator );
        }
      }
    };
    markerEditor.numeratorProperty.link( markerEditorObserver );
    markerEditor.denominatorProperty.link( markerEditorObserver );

    // @private
    this.disposeDoubleNumberLineAccordionBox = function() {
      markerEditor.numeratorProperty.unlink( markerEditorObserver );
      markerEditor.denominatorProperty.unlink( markerEditorObserver );
      markerEditor.dispose();
      doubleNumberLineNode.dispose();
    };
  }

  unitRates.register( 'DoubleNumberLineAccordionBox', DoubleNumberLineAccordionBox );

  return inherit( AccordionBox, DoubleNumberLineAccordionBox, {

    // @public
    dispose: function() {
      AccordionBox.prototype.dispose.call( this );
      this.disposeDoubleNumberLineAccordionBox();
    }
  } );
} );
