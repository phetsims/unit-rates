// Copyright 2016, University of Colorado Boulder

/**
 * Displays a double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );

  // sim modules
  var MarkerNode = require( 'UNIT_RATES/common/view/MarkerNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

  /**
   * @param {DoubleNumberLine} doubleNumberLine
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineNode( doubleNumberLine, options ) {

    options = _.extend( {

      // common to all axes
      axisColor: 'black',
      axisLineWidth: 1.5,

      // vertical axis
      verticalAxisLength: 40,

      // horizontal axes
      arrowSize: new Dimension2( 8, 8 ), // size of arrows on axes
      horizontalAxisYSpacing: 20, // {number} vertical spacing between top and bottom axes
      labelFont: new URFont( 14 ), // {Font} for axis labels
      labelColor: 'black', // {Color|string} color of axis labels
      labelMaxWidth: 50, // determined empirically
      labelXSpacing: 12, // horizontal spacing between axis and its label

      // markers
      majorMarkerLength: 75,
      minorMarkerLength: 40,
      majorMarkerColor: 'black',
      minorMarkerColor: 'gray',
      scaleMarkerColor: 'red',
      undoMarkerColor: 'blue',
      questionMarkerColor: 'green'

    }, options );

    Node.call( this );

    var verticalAxis = new Line( 0, 0, 0, options.verticalAxisLength, {
      stroke: options.axisColor,
      lineWidth: options.axisLineWidth
    } );
    this.addChild( verticalAxis );

    var numeratorAxisNode = new ArrowNode( 0, 0, doubleNumberLine.horizontalAxisLength, 0, {
      fill: options.axisColor,
      stroke: null,
      headWidth: options.arrowSize.width,
      headHeight: options.arrowSize.height,
      tailWidth: options.axisLineWidth,
      x: verticalAxis.x,
      y: verticalAxis.centerY - ( options.horizontalAxisYSpacing / 2 )
    } );
    this.addChild( numeratorAxisNode );

    if ( doubleNumberLine.numeratorOptions.axisLabel ) {
      this.addChild( new Text( doubleNumberLine.numeratorOptions.axisLabel, {
        font: options.labelFont,
        fill: options.labelColor,
        maxWidth: options.labelMaxWidth,
        left: numeratorAxisNode.right + options.labelXSpacing,
        centerY: numeratorAxisNode.centerY
      } ) );
    }

    var denominatorAxisNode = new ArrowNode( 0, 0, doubleNumberLine.horizontalAxisLength, 0, {
      fill: options.axisColor,
      stroke: null,
      headWidth: options.arrowSize.width,
      headHeight: options.arrowSize.height,
      tailWidth: options.axisLineWidth,
      y: verticalAxis.centerY + ( options.horizontalAxisYSpacing / 2 )
    } );
    this.addChild( denominatorAxisNode );

    if ( doubleNumberLine.denominatorOptions.axisLabel ) {
      this.addChild( new Text( doubleNumberLine.denominatorOptions.axisLabel, {
        font: options.labelFont,
        fill: options.labelColor,
        maxWidth: options.labelMaxWidth,
        left: denominatorAxisNode.right + options.labelXSpacing,
        centerY: denominatorAxisNode.centerY
      } ) );
    }

    // parent for markers, to maintain rendering order
    var markersParent = new Node();
    this.addChild( markersParent );

    this.mutate( options );

    var unitRateObserver = function() {
      //TODO
    };
    doubleNumberLine.unitRateProperty.link( unitRateObserver );

    doubleNumberLine.scaleMarkerProperty.link( function( newMarker, oldMarker ) {
       //TODO
      URQueryParameters.log && console.log( 'scaleMarker: add ' + newMarker + ', remove ' + oldMarker );
    } );

    doubleNumberLine.undoMarkerProperty.link( function( newMarker, oldMarker ) {
       //TODO
      URQueryParameters.log && console.log( 'undoMarker: add ' + newMarker + ', remove ' + oldMarker );

      //TODO this is a test, need to keep track of this marker for removal, etc.
      if ( newMarker !== null ) {

        var denominator = newMarker;
        var numerator = denominator * doubleNumberLine.unitRateProperty.value;

        var markerNode = new MarkerNode( numerator, denominator, {
          lineLength: options.majorMarkerLength,
          color: options.majorMarkerColor,
          numeratorOptions: doubleNumberLine.numeratorOptions,
          denominatorOptions: doubleNumberLine.denominatorOptions,
          centerX: doubleNumberLine.modelToView( denominator ),
          centerY: verticalAxis.centerY
        } );
        markersParent.addChild( markerNode );
      }
    } );

    doubleNumberLine.questionMarkers.addItemAddedListener( function( marker ) {
       //TODO
      URQueryParameters.log && console.log( 'questionMarker: add ' + marker );
    } );
    doubleNumberLine.questionMarkers.addItemRemovedListener( function( marker ) {
        //TODO
       URQueryParameters.log && console.log( 'questionMarker: remove ' + marker );
     } );

    doubleNumberLine.otherMarkers.addItemAddedListener( function( marker ) {
       //TODO
      URQueryParameters.log && console.log( 'otherMarker: add' + marker );
    } );
    doubleNumberLine.otherMarkers.addItemRemovedListener( function( marker ) {
       //TODO
      URQueryParameters.log && console.log( 'otherMarker: remove ' + marker );
    } );

    // @private
    this.disposeDoubleNumberLineNode = function() {
      doubleNumberLine.unitRateProperty.unlink( unitRateObserver );
    };
  }

  unitRates.register( 'DoubleNumberLineNode', DoubleNumberLineNode );

  return inherit( Node, DoubleNumberLineNode, {

    // @public
    dispose: function() {
      this.disposeDoubleNumberLineNode();
    }
  } );
} );
