
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
  //var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var TimerNode = require( 'UNIT_RATES/racingLab/view/TimerNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Image = require( 'SCENERY/nodes/Image' );
  //var Text = require( 'SCENERY/nodes/Text' );
  //var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  //var Property = require( 'AXON/Property' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var greenFlagImage = require( 'image!UNIT_RATES/green_flag.png' );
  var checkerFlagImage = require( 'image!UNIT_RATES/checker_flag.png' );

  // strings
  //var miString = require( 'string!UNIT_RATES/mi' );

  // constants
  var TRACK_BOTTOM_OFFSET = 15;
  var DIST_MARKER_SIZE    = 10;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RaceTrackNode( elpasedTimeProperty, options ) {

     options = _.extend( {
      trackDistance:        250,
      trackMarkerInterval:  25,
      trackDimensions:      new Dimension2( 675, 100 ),
      timerText:            ''
    }, options || {} );

    this.trackDimensions = options.trackDimensions;

    this.origin = new Vector2( 0, this.trackDimensions.height - TRACK_BOTTOM_OFFSET );

    // @protected - layer holding all the number line markers
    var boundsNode = new Path( new Shape().rect(
      0, 0, options.trackDimensions.width, options.trackDimensions.height ), {
      stroke: 'red',  // debugging
      lineWidth: 1
    } );

    // track lines
    this.trackLine = new Path( new Shape()
        .moveTo( this.origin.x,  this.origin.y )
        .lineTo( this.trackDimensions.width,  this.origin.y ), {
      stroke: 'black',
      lineWidth: 1.25
    } );

    this.greenFlagNode = new Image( greenFlagImage, {
      scale:  0.075,
      left:   this.origin.x,
      bottom: this.origin.y
    } );

    // track lines
    var distanceMarkerNode = new Path( new Shape()
        .moveTo( 0, 0 )
        .lineTo( -DIST_MARKER_SIZE / 2, DIST_MARKER_SIZE )
        .lineTo(  DIST_MARKER_SIZE / 2, DIST_MARKER_SIZE )
        .lineTo( 0, 0 ),  {
      centerX:    this.origin.x,
      top:        this.origin.y,
      stroke:     'black',
      lineWidth:  1.25,
      fill:       'yellow'
    } );

    this.checkerFlagNode = new Image( checkerFlagImage, {
      scale:  0.075,
      left:   this.trackDimensions.width,
      bottom: this.origin.y
    } );

    // timer
    this.timer = new TimerNode( elpasedTimeProperty, {
      left:  boundsNode.right,
      top:   boundsNode.top,
      hiddenTimeText: 'Timer 1'
    } );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ boundsNode, this.trackLine, distanceMarkerNode, this.greenFlagNode, this.checkerFlagNode, this.timer ];

    Node.call( this, options );
  }

  unitRates.register( 'RaceTrackNode', RaceTrackNode );

  return inherit( Node, RaceTrackNode, {

    /**
     *
     * @public
     */
    reset: function() {
    }

  } ); // inherit

} ); // define
