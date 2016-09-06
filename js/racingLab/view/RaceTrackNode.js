
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
  var RacingLabConstants = require( 'UNIT_RATES/racingLab/RacingLabConstants' );
  var FinishFlagNode = require( 'UNIT_RATES/racingLab/view/FinishFlagNode' );
  var TimerNode = require( 'UNIT_RATES/racingLab/view/TimerNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Shape = require( 'KITE/Shape' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  //var Property = require( 'AXON/Property' );

  // images
  var greenFlagImage = require( 'image!UNIT_RATES/green_flag.png' );
  var checkerFlagImage = require( 'image!UNIT_RATES/checker_flag.png' );

  // strings
  var miString = require( 'string!UNIT_RATES/mi' );

  // constants
  var TRACK_BOTTOM_OFFSET      = 25;
  var TRACK_DARK_STROKE_COLOR  = 'rgba(0, 0, 0, 1.0)';
  var TRACK_LITE_STROKE_COLOR  = 'rgba(0, 0, 0, 0.25)';
  var TRACK_LINE_WIDTH         = 1.5;
  var MARKER_DARK_FILL_COLOR   = 'rgba(255, 255, 0, 1.0)';
  var MARKER_LITE_FILL_COLOR   = 'rgba(255, 255, 0, 0.25)';
  var MARKER_SIZE              = 10;
  var MARKER_LINE_WIDTH        = 1.0;
  var MILEAGE_FONT             = new PhetFont( 12 );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RaceTrackNode( elpasedTimeProperty, options ) {

     options = _.extend( {
      trackDistance:        RacingLabConstants.MAX_TRACK_DISTANCE,        // track distance in miles
      trackInterval:        RacingLabConstants.TRACK_INTERVAL_DISTANCE,   // interval marker in miles
      trackBounds:          new Bounds2( 0, 0, 675, 100 ),                // track bounds in pixels
      timerTitle:           ''                                            // title for the timer when closed
    }, options || {} );

    // @protected all - various coordinates
    this.trackBounds    = options.trackBounds;
    this.trackDistance  = options.trackDistance;
    this.trackInterval  = options.trackInterval;

    // @protected all - various coordinates
    this.origin       = new Vector2( this.trackBounds.minX, this.trackBounds.maxY - TRACK_BOTTOM_OFFSET );
    this.startPoint   = new Vector2( this.origin.x, this.origin.y );
    this.finishPoint  = new Vector2( this.trackBounds.maxX,  this.origin.y );
    this.endPoint     = new Vector2( this.trackBounds.maxX,  this.origin.y );

    this.milesPerPixel = ( this.trackBounds.maxX - this.trackBounds.minX ) / this.trackDistance;
    this.intervalCount = this.trackDistance / this.trackInterval;

    var childNodes = [];

    // @protected - layer holding all the number line markers
    var boundsNode = new Path( new Shape().rect(
      0, 0, this.trackBounds.maxX, this.trackBounds.maxY ), {
      //stroke: 'red',  // debugging
      lineWidth: 1
    } );
    childNodes.push( boundsNode );

    // track lines
    this.startFinishPath = new Path( null, {
      stroke: TRACK_DARK_STROKE_COLOR,
      lineWidth: TRACK_LINE_WIDTH
    } );
    childNodes.push( this.startFinishPath );

    // track lines
    this.finishEndPath = new Path( null, {
        stroke: TRACK_LITE_STROKE_COLOR,
        lineDash: [ 5, 5 ],
        lineWidth: TRACK_LINE_WIDTH
    } );
    childNodes.push( this.finishEndPath );

    this.greenFlagNode = new Image( greenFlagImage, {
      scale:  0.075,
      left:   this.origin.x,
      bottom: this.origin.y
    } );
    childNodes.push( this.greenFlagNode );

    // track interval markers
    this.intervalNodes = [];
    for (var i = 0; i < this.intervalCount; i++) {
      this.intervalNodes[i] =  new Path( new Shape()
          .moveTo( 0, 0 )
          .lineTo( -MARKER_SIZE / 2, MARKER_SIZE )
          .lineTo(  MARKER_SIZE / 2, MARKER_SIZE )
          .lineTo( 0, 0 ),  {
        centerX:    this.origin.x + ( ( i + 1 ) * this.trackInterval * this.milesPerPixel ),
        top:        this.origin.y,
        stroke:     TRACK_DARK_STROKE_COLOR,
        lineWidth:  MARKER_LINE_WIDTH,
        fill:       MARKER_DARK_FILL_COLOR
      } );
      childNodes.push( this.intervalNodes[i] );
    }

    this.checkerFlagNode = new FinishFlagNode( checkerFlagImage, this.finishPoint, {
      imageScale:  0.075,
      bounds: new Bounds2( this.startPoint.x, this.startPoint.y,  this.trackBounds.maxX,  this.trackBounds.maxY )
    } );
    childNodes.push( this.checkerFlagNode );
    this.checkerFlagNode.addDragListeners( null, this.adjustTrack.bind( this ), null );

    this.mileageText = new Text( '', {
      centerX:  this.finishPoint.x,
      top:      this.checkerFlagNode.bottom + MARKER_SIZE,
      font:     MILEAGE_FONT
    } );
    childNodes.push( this.mileageText );

    // timer
    this.timer = new TimerNode( elpasedTimeProperty, {
      centerX:  this.finishPoint.x,
      bottom:   this.checkerFlagNode.top - URConstants.SCREEN_PANEL_SPACING / 2,
      hiddenTimeText: options.timerTitle
    } );
    childNodes.push( this.timer );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = childNodes;

    Node.call( this, options );

    this.adjustTrack();
  }

  unitRates.register( 'RaceTrackNode', RaceTrackNode );

  return inherit( Node, RaceTrackNode, {

    /**
     *
     * @public
     */
    adjustTrack: function() {

      this.finishPoint.x = this.checkerFlagNode.getCurrentPosition().x;

      // adjust track lengths
      this.startFinishPath.setShape( new Shape()
        .moveTo( this.startPoint.x,  this.startPoint.y )
        .lineTo( this.finishPoint.x, this.finishPoint.y )
      );

      this.finishEndPath.setShape( new Shape()
        .moveTo( this.finishPoint.x, this.finishPoint.y )
        .lineTo( this.endPoint.x,    this.endPoint.y )
      );

      // adjust timer location
      this.timer.centerX = this.finishPoint.x;

      // adjust the mileage text & location
      var miles = ( this.finishPoint.x / this.milesPerPixel ).toFixed( 0 );
      this.mileageText.setText( miles + ' ' + miString );
      this.mileageText.centerX = this.finishPoint.x;

      // adjust marker colors
      for (var i = 0; i < this.intervalNodes.length; i++) {
        if( this.intervalNodes[i].centerX > this.finishPoint.x ) {
          this.intervalNodes[i].stroke = TRACK_LITE_STROKE_COLOR;
          this.intervalNodes[i].fill   = MARKER_LITE_FILL_COLOR;
        }
        else {
          this.intervalNodes[i].stroke = TRACK_DARK_STROKE_COLOR;
          this.intervalNodes[i].fill   = MARKER_DARK_FILL_COLOR;
        }
      }
    },

    /**
     *
     * @public
     */
    reset: function() {
    }

  } ); // inherit

} ); // define
