// Copyright 2016, University of Colorado Boulder

/**
 * Node holding all the race track nodes - car, flags, track, mile markers etc.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var FinishFlagNode = require( 'UNIT_RATES/racingLab/view/FinishFlagNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TimerDisplayNode = require( 'UNIT_RATES/racingLab/view/TimerDisplayNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var startFlagImage = require( 'image!UNIT_RATES/start_flag.png' );

  // strings
  var milesString = require( 'string!UNIT_RATES/miles' );

  // constants
  var TRACK_MAX_DISTANCE = 200;   // max track distance in miles
  var TRACK_INTERVAL_DISTANCE = 50;    // yellow interval marker distance
  var TRACK_BOTTOM_OFFSET = 25;    // the height beneath the track, used for the interval markers
  var TRACK_DARK_STROKE_COLOR = 'rgba(0, 0, 0, 1.0)';
  var TRACK_LITE_STROKE_COLOR = 'rgba(0, 0, 0, 0.25)';
  var TRACK_LINE_WIDTH = 1.5;
  var MARKER_DARK_FILL_COLOR = 'rgba(255, 255, 0, 1.0)';
  var MARKER_LITE_FILL_COLOR = 'rgba(255, 255, 0, 0.25)';
  var MARKER_SIZE = 10;    // interval marker size
  var MARKER_LINE_WIDTH = 1.0;
  var MILEAGE_FONT = new PhetFont( 12 );
  var ARROW_LENGTH = 28;
  var ARROW_OPTIONS = {
    fill: 'rgb( 33, 190, 156 )',
    lineWidth: 0.5,
    headWidth: 21,
    headHeight: 18,
    tailWidth: 8
  };

  /**
   * @param {TrackGroup} model
   * @param {string} carImageName
   * @param {Object} [options]
   * @constructor
   */
  function TrackNode( model, carImageName, options ) {

    options = _.extend( {
      trackWidth: 0,        // sets the overall width of the node
      trackHeight: 100,      // sets the overall height of the node
      trackStartOffset: 0,        // the offset of the green start flag
      timerTitle: ''              // title for the timer when closed
    }, options );

    var self = this;

    // @protected - track model
    this.trackGroup = model;

    // @protected - all
    this.trackWidth = options.trackWidth;
    this.trackHeight = options.trackHeight;
    this.trackStartOffset = options.trackStartOffset;

    // @protected - all
    this.trackOrigin = new Vector2( this.trackStartOffset, this.trackHeight - TRACK_BOTTOM_OFFSET );
    this.milesPerPixel = ( this.trackWidth - this.trackStartOffset ) / TRACK_MAX_DISTANCE;
    this.intervalCount = TRACK_MAX_DISTANCE / TRACK_INTERVAL_DISTANCE;

    this.resetTrack();

    var childNodes = [];

    //TODO delete or enable via a query parameter
    /*  // only really used for debugging the bound of the draggable track area
     var boundsNode = new Path( new Shape().rect( 0, 0, this.trackWidth, this.trackHeight ), {
     stroke: 'red',  // debugging
     lineWidth: 1
     } );
     childNodes.push( boundsNode );
     */

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    // track lines - start to finish
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

    // start flag
    this.greenFlagNode = new Image( startFlagImage, {
      scale: 0.5,
      left: this.startPoint.x,
      bottom: this.trackOrigin.y
    } );
    childNodes.push( this.greenFlagNode );

    // race car
    this.carNode = new Image( carImageName, {
      scale: 0.5,
      right: this.greenFlagNode.left,
      bottom: this.trackOrigin.y
    } );
    childNodes.push( this.carNode );

    // track interval markers
    this.intervalNodes = [];
    for ( var i = 0; i < this.intervalCount; i++ ) {
      this.intervalNodes[ i ] = new Path( new Shape()
        .moveTo( 0, 0 )
        .lineTo( -MARKER_SIZE / 2, MARKER_SIZE )
        .lineTo( MARKER_SIZE / 2, MARKER_SIZE )
        .lineTo( 0, 0 ), {
        centerX: this.startPoint.x + ( ( i + 1 ) * TRACK_INTERVAL_DISTANCE * this.milesPerPixel ),
        top: this.startPoint.y,
        stroke: TRACK_DARK_STROKE_COLOR,
        lineWidth: MARKER_LINE_WIDTH,
        fill: MARKER_DARK_FILL_COLOR
      } );
      childNodes.push( this.intervalNodes[ i ] );
    }

    // green arrows around the finish flag
    this.flagArrows = new HBox( {
      spacing: 9,
      children: [
        new ArrowNode( 0, 0, -ARROW_LENGTH, 0, ARROW_OPTIONS ),
        new ArrowNode( 0, 0, ARROW_LENGTH, 0, ARROW_OPTIONS )
      ],
      centerX: this.finishPoint.x,
      bottom: this.trackOrigin.y - 2
    } );
    childNodes.push( this.flagArrows );

    // checkered finish flag
    this.checkerFlagNode = new FinishFlagNode( this.finishPoint,
      new Bounds2( this.startPoint.x, this.startPoint.y, this.trackWidth, this.trackHeight ), {
        imageScale: 0.5
      } );
    childNodes.push( this.checkerFlagNode );
    this.checkerFlagNode.addDragListeners(
      function() {
        self.trackGroup.flagArrowsVisibleProperty.value = false;  // start drag
      },
      this.updateTrack.bind( this ),                            // drag
      null                                                        // end drag
    );

    // mileage text beneath the finish flag
    this.mileageText = new Text( '', {
      centerX: this.finishPoint.x,
      top: this.checkerFlagNode.bottom + MARKER_SIZE + 2,
      font: MILEAGE_FONT,
      maxWidth: 2 * options.trackStartOffset
    } );
    childNodes.push( this.mileageText );

    // timer
    this.timer = new TimerDisplayNode( {
      centerX: this.finishPoint.x,
      bottom: this.checkerFlagNode.top - URConstants.PANEL_SPACING / 2,
      hiddenTimeText: options.timerTitle
    } );
    childNodes.push( this.timer );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = childNodes;

    Node.call( this, options );

    this.updateTrack();

    this.carNode.moveToFront();

    this.trackGroup.flagArrowsVisibleProperty.link( function( value, oldValue ) {
      self.flagArrows.visible = value;
    } );

    this.trackGroup.elapsedTimeProperty.link( function( value, oldValue ) {
      self.updateCarTimer( value );
    } );
  }

  unitRates.register( 'TrackNode', TrackNode );

  return inherit( Node, TrackNode, {

    /**
     * Sets track shapes (solid & dashed grey), positions the interval markers & calculates the finish mileage
     *
     * @public
     */
    updateTrack: function() {

      this.finishPoint.x = this.checkerFlagNode.item.positionProperty.value.x;

      // adjust track lengths
      this.startFinishPath.setShape( new Shape()
        .moveTo( 0, this.finishPoint.y )
        .lineTo( this.finishPoint.x, this.finishPoint.y )
      );
      this.finishEndPath.setShape( new Shape()
        .moveTo( this.finishPoint.x, this.finishPoint.y )
        .lineTo( this.endPoint.x, this.endPoint.y )
      );

      // adjust timer location
      this.timer.centerX = this.finishPoint.x;

      // adjust the mileage text & location
      var miles = Util.roundSymmetric( ( this.finishPoint.x - this.startPoint.x ) / this.milesPerPixel );
      this.mileageText.setText( miles + ' ' + milesString ); //TODO fix i18n, https://github.com/phetsims/unit-rates/issues/59
      this.mileageText.centerX = this.finishPoint.x;
      this.trackGroup.trackMilesProperty.value = miles;

      // adjust marker colors
      for ( var i = 0; i < this.intervalNodes.length; i++ ) {
        if ( this.intervalNodes[ i ].centerX > this.finishPoint.x ) {
          this.intervalNodes[ i ].stroke = TRACK_LITE_STROKE_COLOR;
          this.intervalNodes[ i ].fill = MARKER_LITE_FILL_COLOR;
        }
        else {
          this.intervalNodes[ i ].stroke = TRACK_DARK_STROKE_COLOR;
          this.intervalNodes[ i ].fill = MARKER_DARK_FILL_COLOR;
        }
      }

      this.trackGroup.trackPixelLengthProperty.value = this.finishPoint.x - this.startPoint.x;
    },

    /**
     * Positions the car on teh track and sets the associated timer value
     *
     * @param {number} elapsedTime - the elapsed time in hours
     * @public
     */
    updateCarTimer: function( elapsedTime ) {

      // update the car
      var carPosition = this.greenFlagNode.left + ( this.trackGroup.rateProperty.value * elapsedTime * this.milesPerPixel );
      this.carNode.right = ( carPosition < this.finishPoint.x ? carPosition : this.finishPoint.x );

      // update the timer text
      var timerValue = ( elapsedTime > this.trackGroup.trackHoursProperty.value ? this.trackGroup.trackHoursProperty.value : elapsedTime );
      this.timer.displayValueProperty.value = Util.toFixed( timerValue, 2 ).toString();
    },

    /**
     * Resets the track length to the initial size
     *
     * @protected
     */
    resetTrack: function() {
      this.startPoint = new Vector2( this.trackOrigin.x, this.trackOrigin.y );
      this.finishPoint = new Vector2( this.trackWidth, this.trackOrigin.y );
      this.endPoint = new Vector2( this.trackWidth, this.trackOrigin.y );
    },

    // @public
    reset: function() {
      this.timer.reset();
      this.resetTrack();
      this.checkerFlagNode.item.setPosition( this.finishPoint.x, this.finishPoint.y, false );
      this.updateTrack();
      this.updateCarTimer( 0 );
    }

  } ); // inherit

} ); // define
