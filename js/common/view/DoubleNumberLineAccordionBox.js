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
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // sim modules
  var DoubleNumberLineNode = require( 'UNIT_RATES/common/view/DoubleNumberLineNode' );
  var MarkerEditor = require( 'UNIT_RATES/common/view/MarkerEditor' );
  var UndoButton = require( 'UNIT_RATES/common/view/UndoButton' );
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
      buttonTouchAreaYDilation: 5
    }, options );

    //TODO in ShoppingLabScreen, unit rate is mutable, and should be part of the ShoppingLabItem model element
    var unitRateProperty = new Property( shoppingItem.unitRate );

    var markerEditor = new MarkerEditor( unitRateProperty, this, keypadLayer, {
      denominatorMaxDecimals: options.bottomAxisMaxDecimals
    } );

    var undoButton = new UndoButton( {
      listener: function() {
        //TODO cancel current editing, or erase the marker that was most recently added using the editor
      },
      center: markerEditor.center
    } );
    undoButton.touchArea = undoButton.localBounds.dilatedXY( 5, 5 );

    var doubleNumberLineNode = new DoubleNumberLineNode( unitRateProperty, keypadLayer, {
      topAxisLabel: new Text( shoppingItem.topAxisLabel, AXIS_LABEL_OPTIONS ),
      bottomAxisLabel: new Text( shoppingItem.bottomAxisLabel, AXIS_LABEL_OPTIONS ),
      bottomAxisMaxDecimals: shoppingItem.bottomAxisMaxDecimals,
      left: markerEditor.right + 5,
      centerY: markerEditor.centerY
    } );

    var eraserButton = new EraserButton( {
      baseColor: '#f2f2f2',
      listener: function() {
        //TODO erase markers that were created using the marker editor or by interacting with the scale
      }
    } );
    eraserButton.touchArea = eraserButton.localBounds.dilatedXY( 5, 5 );

    var contentNode = new VBox( {
      align: 'right',
      children: [
        new Node( { children: [ doubleNumberLineNode, undoButton, markerEditor ] } ),
        eraserButton
      ]
    } );

    AccordionBox.call( this, contentNode, options );

    // @private
    this.disposeDoubleNumberLineAccordionBox = function() {
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
