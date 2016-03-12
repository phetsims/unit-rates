// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );

  // strings
  var numberLineString = require( 'string!UNIT_RATES/numberLine' );

  // constants
  var LINE_WIDTH = 600;
  var LINE_HEIGHT = 80;
  var LINE_AXIS_OFFSET = 15;
  var LINE_ARROW_SIZE = 3;

  var ADD_BUTTON_CONTENT = new Text( '+', { font: new PhetFont( 18 ), fontWeight: 'bold', maxWidth: 30 } );
  var ADD_BUTTON_COLOR = 'yellow';


  /**
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineNode( options ) {

    options = options || {};

    this.expandedProperty = new Property( true );

    var contentNode = new Node();

    // add buttons
    var addCostButton = new RectangularPushButton( {
      content:ADD_BUTTON_CONTENT,
      baseColor: ADD_BUTTON_COLOR,
      listener: function() {
        console.log('add Cost');
      }
    } );
    contentNode.addChild( addCostButton );

    var addItemButton = new RectangularPushButton( {
      content: ADD_BUTTON_CONTENT,
      baseColor: ADD_BUTTON_COLOR,
      left: addCostButton.left,
      top: addCostButton.top + LINE_HEIGHT,
      listener: function() {
        console.log('add Item/Weight');
      }
    } );
    contentNode.addChild( addItemButton );

    // lines
    var zeroMarkerX = addCostButton.right + 10;
    var zeroMarkerY = ( addItemButton.bottom - addCostButton.top ) / 2;

    var zeroMarker = new Path( new Shape()
        .moveTo( zeroMarkerX, addCostButton.top )
        .lineTo( zeroMarkerX, addItemButton.bottom ), {
      stroke: 'black',
      lineWidth: 1.25
    } );
    contentNode.addChild( zeroMarker );

    var arrowOptions =  {
        headHeight:LINE_ARROW_SIZE,
        headWidth: LINE_ARROW_SIZE,
        tailWidth: .1,
        fill: 'black'
      };
    var topArrowNode = new ArrowNode( zeroMarkerX, zeroMarkerY - LINE_AXIS_OFFSET,
      LINE_WIDTH, zeroMarkerY - LINE_AXIS_OFFSET, arrowOptions);
    contentNode.addChild( topArrowNode );

    var bottomArrowNode = new ArrowNode( zeroMarkerX, zeroMarkerY + LINE_AXIS_OFFSET,
      LINE_WIDTH, zeroMarkerY + LINE_AXIS_OFFSET, arrowOptions);
    contentNode.addChild( bottomArrowNode );

    // erase
    var eraserButton = new EraserButton( {
      baseColor: '#f2f2f2',
      left: bottomArrowNode.right,
      top: addItemButton.bottom + 10,
      listener: function() {
        console.log('erase');
      }
    });
    contentNode.addChild( eraserButton );

    AccordionBox.call( this, contentNode, {
      expandedProperty: this.expandedProperty,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 15,
      titleNode: new Text( numberLineString, { font: URConstants.PANEL_TITLE_FONT } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      contentAlign: 'left',
      contentXMargin: 25,
      contentYMargin: 5,
    } );

    this.mutate( options );
  }

  return inherit( AccordionBox, DoubleNumberLineNode, {

    reset: function() {
      this.expandedProperty.reset();
    }

  } );  // define

} );  // inherit
