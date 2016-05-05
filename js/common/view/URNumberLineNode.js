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
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var doubleNumberLineString = require( 'string!UNIT_RATES/DoubleNumberLine' );

  // constants
  var BUTTON_CONTENT = new Text( '+', { font: new PhetFont( 18 ), fontWeight: 'bold', maxWidth: 30 } );

  var GRAPH_BUTTON_SPACING = 10; // horizontal space from button to graph y-axis line
  var GRAPH_WIDTH = 575;
  var GRAPH_HEIGHT = 75;
  var GRAPH_X_AXIS_OFFSET = 10; // offset from origin for the two x-axes
  var GRAPH_ARROW_SIZE = 4;
  var GRAPH_ARROW_LABEL_MARGIN = 10;  // horizontal space from arrows to the labels
  var GRAPH_ARROW_LABEL_OPTIONS = { font: new PhetFont( 14 ), maxWidth: 100 };

  /**
   * @param {NumberLine} numberLine
   * @param {Object} [options]
   * @constructor
   */
  function URNumberLineNode( numberLine, options ) {

    options = options || {};

    var self = this;

    // @protected
    this.expandedProperty = new Property( true );

    this.numberLine = numberLine;

    // AccordionBox content
    var contentNode = new Node();

    // manual add buttons

    // @protected
    this.topAddButton = new RectangularPushButton( {
      content:BUTTON_CONTENT,
      baseColor: URConstants.EDIT_CONTROL_COLOR
    } );
    contentNode.addChild( this.topAddButton );

     // @protected
    this.bottomAddButton = new RectangularPushButton( {
      content: BUTTON_CONTENT,
      baseColor: URConstants.EDIT_CONTROL_COLOR,
      left: this.topAddButton.left,
      top: this.topAddButton.top + GRAPH_HEIGHT
    } );
    contentNode.addChild( this.bottomAddButton );

    // @protected graph bounds
    this.graphBounds = new Bounds2(
      this.bottomAddButton.right + GRAPH_BUTTON_SPACING,
      this.topAddButton.top,
      GRAPH_WIDTH,
      this.bottomAddButton.right + GRAPH_BUTTON_SPACING + GRAPH_HEIGHT);

    // layer holding all the markers
    this.graphLayerNode = new Path( new Shape().rect( this.graphBounds.minX, this.graphBounds.minY,
      this.graphBounds.maxX, this.graphBounds.maxY ), {
      //stroke: 'red',  // debugging
      lineWidth: 1
    } );
    contentNode.addChild( this.graphLayerNode );

    // axis lines
    var xOrigin = this.graphBounds.minX;
    var yOrigin = this.graphBounds.centerY;

    var xZeroLine = new Path( new Shape()
        .moveTo( xOrigin, this.topAddButton.top )
        .lineTo( xOrigin, this.bottomAddButton.bottom ), {
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
    // @protected
    this.topArrowLabel = new Text( 'top', _.extend( {}, GRAPH_ARROW_LABEL_OPTIONS, {
        left: topArrowNode.right + GRAPH_ARROW_LABEL_MARGIN,
        centerY: topArrowNode.centerY
      } )
     );
    contentNode.addChild( this.topArrowLabel );

    // @protected
    this.bottomArrowLabel = new Text( 'bottom', _.extend( {}, GRAPH_ARROW_LABEL_OPTIONS, {
        left: bottomArrowNode.right + GRAPH_ARROW_LABEL_MARGIN,
        centerY: bottomArrowNode.centerY
      } )
     );
    contentNode.addChild( this.bottomArrowLabel );

    // erase
    var eraserButton = new EraserButton( {
      baseColor: '#f2f2f2',
      left: this.bottomArrowLabel.right,
      top: this.bottomAddButton.bottom + 10,
      listener: function() {
        self.removeAllMarkers();
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
      titleNode: new Text( doubleNumberLineString, { font: URConstants.PANEL_TITLE_FONT } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      contentAlign: 'left',
      contentXMargin: 25,
      contentYMargin: 5
    } );

    this.mutate( options );
  }

  unitRates.register( 'URNumberLineNode', URNumberLineNode );

  return inherit( AccordionBox, URNumberLineNode, {

    /**
     * @param {string} top
     * @param {string} bottom
     * @public
     */
    setLineLabels: function( top, bottom ) {
      this.topArrowLabel.setText( top );
      this.bottomArrowLabel.setText( bottom );
    },

    /**
     * @param {Node} marker
     * @public
     */
    addMarker: function( marker ) {
      this.graphLayerNode.addChild( marker );
    },

    /**
     * @public
     */
    removeAllMarkers: function() {
      this.graphLayerNode.removeAllChildren();
    },

    /**
     * Applies a callback function to each marker in the number line
     * Note: Adding | deleting markers here is not allowed!
     *
     * @param callback function(item)
     * @public
     */
    forEachMarker: function( callback ) {
      this.graphLayerNode.getChildren().forEach( callback );
    },

    /**
     * @public
     */
    reset: function() {
      this.expandedProperty.reset();
    }

  } );  // define

} );  // inherit
