// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DoubleNumberLineAccordionBox = require( 'UNIT_RATES/common/view/DoubleNumberLineAccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadLayer = require( 'UNIT_RATES/common/view/KeypadLayer' );
  var MilesPerHourAccordionBox = require( 'UNIT_RATES/racinglab/view/MilesPerHourAccordionBox' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RaceTrackNode = require( 'UNIT_RATES/racinglab/view/RaceTrackNode' );
  var RacingLabSceneControl = require( 'UNIT_RATES/racinglab/view/RacingLabSceneControl' );
  var RacingLabViewProperties = require( 'UNIT_RATES/racinglab/view/RacingLabViewProperties' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RestartRaceButton = require( 'UNIT_RATES/racinglab/view/RestartRaceButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StartStopButton = require( 'UNIT_RATES/racinglab/view/StartStopButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );

  // strings
  var doubleNumberLine1String = require( 'string!UNIT_RATES/doubleNumberLine1' );
  var doubleNumberLine2String = require( 'string!UNIT_RATES/doubleNumberLine2' );
  var rate1String = require( 'string!UNIT_RATES/rate1' );
  var rate2String = require( 'string!UNIT_RATES/rate2' );
  var timer1String = require( 'string!UNIT_RATES/timer1' );
  var timer2String = require( 'string!UNIT_RATES/timer2' );

  // constants
  var BUTTON_X_SPACE = 20; // space between buttons
  var ACCORDION_BOX_X_SPACE = 10; // space between accordion boxes

  /**
   * @param {RacingLabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function RacingLabScreenView( model, options ) {

    ScreenView.call( this, options );

    // Properties that are specific to the view
    var viewProperties = new RacingLabViewProperties();

    // parent for everything expect the keypad
    var playAreaLayer = new Node();
    this.addChild( playAreaLayer );

    // separate layer for model keypad
    var keypadLayer = new KeypadLayer();
    this.addChild( keypadLayer );

    // Double number line for car1
    var doubleNumberLineAccordionBox1 = new DoubleNumberLineAccordionBox(
      model.car1.doubleNumberLine, model.car1.markerEditor, keypadLayer, {
        axisViewLength: URConstants.RACING_LAB_AXIS_LENGTH,
        titleString: doubleNumberLine1String,
        expandedProperty: viewProperties.doubleNumberLineExpandedProperty1,
        indicatorXProperty: model.car1.distanceProperty,
        indicatorColor: model.car1.color,
        keypadLocation: 'below',
        left: this.layoutBounds.left + URConstants.SCREEN_X_MARGIN,
        top: this.layoutBounds.top + URConstants.SCREEN_Y_MARGIN
      } );
    playAreaLayer.addChild( doubleNumberLineAccordionBox1 );

    // Double number line for car2
    var doubleNumberLineAccordionBox2 = new DoubleNumberLineAccordionBox(
      model.car2.doubleNumberLine, model.car2.markerEditor, keypadLayer, {
        axisViewLength: URConstants.RACING_LAB_AXIS_LENGTH,
        titleString: doubleNumberLine2String,
        expandedProperty: viewProperties.doubleNumberLineExpandedProperty2,
        indicatorXProperty: model.car2.distanceProperty,
        indicatorColor: model.car2.color,
        keypadLocation: 'above',
        left: this.layoutBounds.left + URConstants.SCREEN_X_MARGIN,
        bottom: this.layoutBounds.bottom - URConstants.SCREEN_Y_MARGIN
      } );
    playAreaLayer.addChild( doubleNumberLineAccordionBox2 );

    // Rate control for car1
    var rateAccordionBox1 = new MilesPerHourAccordionBox( model.car1.rate, {
      titleString: rate1String,
      expandedProperty: viewProperties.rateExpandedProperty1,
      numeratorPickerColor: model.car1.color,
      denominatorPickerColor: model.car1.color,
      left: doubleNumberLineAccordionBox1.right + ACCORDION_BOX_X_SPACE,
      top: doubleNumberLineAccordionBox1.top
    } );
    playAreaLayer.addChild( rateAccordionBox1 );

    // Rate control for car2
    var rateAccordionBox2 = new MilesPerHourAccordionBox( model.car2.rate, {
      titleString: rate2String,
      expandedProperty: viewProperties.rateExpandedProperty2,
      numeratorPickerColor: model.car2.color,
      denominatorPickerColor: model.car2.color,
      left: doubleNumberLineAccordionBox2.right + ACCORDION_BOX_X_SPACE,
      top: doubleNumberLineAccordionBox2.top
    } );
    playAreaLayer.addChild( rateAccordionBox2 );

    // Track for car1
    var trackNode1 = new RaceTrackNode( model.car1, viewProperties.timerExpandedProperty1, viewProperties.arrowsVisibleProperty, {
      timerTitleString: timer1String,
      trackViewLength: URConstants.RACING_LAB_AXIS_LENGTH,
      x: this.globalToLocalPoint( doubleNumberLineAccordionBox1.getGlobalOrigin() ).x, // aligned with double number line
      bottom: this.layoutBounds.centerY - 10
    } );
    playAreaLayer.addChild( trackNode1 );

    // Track for car2
    var trackNode2 = new RaceTrackNode( model.car2, viewProperties.timerExpandedProperty2, viewProperties.arrowsVisibleProperty, {
      timerTitleString: timer2String,
      trackViewLength: URConstants.RACING_LAB_AXIS_LENGTH,
      x: this.globalToLocalPoint( doubleNumberLineAccordionBox2.getGlobalOrigin() ).x, // aligned with double number line
      top: this.layoutBounds.centerY + ( this.layoutBounds.centerY - trackNode1.bottom )
    } );
    playAreaLayer.addChild( trackNode2 );

    // Scene control (1 vs 2 cars)
    var sceneControl = new RacingLabSceneControl( model.car2.visibleProperty, {
      right: this.layoutBounds.maxX - URConstants.SCREEN_X_MARGIN,
      centerY: this.layoutBounds.centerY
    } );
    playAreaLayer.addChild( sceneControl );

    // Start/Stop button
    var startStopButton = new StartStopButton( model.runningProperty, {
      right: sceneControl.left - BUTTON_X_SPACE,
      centerY: this.layoutBounds.centerY
    } );
    playAreaLayer.addChild( startStopButton );

    // Restart Race button
    var restartRaceButton = new RestartRaceButton( {
      listener: function() {
        model.runningProperty.value = false;
        model.car1.resetRace();
        model.car2.resetRace();
      },
      right: startStopButton.left - BUTTON_X_SPACE,
      centerY: startStopButton.centerY
    } );
    playAreaLayer.addChild( restartRaceButton );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        viewProperties.reset();
      },
      right: this.layoutBounds.maxX - URConstants.SCREEN_X_MARGIN,
      bottom: this.layoutBounds.maxY - URConstants.SCREEN_Y_MARGIN
    } );
    playAreaLayer.addChild( resetAllButton );

    // car1 should always be visible, because the view doesn't doesn't support hiding it. unlink not needed.
    model.car1.visibleProperty.link( function( visible ) {
      assert && assert( model.car1.visibleProperty.value, 'car1 should always be visible' );
    } );

    // Show/hide components related to car2. unlink not needed.
    model.car2.visibleProperty.link( function( visible ) {
      rateAccordionBox2.visible = visible;
      doubleNumberLineAccordionBox2.visible = visible;
      trackNode2.visible = visible;
    } );

    // Disable the restart button when both cars are at the starting line. unmultilink not needed
    Property.multilink( [ model.car1.distanceProperty, model.car2.distanceProperty ],
      function( distance1, distance2 ) {
        restartRaceButton.enabled = !( distance1 === 0 && distance2 === 0 );
      } );
  }

  unitRates.register( 'RacingLabScreenView', RacingLabScreenView );

  return inherit( ScreenView, RacingLabScreenView );
} );

