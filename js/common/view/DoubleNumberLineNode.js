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
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Range = require( 'DOT/Range' );
  var Text = require( 'SCENERY/nodes/Text' );

  // sim modules
  var MarkerNode = require( 'UNIT_RATES/common/view/MarkerNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

  /**
   * @param {DoubleNumberLine} doubleNumberLine
   * @param {Property.<number>} unitRateProperty
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineNode( doubleNumberLine, unitRateProperty, options ) {

    options = _.extend( {

      // vertical axis
      verticalAxisLength: 50,
      verticalAxisLineWidth: 1.5,
      verticalAxisColor: 'black',

      // common to both horizontal axes
      horizontalAxisLength: 575,
      horizontalAxisLineWidth: 1.5,
      arrowSize: new Dimension2( 8, 8 ), // size of arrows on axes
      horizontalAxisYSpacing: 20, // {number} vertical spacing between top and bottom axes
      labelFont: new URFont( 14 ), // {Font} for axis labels
      labelColor: 'black', // {Color|string} color of axis labels
      labelMaxWidth: 50, // determined empirically
      labelXSpacing: 12, // horizontal spacing between axis and its label

      // numerator (top) axis
      numeratorAxisColor: 'black', // {Color|string} color of the axis
      numeratorAxisLabel: null, // {string|null} label for the axis
      numeratorFormat: '{0}', // {string} format with '{0}' placeholder for value
      numeratorMaxDecimals: 1, // {number} maximum number of decimal places
      numeratorTrimZeros: false, // {boolean} whether to trim trailing zeros from decimal places

      // denominator (bottom) axis
      denominatorAxisColor: 'black', // {Color|string} color of the axis
      denominatorAxisLabel: null, // {Node|null} label for the axis
      denominatorFormat: '{0}', // {string} format with '{0}' placeholder for value
      denominatorMaxDecimals: 1, // {number} maximum number of decimal places
      denominatorTrimZeros: false, // {boolean} whether to trim trailing zeros from decimal places
      denominatorAxisRange: new Range( 0, 10 ), // {Range} range of axis
      denominatorMajorMarkerDecimals: 0, // {number} number of decimal places for major markers

      // markers
      majorMarkerLength: 50,
      minorMarkerLength: 30,
      majorMarkerColor: 'black',
      minorMarkerColor: 'gray',
      scaleMarkerColor: 'red',
      undoMarkerColor: 'blue',
      questionMarkerColor: 'green'

    }, options );

    Node.call( this );

    var verticalAxis = new Line( 0, 0, 0, options.verticalAxisLength, {
      stroke: options.verticalAxisColor,
      lineWidth: options.verticalAxisLineWidth
    } );
    this.addChild( verticalAxis );

    var numeratorAxisNode = new ArrowNode( 0, 0, options.horizontalAxisLength, 0, {
      fill: options.numeratorAxisColor,
      stroke: null,
      headWidth: options.arrowSize.width,
      headHeight: options.arrowSize.height,
      tailWidth: options.horizontalAxisLineWidth,
      x: verticalAxis.x,
      y: verticalAxis.centerY - ( options.horizontalAxisYSpacing / 2 )
    } );
    this.addChild( numeratorAxisNode );

    if ( options.numeratorAxisLabel ) {
      this.addChild( new Text( options.numeratorAxisLabel, {
        font: options.labelFont,
        fill: options.labelColor,
        maxWidth: options.labelMaxWidth,
        left: numeratorAxisNode.right + options.labelXSpacing,
        centerY: numeratorAxisNode.centerY
      } ) );
    }

    var denominatorAxisNode = new ArrowNode( 0, 0, options.horizontalAxisLength, 0, {
      fill: options.denominatorAxisColor,
      stroke: null,
      headWidth: options.arrowSize.width,
      headHeight: options.arrowSize.height,
      tailWidth: options.horizontalAxisLineWidth,
      y: verticalAxis.centerY + ( options.horizontalAxisYSpacing / 2 )
    } );
    this.addChild( denominatorAxisNode );

    if ( options.denominatorAxisLabel ) {
      this.addChild( new Text( options.denominatorAxisLabel, {
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

    //TODO this is duplicated in DoubleNumberLineAccordionBox
    // maps the denominator to a horizontal location on the double number line
    var modelToView = new LinearFunction(
      options.denominatorAxisRange.min, options.denominatorAxisRange.max,
      0, 0.96 * options.horizontalAxisLength );

    var unitRateObserver = function() {
      //TODO
    };
    unitRateProperty.link( unitRateObserver );

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
        var markerNode = new MarkerNode( denominator * unitRateProperty.value, denominator, {

          // numerator
          numeratorFormat: options.numeratorFormat,
          numeratorMaxDecimals: options.numeratorMaxDecimals,
          numeratorTrimZeros: options.numeratorTrimZeros,

          // denominator
          denominatorFormat: options.denominatorFormat,
          denominatorMaxDecimals: options.denominatorMaxDecimals,
          denominatorTrimZeros: options.denominatorTrimZeros,

          // location
          centerX: modelToView( denominator ),
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
      unitRateProperty.unlink( unitRateObserver );
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
