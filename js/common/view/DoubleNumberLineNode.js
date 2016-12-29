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
  var Range = require( 'DOT/Range' );

  // sim modules
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
      verticalAxisColor: 'black',
      verticalAxisLineWidth: 1.5,
      
      // common to both horizontal axes
      horizontalAxisLength: 575,
      horizontalAxisLineWidth: 1.5,
      arrowSize: new Dimension2( 8, 8 ),
      horizontalAxisYSpacing: 20, // vertical spacing between top and bottom axes
      labelXSpacing: 12, // horizontal spacing between axis and its label
      
      // top horizontal axis
      topAxisLabel: null, // {Node|null} label on the top axis
      topAxisColor: 'black',
      
      // bottom horizontal axis
      bottomAxisLabel: null, // {Node|null} label on the bottom axis
      bottomAxisMaxDecimals: 1, // {number} maximum number of decimal places for the bottom axis
      bottomAxisRange: new Range( 0, 10 ), // {Range} of the bottom axis
      bottomAxisColor: 'black'

    }, options );

    Node.call( this );

    var verticalAxis = new Line( 0, 0, 0, options.verticalAxisLength, {
      stroke: options.verticalAxisColor,
      lineWidth: options.verticalAxisLineWidth
    } );
    this.addChild( verticalAxis );

    var topAxisNode = new ArrowNode( 0, 0, options.horizontalAxisLength, 0, {
      fill: options.topAxisColor,
      stroke: null,
      headWidth: options.arrowSize.width,
      headHeight: options.arrowSize.height,
      tailWidth: options.horizontalAxisLineWidth,
      x: verticalAxis.x,
      y: verticalAxis.centerY - ( options.horizontalAxisYSpacing / 2 )
    } );
    this.addChild( topAxisNode );
    
    if ( options.topAxisLabel ) {
      this.addChild( options.topAxisLabel );
      options.topAxisLabel.left = topAxisNode.right + options.labelXSpacing;
      options.topAxisLabel.centerY =  topAxisNode.centerY;
    }

    var bottomAxisNode = new ArrowNode( 0, 0, options.horizontalAxisLength, 0, {
      fill: options.bottomAxisColor,
      stroke: null,
      headWidth: options.arrowSize.width,
      headHeight: options.arrowSize.height,
      tailWidth: options.horizontalAxisLineWidth,
      y: verticalAxis.centerY + ( options.horizontalAxisYSpacing / 2 )
    } );
    this.addChild( bottomAxisNode );

    if ( options.bottomAxisLabel ) {
      this.addChild( options.bottomAxisLabel );
      options.bottomAxisLabel.left = bottomAxisNode.right + options.labelXSpacing;
      options.bottomAxisLabel.centerY =  bottomAxisNode.centerY;
    }

    this.mutate( options );

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
