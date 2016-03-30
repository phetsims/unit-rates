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
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Shape = require( 'KITE/Shape' );

  // strings
  var doubleNumberLineString = require( 'string!UNIT_RATES/DoubleNumberLine' );

  // constants
  var BUTTON_CONTENT = new Text( '+', { font: new PhetFont( 18 ), fontWeight: 'bold', maxWidth: 30 } );
  var BUTTON_COLOR = 'yellow';

  var GRAPH_BUTTON_SPACING = 10; // horizontal space from button to graph y-axis line
  var GRAPH_WIDTH = 550;
  var GRAPH_HEIGHT = 70;
  var GRAPH_X_AXIS_OFFSET = 10; // offset from origin for the two x-axes
  var GRAPH_ARROW_SIZE = 3;
  var GRAPH_ARROW_LABEL_MARGIN = 10;  // horizontal space from arrows to the labels
  var GRAPH_ARROW_LABEL_OPTIONS = { font: new PhetFont( 14 ), maxWidth: 100 };

  /**
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineNode( model, options ) {

    options = options || {};

    this.expandedProperty = new Property( true );

    var contentNode = new Node();

    // add buttons
    var addCostButton = new RectangularPushButton( {
      content:BUTTON_CONTENT,
      baseColor: BUTTON_COLOR,
      listener: function() {
        console.log('add Cost');
      }
    } );
    contentNode.addChild( addCostButton );

    var addUnitButton = new RectangularPushButton( {
      content: BUTTON_CONTENT,
      baseColor: BUTTON_COLOR,
      left: addCostButton.left,
      top: addCostButton.top + GRAPH_HEIGHT,
      listener: function() {
        console.log('add Unit');
      }
    } );
    contentNode.addChild( addUnitButton );

    // graph bounds
    this.graphBounds = new Bounds2(
      addUnitButton.right + GRAPH_BUTTON_SPACING,
      addCostButton.top,
      GRAPH_WIDTH - GRAPH_ARROW_SIZE,
      addUnitButton.right + GRAPH_BUTTON_SPACING + GRAPH_HEIGHT);

    /* 4 debugging graphBounds
    var graphBoundsNode = new Path( new Shape().rect(this.graphBounds.minX, this.graphBounds.minY,
      this.graphBounds.maxX, this.graphBounds.maxY), {
      fill: 'grey',
      stroke: 'red',
      lineWidth: 1
    } );
    contentNode.addChild( graphBoundsNode );
    */

    // lines
    var xOrigin = this.graphBounds.minX;
    var yOrigin = this.graphBounds.centerY;

    var xZeroLine = new Path( new Shape()
        .moveTo( xOrigin, addCostButton.top )
        .lineTo( xOrigin, addUnitButton.bottom ), {
      stroke: 'black',
      lineWidth: 1.25
    } );
    contentNode.addChild( xZeroLine );

    var arrowOptions =  {
        headHeight:GRAPH_ARROW_SIZE,
        headWidth: GRAPH_ARROW_SIZE,
        tailWidth: .1,
        fill: 'black'
      };
    var topArrowNode = new ArrowNode( xOrigin, yOrigin - GRAPH_X_AXIS_OFFSET,
      xOrigin + GRAPH_WIDTH, yOrigin - GRAPH_X_AXIS_OFFSET, arrowOptions);
    contentNode.addChild( topArrowNode );

    var bottomArrowNode = new ArrowNode( xOrigin, yOrigin + GRAPH_X_AXIS_OFFSET,
      xOrigin + GRAPH_WIDTH, yOrigin + GRAPH_X_AXIS_OFFSET, arrowOptions);
    contentNode.addChild( bottomArrowNode );

    // arrow labels
    var topArrowLabel = new Text( 'cost', _.extend( {}, GRAPH_ARROW_LABEL_OPTIONS, {
        left: topArrowNode.right + GRAPH_ARROW_LABEL_MARGIN,
        centerY: topArrowNode.centerY
      } )
     );
    contentNode.addChild( topArrowLabel );

    var bottomArrowLabel = new Text( 'unit', _.extend( {}, GRAPH_ARROW_LABEL_OPTIONS, {
        left: bottomArrowNode.right + GRAPH_ARROW_LABEL_MARGIN,
        centerY: bottomArrowNode.centerY
      } )
     );
    contentNode.addChild( bottomArrowLabel );

    // erase
    var eraserButton = new EraserButton( {
      baseColor: '#f2f2f2',
      left: bottomArrowNode.right,
      top: addUnitButton.bottom + 10,
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
      titleNode: new Text( doubleNumberLineString, { font: ShoppingConstants.PANEL_TITLE_FONT } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      contentAlign: 'left',
      contentXMargin: 25,
      contentYMargin: 5
    } );

    this.mutate( options );
  }

  return inherit( AccordionBox, DoubleNumberLineNode, {

    addItem: function() {

    },

    reset: function() {
      this.expandedProperty.reset();
    }

  } );  // define

} );  // inherit
