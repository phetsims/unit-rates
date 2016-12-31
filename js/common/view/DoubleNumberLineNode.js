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

  // sim modules
  var MarkerNode = require( 'UNIT_RATES/common/view/MarkerNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
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
      arrowSize: new Dimension2( 8, 8 ),
      horizontalAxisYSpacing: 20, // vertical spacing between top and bottom axes
      labelXSpacing: 12, // horizontal spacing between axis and its label
      
      // top horizontal axis
      numeratorAxisLabel: null, // {Node|null} label on the top axis
      numeratorAxisColor: 'black',
      
      // bottom horizontal axis
      denominatorAxisLabel: null, // {Node|null} label on the bottom axis
      denominatorMaxDecimals: 1, // {number} maximum number of decimal places for the bottom axis
      denominatorAxisRange: new Range( 0, 10 ), // {Range} of the bottom axis
      denominatorAxisColor: 'black',
      denominatorMajorMarkerDecimals: 1,

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
      this.addChild( options.numeratorAxisLabel );
      options.numeratorAxisLabel.left = numeratorAxisNode.right + options.labelXSpacing;
      options.numeratorAxisLabel.centerY = numeratorAxisNode.centerY;
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
      this.addChild( options.denominatorAxisLabel );
      options.denominatorAxisLabel.left = denominatorAxisNode.right + options.labelXSpacing;
      options.denominatorAxisLabel.centerY = denominatorAxisNode.centerY;
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
