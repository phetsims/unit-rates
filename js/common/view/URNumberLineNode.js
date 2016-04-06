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
  var BUTTON_COLOR = 'yellow';

  var GRAPH_BUTTON_SPACING = 10; // horizontal space from button to graph y-axis line
  var GRAPH_WIDTH = 525;
  var GRAPH_HEIGHT = 70;
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

    this.expandedProperty = new Property( true );

    this.numberLine = numberLine;

    var contentNode = new Node();

    // add buttons
    // @protected
    this.addCostButton = new RectangularPushButton( {
      content:BUTTON_CONTENT,
      baseColor: BUTTON_COLOR
    } );
    contentNode.addChild( this.addCostButton );

     // @protected
    this.addUnitButton = new RectangularPushButton( {
      content: BUTTON_CONTENT,
      baseColor: BUTTON_COLOR,
      left: this.addCostButton.left,
      top: this.addCostButton.top + GRAPH_HEIGHT
    } );
    contentNode.addChild( this.addUnitButton );

    // graph bounds
    this.graphBounds = new Bounds2(
      this.addUnitButton.right + GRAPH_BUTTON_SPACING,
      this.addCostButton.top,
      GRAPH_WIDTH - GRAPH_ARROW_SIZE,
      this.addUnitButton.right + GRAPH_BUTTON_SPACING + GRAPH_HEIGHT);

    // layer holding all the markers
    this.graphLayerNode = new Path( new Shape().rect( this.graphBounds.minX, this.graphBounds.minY,
      this.graphBounds.maxX, this.graphBounds.maxY ), {
      //fill: 'lightgrey',
      //stroke: 'red',
      lineWidth: 1
    } );
    contentNode.addChild( this.graphLayerNode );

    // lines
    var xOrigin = this.graphBounds.minX;
    var yOrigin = this.graphBounds.centerY;

    var xZeroLine = new Path( new Shape()
        .moveTo( xOrigin, this.addCostButton.top )
        .lineTo( xOrigin, this.addUnitButton.bottom ), {
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
      top: this.addUnitButton.bottom + 10,
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
      titleNode: new Text( doubleNumberLineString, { font: ShoppingConstants.PANEL_TITLE_FONT } ),
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
     * @param {number} position - [0 - 1]
     * @param {Object} [options]
     * @public
     */
    addMarker: function( marker, position, options ) {

      options = _.extend( {
      }, options || {} );

      assert && assert( ( position >= 0 && position <= 1 ), 'Marker position off the number line.' );

      // local position
      var x = this.graphBounds.maxX * position + ( 1.0 - position ) * this.graphBounds.minX;
      var y = this.graphBounds.centerY;

      // new graph marker
      var markerNode = new Node( {
        centerX: x,
        centerY: y,
        children: [ marker ]
      } );

      this.graphLayerNode.addChild( markerNode );
    },

    /**
     * @public
     */
    removeAllMarkers: function() {
        this.graphLayerNode.removeAllChildren();
    },

    /**
     * @public
     */
    reset: function() {
      this.expandedProperty.reset();
    }

  } );  // define

} );  // inherit
