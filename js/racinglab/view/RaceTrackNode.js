// Copyright 2017-2019, University of Colorado Boulder

/**
 * Displays a complete race track in the 'Racing Lab' screen, including:
 * - track
 * - start and finish flags
 * - race car
 * - timer
 *
 * The starting line flag is at x = 0.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const RaceTimerNode = require( 'UNIT_RATES/racinglab/view/RaceTimerNode' );
  const Shape = require( 'KITE/Shape' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URFont = require( 'UNIT_RATES/common/URFont' );
  const Utils = require( 'DOT/Utils' );

  // images
  const finishFlagImage = require( 'image!UNIT_RATES/finish_flag.png' );
  const startFlagImage = require( 'image!UNIT_RATES/start_flag.png' );

  // strings
  const milesString = require( 'string!UNIT_RATES/miles' );
  const pattern0Value1UnitsString = require( 'string!UNIT_RATES/pattern_0value_1units' );

  // constants
  const NEGATIVE_TRACK_LENGTH = 65; // length of track to left of starting flag, in view coordinates
  const CUE_ARROW_LENGTH = 28; // length of the 'drag cue' arrows around the finish flag
  const CUE_ARROW_OPTIONS = {
    fill: 'rgb( 33, 190, 156 )',
    lineWidth: 0.5,
    headWidth: 20,
    headHeight: 16,
    tailWidth: 7
  };
  const TRACK_MARKER_SIDE_LENGTH = 5;
  const TRACK_MARKER_OPTIONS = {
    fill: 'black',
    stroke: null
  };

  /**
   * @param {RaceCar} car
   * @param {Property.<boolean>} timerExpandedProperty
   * @param {Property.<boolean>} arrowsVisibleProperty - are the 'drag cue' arrows are visible?
   * @param {Object} [options]
   * @constructor
   */
  function RaceTrackNode( car, timerExpandedProperty, arrowsVisibleProperty, options ) {

    options = merge( {
      trackViewLength: 1000, // {number} view length of the track
      timerTitleString: '' // {string} title for the timer accordion box
    }, options );

    // maps 'miles' between model and view coordinate frames
    const modelToView = new LinearFunction( 0, car.track.maxLength, 0, options.trackViewLength );

    // Dashed line shows the maximum track length, revealed when the track is shortened.
    const dashedLineNode = new Line( 0, 0, options.trackViewLength, 0, {
      stroke: 'gray',
      lineWidth: 0.5,
      lineDash: [ 5, 5 ]
    } );

    // Solid line shows the actual track length.
    const solidLineNode = new Line( -NEGATIVE_TRACK_LENGTH, 0, options.trackViewLength, 0, {
      stroke: 'black',
      lineWidth: 1
    } );

    // markers below the track
    const markerNodes = [];
    for ( let x = 0; x <= car.track.maxLength; ) {

      // create marker
      const markerNode = createMarkerNode();
      markerNodes.push( markerNode );

      // position marker
      markerNode.centerX = modelToView( x );
      markerNode.top = solidLineNode.bottom;

      // next marker
      x = x + car.track.markerSpacing;
    }
    const markersParent = new Node( { children: markerNodes } );
    markersParent.top = solidLineNode.centerY;

    // Flag at starting line
    const startFlagNode = new Image( startFlagImage, {
      scale: 0.5,
      left: 0,
      bottom: 0
    } );

    // Flag at finish line
    const finishFlagNode = new Image( finishFlagImage, {
      cursor: 'pointer',
      scale: 0.5,
      left: modelToView( car.track.lengthProperty.value ),
      bottom: 0
    } );
    finishFlagNode.touchArea = finishFlagNode.localBounds.dilatedX( 30 );
    finishFlagNode.mouseArea = finishFlagNode.localBounds.dilatedX( 30 );

    // green arrows around the finish flag, cues the user to drag the flag
    const cueArrowsNode = new HBox( {
      cursor: 'pointer',
      spacing: 9,
      children: [
        new ArrowNode( 0, 0, -CUE_ARROW_LENGTH, 0, CUE_ARROW_OPTIONS ),
        new ArrowNode( 0, 0, CUE_ARROW_LENGTH, 0, CUE_ARROW_OPTIONS )
      ],
      centerX: finishFlagNode.left,
      bottom: finishFlagNode.bottom - 2
    } );

    // Timer, dispose required
    const timerNode = new RaceTimerNode( car.timeProperty, timerExpandedProperty, options.timerTitleString );

    // Label that indicates the length of the track
    const lengthNode = new Text( '', {
      font: new URFont( 12 ),
      maxWidth: timerNode.width // i18n
    } );

    // Car
    const carNode = new Image( car.image, {
      scale: 0.5,
      right: startFlagNode.left,
      bottom: solidLineNode.top
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ dashedLineNode, solidLineNode, markersParent,
      startFlagNode, finishFlagNode, timerNode, lengthNode, cueArrowsNode, carNode ];

    // Synchronize track length with the model
    const lengthObserver = function( length ) {

      const finishX = modelToView( length );

      // adjust track length
      solidLineNode.setLine( -NEGATIVE_TRACK_LENGTH, 0, finishX, 0 );

      // flag at finish line
      finishFlagNode.left = finishX;
      finishFlagNode.bottom = solidLineNode.centerY;

      // timer above finish flag
      timerNode.centerX = finishX;
      timerNode.bottom = finishFlagNode.top - 3;

      // distance label below finish flag
      lengthNode.text = StringUtils.format( pattern0Value1UnitsString, length, milesString );
      lengthNode.top = solidLineNode.bottom + TRACK_MARKER_SIDE_LENGTH + 4;
      lengthNode.centerX = finishX;

      // grey out markers that are past finish line
      for ( let i = 0; i < markerNodes.length; i++ ) {
        const enabled = ( i * car.track.markerSpacing <= length );
        markerNodes[ i ].opacity = ( enabled ? 1 : 0.4 );
      }
    };
    car.track.lengthProperty.link( lengthObserver ); // unlink in dispose

    Node.call( this, options );

    // {number} where the drag started relative to the finish flag's current location, in parent view coordinates
    let startDragXOffset;

    // Drag the finish flag to change the track length
    const dragHandler = new SimpleDragHandler( {

      // allow touch swipes across a bag to pick it up
      allowTouchSnag: true,

      /**
       * Called when a drag sequence starts.
       * @param {SceneryEvent} event
       * @param {Trail} trail
       */
      start: function( event, trail ) {

        // compute offset from current track length
        startDragXOffset = finishFlagNode.globalToParentPoint( event.pointer.point ).x -
                           modelToView( car.track.lengthProperty.value );
      },

      /**
       * Called when the pointer moves during a drag sequence.
       * @param {SceneryEvent} event
       * @param {Trail} trail
       */
      drag: function( event, trail ) {

        // hide the 'drag cue' arrows
        arrowsVisibleProperty.value = false;

        // compute track length in view coordinates
        const viewLength = finishFlagNode.globalToParentPoint( event.pointer.point ).x - startDragXOffset;

        // convert to model coordinates, constrain to the track length range
        const modelLength = Utils.clamp( modelToView.inverse( viewLength ), 0, car.track.maxLength );

        // update the model, constrain to integer values
        car.track.lengthProperty.value = Utils.toFixedNumber( modelLength, 0 );
      }
    } );
    finishFlagNode.addInputListener( dragHandler );
    cueArrowsNode.addInputListener( dragHandler );

    // Synchronize car location with model
    // unlink not needed, exists for sim lifetime
    car.distanceProperty.link( function( distance ) {
      carNode.right = modelToView( distance );
    } );

    // unlink not needed, exists for sim lifetime
    arrowsVisibleProperty.link( function( visible ) {
      cueArrowsNode.visible = visible;
    } );
  }

  unitRates.register( 'RaceTrackNode', RaceTrackNode );

  /**
   * Creates a track marker, an equilateral triangle, with origin at tip.
   * @returns {Node}
   */
  function createMarkerNode() {

    const markerShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( TRACK_MARKER_SIDE_LENGTH / 2, TRACK_MARKER_SIDE_LENGTH )
      .lineTo( -TRACK_MARKER_SIDE_LENGTH / 2, TRACK_MARKER_SIDE_LENGTH )
      .close();

    return new Path( markerShape, TRACK_MARKER_OPTIONS );
  }

  return inherit( Node, RaceTrackNode );
} );
