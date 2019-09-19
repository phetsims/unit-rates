// Copyright 2016-2017, University of Colorado Boulder

/**
 * Displays a double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const MarkerNode = require( 'UNIT_RATES/common/view/MarkerNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Text = require( 'SCENERY/nodes/Text' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URConstants = require( 'UNIT_RATES/common/URConstants' );
  const URFont = require( 'UNIT_RATES/common/URFont' );

  /**
   * @param {DoubleNumberLine} doubleNumberLine
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineNode( doubleNumberLine, options ) {

    var self = this;

    options = _.extend( {

      // common to all axes (horizontal and vertical)
      axisColor: 'black',
      axisLineWidth: 1.5,

      // horizontal axes
      axisViewLength: 1000, // {number} view length of doubleNumberLine's range
      arrowSize: new Dimension2( 8, 8 ), // size of arrows on axes
      axisYSpacing: 20, // {number} vertical spacing between top and bottom axes
      labelFont: new URFont( 14 ), // {Font} for axis labels
      labelColor: 'black', // {Color|string} color of axis labels
      labelMaxWidth: 70, // i18n, determined empirically
      labelXSpacing: 12, // horizontal spacing between axis and its label

      // markers
      majorMarkerLength: URConstants.MAJOR_MARKER_LENGTH,
      minorMarkerLength: URConstants.MINOR_MARKER_LENGTH,

      // Optional position indicator (vertical line).
      // Used in the Racing Lab screen to indicate the current position of the race car.
      indicatorXProperty: null, // {Property.<number>|null} position of vertical indicator line, in model coordinates
      indicatorColor: 'green'

    }, options );

    Node.call( this );

    // @public (read-only)
    this.axisViewLength = options.axisViewLength;

    // All other nodes are positioned relative to this one
    var verticalAxis = new Line( 0, -options.minorMarkerLength / 2, 0, options.minorMarkerLength / 2, {
      stroke: options.axisColor,
      lineWidth: options.axisLineWidth
    } );
    this.addChild( verticalAxis );

    // Double number line's maximum should be just to the left of the axis' arrow head
    var horizontalAxisLength = this.axisViewLength + options.arrowSize.height + 10;

    // numerator axis
    var numeratorAxisNode = new ArrowNode( 0, 0, horizontalAxisLength, 0, {
      fill: options.axisColor,
      stroke: null,
      headWidth: options.arrowSize.width,
      headHeight: options.arrowSize.height,
      tailWidth: options.axisLineWidth,
      x: verticalAxis.x,
      y: verticalAxis.centerY - ( options.axisYSpacing / 2 )
    } );
    this.addChild( numeratorAxisNode );

    // numerator axis label
    this.addChild( new Text( doubleNumberLine.numeratorOptions.axisLabel, {
      font: options.labelFont,
      fill: options.labelColor,
      maxWidth: options.labelMaxWidth,
      left: numeratorAxisNode.right + options.labelXSpacing,
      centerY: numeratorAxisNode.centerY,
      children: [ new HStrut( options.labelMaxWidth ) ] // makes labels for all items the same width
    } ) );

    // denominator axis
    var denominatorAxisNode = new ArrowNode( 0, 0, horizontalAxisLength, 0, {
      fill: options.axisColor,
      stroke: null,
      headWidth: options.arrowSize.width,
      headHeight: options.arrowSize.height,
      tailWidth: options.axisLineWidth,
      y: verticalAxis.centerY + ( options.axisYSpacing / 2 )
    } );
    this.addChild( denominatorAxisNode );

    // denominator axis label
    this.addChild( new Text( doubleNumberLine.denominatorOptions.axisLabel, {
      font: options.labelFont,
      fill: options.labelColor,
      maxWidth: options.labelMaxWidth,
      left: denominatorAxisNode.right + options.labelXSpacing,
      centerY: denominatorAxisNode.centerY,
      children: [ new HStrut( options.labelMaxWidth ) ] // makes labels for all items the same width
    } ) );

    // position indicator (vertical line)
    var indicatorXObserver = null;
    if ( options.indicatorXProperty ) {
      var indicatorNode = new Line( 0, 0, 0, options.axisYSpacing, {
        stroke: options.indicatorColor,
        lineWidth: 4,
        // horizontal position set by indicatorXObserver
        centerY: verticalAxis.centerY
      } );
      this.addChild( indicatorNode );

      indicatorXObserver = function( x ) {
        indicatorNode.centerX = doubleNumberLine.modelToViewNumerator( x, self.axisViewLength );
      };
      options.indicatorXProperty.link( indicatorXObserver ); // unlink in dispose
    }

    // @private parent for markers, to maintain rendering order
    this.markersParent = new Node();
    this.addChild( this.markersParent );

    this.mutate( options );

    // @public (read-only) position for things that are "out of range", halfway between arrows and labels
    this.outOfRangeXOffset = horizontalAxisLength + ( options.labelXSpacing / 2 );

    // when a Marker is added, add a MarkerNode
    var markerAddedListener = function( marker ) {

      // The model may contain markers that don't fit on the view scale
      if ( doubleNumberLine.markerIsInRange( marker ) ) {
        self.addMarkerNode( marker, {
          lineLength: marker.isMajor ? options.majorMarkerLength : options.minorMarkerLength,
          numeratorOptions: doubleNumberLine.numeratorOptions,
          denominatorOptions: doubleNumberLine.denominatorOptions,
          centerX: doubleNumberLine.modelToViewDenominator( marker.denominatorProperty.value, self.axisViewLength ),
          centerY: verticalAxis.centerY
        } );
      }
    };
    doubleNumberLine.markers.addItemAddedListener( markerAddedListener );

    // when a Marker is removed, remove the corresponding MarkerNode
    var markerRemovedListener = function( marker ) {
      self.removeMarkerNode( marker );
    };
    doubleNumberLine.markers.addItemRemovedListener( markerRemovedListener );

    // Add a MarkNode for each initial Marker
    doubleNumberLine.markers.forEach( markerAddedListener.bind( this ) );

    // @private
    this.disposeDoubleNumberLineNode = function() {
      doubleNumberLine.markers.removeItemAddedListener( markerAddedListener );
      doubleNumberLine.markers.removeItemRemovedListener( markerRemovedListener );
      options.indicatorXProperty && options.indicatorXProperty.unlink( indicatorXObserver );
    };
  }

  unitRates.register( 'DoubleNumberLineNode', DoubleNumberLineNode );

  return inherit( Node, DoubleNumberLineNode, {

    // @public
    dispose: function() {
      this.disposeDoubleNumberLineNode();
      Node.prototype.dispose.call( this );
    },

    /**
     * Adds a MarkerNode to the double number line.
     * @param {Marker} marker
     * @param {Object} [options] - MarkerNode constructor options
     * @private
     */
    addMarkerNode: function( marker, options ) {
      unitRates.log && unitRates.log( 'addMarker ' + marker );
      assert && assert( !this.getMarkerNode( marker ), 'already have a MarkerNode for ' + marker );
      var markerNode = new MarkerNode( marker, options );
      this.markersParent.addChild( markerNode );
    },

    /**
     * Removes a MarkerNode from the double number line.
     * @param {Marker} marker
     * @private
     */
    removeMarkerNode: function( marker ) {
      unitRates.log && unitRates.log( 'removeMarker ' + marker );

      // find the node that is associated with the marker
      var markerNode = this.getMarkerNode( marker );

      // the model may contain markers that aren't displayed, because they are outside the range of the view axes
      if ( markerNode ) {
        this.markersParent.removeChild( markerNode );
        markerNode.dispose();
      }
    },

    /**
     * Gets the MarkerNode that is associated with marker.
     * @param {Marker} marker
     * @returns {MarkerNode|null} - null if there is no MarkerNode associated with marker
     * @private
     */
    getMarkerNode: function( marker ) {
      var markerNode = null;
      var markerNodes = this.markersParent.getChildren();
      for ( var i = 0; i < markerNodes.length && !markerNode; i++ ) {
        if ( markerNodes[ i ].marker === marker ) {
          markerNode = markerNodes[ i ];
        }
      }
      return markerNode;
    }
  } );
} );
