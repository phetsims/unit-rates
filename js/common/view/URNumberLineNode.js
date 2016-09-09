// Copyright 2002-2016, University of Colorado Boulder

/**
 * Base class for all number line nodes in the simulation. Base functionality includes, drawing and labeling the
 * double axes managing a current list of number line markers.
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
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function URNumberLineNode( options ) {

     options = _.extend( {
      numberLineTitle:    '',
      graphWidth:         675,
      graphHeight:        130,
      xAxisOffset:        10,
      yAxisOffset:        0,
      axisArrowSize:      5,
      axisLabelSpacing:   10,
      axisLabelFont:      new PhetFont( 14 ),
      axisLabelMaxWidth:  75
    }, options || {} );

    var self = this;

    // @protected - controls the accordian box expansion
    this.expandedProperty = new Property( true );

    // @protected - the accordian box content
    this.contentNode = new Node();

    // @public (read-only) graph origin & bounds
    this.origin      = new Vector2( options.yAxisOffset, options.graphHeight / 2 );
    this.graphBounds = new Bounds2( -options.yAxisOffset, 0, options.graphWidth - options.yAxisOffset , options.graphHeight );

    // @protected - layer holding all the number line markers
    this.graphMarkerLayerNode = new Path( new Shape().rect(
      0, 0, options.graphWidth, options.graphHeight ), {
      //stroke: 'red',  // debugging
      lineWidth: 1
    } );
    this.contentNode.addChild( this.graphMarkerLayerNode );

    // axis lines
    var xZeroLine = new Path( new Shape()
        .moveTo( options.yAxisOffset, this.origin.y + options.graphHeight / 5 )
        .lineTo( options.yAxisOffset, this.origin.y - options.graphHeight / 5 ), {
      stroke: 'black',
      lineWidth: 1.25
    } );
    this.contentNode.addChild( xZeroLine );

    // arrow options
    var arrowOptions =  {
        headHeight: options.axisArrowSize,
        headWidth:  options.axisArrowSize,
        tailWidth:  .1,
        fill:       'black'
      };

    // @protected
    this.topArrowNode = new ArrowNode( options.yAxisOffset,
                                      this.origin.y - options.xAxisOffset,
                                      options.graphWidth + options.axisArrowSize,
                                      this.origin.y - options.xAxisOffset, arrowOptions);
    this.contentNode.addChild( this.topArrowNode );

    // @protected
    this.bottomArrowNode = new ArrowNode( options.yAxisOffset,
                                         this.origin.y + options.xAxisOffset,
                                         options.graphWidth + options.axisArrowSize,
                                         this.origin.y + options.xAxisOffset, arrowOptions);
    this.contentNode.addChild( this.bottomArrowNode );

    // arrow labels
    var labelOptions = { font:options.axisLabelFont, maxWidth:options.axisLabelMaxWidth };

    // @protected
    this.topArrowLabel = new Text( 'top', _.extend( {}, labelOptions, {
        left: this.topArrowNode.right + options.axisLabelSpacing,
        centerY: this.topArrowNode.centerY
      } )
     );
    this.contentNode.addChild( this.topArrowLabel );

    // @protected
    this.bottomArrowLabel = new Text( 'bottom', _.extend( {}, labelOptions, {
        left: this.bottomArrowNode.right + options.axisLabelSpacing,
        centerY: this.bottomArrowNode.centerY
      } )
     );
    this.contentNode.addChild( this.bottomArrowLabel );

    // erase
    var eraserButton = new EraserButton( {
      baseColor: URConstants.DEFAULT_BUTTON_COLOR,
      left: this.bottomArrowLabel.right,
      top: options.graphHeight,
      listener: function() {
        self.removeAllMarkers();
      }
    });
    this.contentNode.addChild( eraserButton );

    this.graphMarkerLayerNode.moveToFront();

    AccordionBox.call( this, this.contentNode, {
      expandedProperty: this.expandedProperty,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 15,
      titleNode: new Text( options.numberLineTitle, { font: URConstants.PANEL_TITLE_FONT } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      contentAlign: 'left',
      contentXMargin: 5,
      contentYMargin: 5,
      contentYSpacing: 5
    } );

    this.mutate( options );
  }

  unitRates.register( 'URNumberLineNode', URNumberLineNode );

  return inherit( AccordionBox, URNumberLineNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Sets dimensions of the number line
     * @param {number} width
     * @param {number} height
     * @public
     */
    setDimensions: function( width, height ) {
    },

    /**
     * Sets the top & bottom axis labels (on the far right of the number line)
     * @param {string} topLabel
     * @param {string} bottomLabel
     * @public
     */
    setLineLabels: function( topLabel, bottomLabel ) {
      this.topArrowLabel.setText( topLabel );
      this.bottomArrowLabel.setText( bottomLabel );
    },

    /**
     * Adds a marker to the number line
     * @param {Node} marker
     * @public
     */
    addMarker: function( marker ) {
      this.graphMarkerLayerNode.addChild( marker );
    },

    /**
     * Removes all markers from the number line
     * @public
     */
    removeAllMarkers: function() {
      this.graphMarkerLayerNode.getChildren().forEach( function( node ) {
        node.dispose();
      } );
      this.graphMarkerLayerNode.removeAllChildren();
    },

    /**
     * Gets all the markers that are currently on the number line
     * @returns {Array}.<Node>
     * @public
     */
    getAllMarkers: function() {
      return this.graphMarkerLayerNode.getChildren();
    },

    /**
     * Applies a callback function to each marker in the number line
     * Note: Adding | deleting markers here is not allowed!
     *
     * @param callback function(item)
     * @public
     */
    forEachMarker: function( callback ) {
      this.graphMarkerLayerNode.getChildren().forEach( callback );
    },

    /**
     * Resets the number line to the defautl state
     * @public
     */
    reset: function() {
      this.expandedProperty.reset();
      this.removeAllMarkers();
    }

  } );  // define

} );  // inherit
