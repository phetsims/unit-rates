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
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var doubleNumberLineString = require( 'string!UNIT_RATES/doubleNumberLine' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function URNumberLineNode( options ) {

     options = _.extend( {
      graphWidth:         675,
      graphHeight:        160,
      xAxisOffset:        10,
      yAxisOffset:        0,
      axisArrowSize:      5,
      axisLabelSpacing:   10,
      axisLabelFont:      new PhetFont( 14 ),
      axisLabelMaxWidth:  100
    }, options || {} );

    var self = this;

    // @protected
    this.expandedProperty = new Property( true );

    // AccordionBox content
    var contentNode = new Node();

    // @protected graph origin/bounds
    this.origin      = new Vector2( options.yAxisOffset, options.graphHeight / 2 );
    this.graphBounds = new Bounds2( -options.yAxisOffset, 0, options.graphWidth - options.yAxisOffset , options.graphHeight );

    // layer holding all the markers
    this.graphMarkerLayerNode = new Path( new Shape().rect(
      0, 0, options.graphWidth, options.graphHeight ), {
      //stroke: 'red',  // debugging
      lineWidth: 1
    } );
    contentNode.addChild( this.graphMarkerLayerNode );

    // axis lines
    var xZeroLine = new Path( new Shape()
        .moveTo( options.yAxisOffset, this.origin.y + options.graphHeight / 5 )
        .lineTo( options.yAxisOffset, this.origin.y - options.graphHeight / 5 ), {
      stroke: 'black',
      lineWidth: 1.25
    } );
    contentNode.addChild( xZeroLine );

    var arrowOptions =  {
        headHeight: options.axisArrowSize,
        headWidth:  options.axisArrowSize,
        tailWidth:  .1,
        fill:       'black'
      };
    var topArrowNode = new ArrowNode( options.yAxisOffset,
                                      this.origin.y - options.xAxisOffset,
                                      options.graphWidth + options.axisArrowSize,
                                      this.origin.y - options.xAxisOffset, arrowOptions);
    contentNode.addChild( topArrowNode );

    var bottomArrowNode = new ArrowNode( options.yAxisOffset,
                                         this.origin.y + options.xAxisOffset,
                                         options.graphWidth + options.axisArrowSize,
                                         this.origin.y + options.xAxisOffset, arrowOptions);
    contentNode.addChild( bottomArrowNode );

    // arrow labels
    var labelOptions =  { font:options.axisLabelFont, maxWidth: options.axisLabelMaxWidth };

    // @protected
    this.topArrowLabel = new Text( 'top', _.extend( {}, labelOptions, {
        left: topArrowNode.right + options.axisLabelSpacing,
        centerY: topArrowNode.centerY
      } )
     );
    contentNode.addChild( this.topArrowLabel );

    // @protected
    this.bottomArrowLabel = new Text( 'bottom', _.extend( {}, labelOptions, {
        left: bottomArrowNode.right + options.axisLabelSpacing,
        centerY: bottomArrowNode.centerY
      } )
     );
    contentNode.addChild( this.bottomArrowLabel );

    // erase
    var eraserButton = new EraserButton( {
      baseColor: '#f2f2f2',
      left: this.bottomArrowLabel.right,
      top: options.graphHeight,
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
      contentXMargin: 5,
      contentYMargin: 5,
      contentYSpacing: 5
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
      this.graphMarkerLayerNode.addChild( marker );
    },

    /**
     * @public
     */
    removeAllMarkers: function() {
      this.graphMarkerLayerNode.removeAllChildren();
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
     * @public
     */
    reset: function() {
      this.expandedProperty.reset();
      this.removeAllMarkers();
    }

  } );  // define

} );  // inherit
