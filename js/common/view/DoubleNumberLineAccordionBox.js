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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // sim modules
  var DoubleNumberLineNode = require( 'UNIT_RATES/common/view/DoubleNumberLineNode' );
  var UndoButton = require( 'UNIT_RATES/common/view/UndoButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  var doubleNumberLineString = require( 'string!UNIT_RATES/doubleNumberLine' );

  // constants
  var AXIS_LABEL_OPTIONS = {
    font: new URFont( 14 ),
    fill: 'black'
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

    var doubleNumberLineNode = new DoubleNumberLineNode( unitRateProperty, this, keypadLayer, {
      topAxisLabel: new Text( shoppingItem.topAxisLabel, AXIS_LABEL_OPTIONS ),
      bottomAxisLabel: new Text( shoppingItem.bottomAxisLabel, AXIS_LABEL_OPTIONS ),
      bottomAxisMaxDecimals: shoppingItem.bottomAxisMaxDecimals
    } );

    //TODO cancel current editing, or erase the marker that was most recently added using the editor
    var undoButton = new UndoButton();
    undoButton.touchArea = undoButton.localBounds.dilatedXY( 5, 5 );

    //TODO erase markers that were created using the marker editor or by interacting with the scale
    var eraserButton = new EraserButton( {
      baseColor: 'rgb( 255, 255, 219 )',
      listener: function() {
        //TODO
      }
    } );
    eraserButton.touchArea = eraserButton.localBounds.dilatedXY( 5, 5 );

    var contentNode = new VBox( {
      align: 'right',
      spacing: 10,
      children: [
        new VBox( {
          align: 'left',
          spacing: 0,
          children: [
            new HBox( {
              align: 'center',
              spacing: 10,
              children: [ undoButton, doubleNumberLineNode ]
            } ),
            new HStrut( 725 ) //TODO temporary solution for uniform width
          ]
        } ),
        eraserButton
      ]
    } );

    AccordionBox.call( this, contentNode, options );

    // @private
    this.disposeDoubleNumberLineAccordionBox = function() {
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
