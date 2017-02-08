// Copyright 2017, University of Colorado Boulder

/**
 * Displays a race track in the 'Racing Lab' screen.
 * The starting line flag is at x = 0.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // sim modules
  var RaceTimerNode = require( 'UNIT_RATES/racinglab/view/RaceTimerNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // images
  var finishFlagImage = require( 'image!UNIT_RATES/finish_flag.png' );
  var startFlagImage = require( 'image!UNIT_RATES/start_flag.png' );

  // strings
  var milesString = require( 'string!UNIT_RATES/miles' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  // constants
  var NEGATIVE_TRACK_LENGTH = 75; // length of track to left of starting flag, in view coordinates
  var MARKER_SIDE_LENGTH = 10;
  
  /**
   * @param {RaceTrack} track - the track model
   * @param {LinearFunction} modelToView
   * @param {Object} [options]
   * @constructor
   */
  function RaceTrackNode( track, modelToView, options ) {

    options = options || {};

    // Dashed line shows the maximum track length, revealed when the track is shortened.
    var maxX = modelToView( track.maxLength );
    var dashedLineNode = new Line( 0, 0, maxX, 0, {
      stroke: 'gray',
      lineWidth: 0.5,
      lineDash: [ 5, 5 ]
    } );

    // Solid line shows the actual track length.
    var solidLineNode = new Line( -NEGATIVE_TRACK_LENGTH, 0, maxX, 0, {
      stroke: 'black',
      lineWidth: 1
    } );

    // markers below the track
    var markersParent = new Node();
    for ( var x = 0; x <= track.maxLength; ) {

      // create marker
      var markerNode = createMarkerNode();
      markersParent.addChild( markerNode );

      // position marker
      markerNode.centerX = modelToView( x );
      markerNode.top = solidLineNode.bottom;

      // next marker
      x = x + track.markerSpacing;
    }
    markersParent.top = solidLineNode.centerY;

    // Flag at starting line
    var startFlagNode = new Image( startFlagImage, {
      scale: 0.5,
      left: 0,
      bottom: 0
    } );

    // Flag at finish line
    var finishFlagNode = new Image( finishFlagImage, {
      scale: 0.5,
      left: modelToView( track.lengthProperty.value ),
      bottom: 0
    } );

    // Timer
    var timerNode = new RaceTimerNode();

    // Label that indicates the length of the track
    var lengthNode = new Text( '', { font: new URFont( 12 ) } );

    //TODO car
    //TODO finish flag drag handler

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ dashedLineNode, solidLineNode, markersParent,
      startFlagNode, finishFlagNode, timerNode, lengthNode ];

    Node.call( this, options );

    // Synchronize track length with the model
    var lengthObserver = function( length ) {

      var finishX = modelToView( length );

      // adjust track length
      solidLineNode.setLine( -NEGATIVE_TRACK_LENGTH, 0, finishX, 0 );

      // flag at finish line
      finishFlagNode.left = finishX;
      finishFlagNode.bottom = solidLineNode.centerY;

      // timer above finish flag
      timerNode.centerX = finishX;
      timerNode.bottom = finishFlagNode.top - 3;

      // distance label below finish flag
      lengthNode.text = StringUtils.format( valueUnitsString, finishX, milesString );
      lengthNode.top = solidLineNode.bottom + MARKER_SIDE_LENGTH + 4;
      lengthNode.centerX = finishX;
    };
    track.lengthProperty.link( lengthObserver ); // unlink in dispose

    // @private
    this.disposeRaceTrackNode = function() {
      track.lengthProperty.unlink( lengthObserver );
    };
  }

  unitRates.register( 'RaceTrackNode', RaceTrackNode );

  /**
   * Creates a track marker, an equilateral triangle, with origin at tip.
   * @returns {Node}
   */
  function createMarkerNode() {
    
    var markerShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( MARKER_SIDE_LENGTH / 2, MARKER_SIDE_LENGTH )
      .lineTo( -MARKER_SIDE_LENGTH / 2, MARKER_SIDE_LENGTH )
      .close();
    
    return new Path( markerShape, {
      stroke: 'black',
      fill: 'yellow'
    } );
  }

  return inherit( Node, RaceTrackNode, {

    // @private
    dispose: function() {
      this.disposeRaceTrackNode();
    }
  } );
} );
