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
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RaceTrackNode = require( 'UNIT_RATES/racinglab/view/RaceTrackNode' );
  var RacingLabSceneControl = require( 'UNIT_RATES/racinglab/view/RacingLabSceneControl' );
  var RacingLabViewProperties = require( 'UNIT_RATES/racinglab/view/RacingLabViewProperties' );
  var RateAccordionBox = require( 'UNIT_RATES/common/view/RateAccordionBox' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RestartRaceButton = require( 'UNIT_RATES/racinglab/view/RestartRaceButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var StartStopButton = require( 'UNIT_RATES/racinglab/view/StartStopButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );

  // strings
  var doubleNumberLine1String = require( 'string!UNIT_RATES/doubleNumberLine1' );
  var doubleNumberLine2String = require( 'string!UNIT_RATES/doubleNumberLine2' );
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var milesString = require( 'string!UNIT_RATES/miles' );
  var rate1String = require( 'string!UNIT_RATES/rate1' );
  var rate2String = require( 'string!UNIT_RATES/rate2' );
  var timer1String = require( 'string!UNIT_RATES/timer1' );
  var timer2String = require( 'string!UNIT_RATES/timer2' );

  // constants
  var DOUBLE_NUMBER_LINE_AXIS_LENGTH = 582; // determined empirically

  /**
   * @param {RacingLabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function RacingLabScreenView( model, options ) {

    ScreenView.call( this, options );

    var viewProperties = new RacingLabViewProperties();

    var playAreaLayer = new Node();
    this.addChild( playAreaLayer );

    // separate layer for model keypad
    var keypadLayer = new KeypadLayer();
    this.addChild( keypadLayer );

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

    // Scene control (1 vs 2 cars)
    var sceneControl = new RacingLabSceneControl( model.car2.visibleProperty, {
      right: this.layoutBounds.maxX - URConstants.SCREEN_X_MARGIN,
      centerY: this.layoutBounds.centerY
    } );
    playAreaLayer.addChild( sceneControl );

    // Start/stop button
    var startStopButton = new StartStopButton( model.runningProperty, {
      right: sceneControl.left - 20,
      centerY: this.layoutBounds.centerY
    } );
    playAreaLayer.addChild( startStopButton );

    // Restart race button
    var restartRaceButton = new RestartRaceButton( {
      listener: function() {
        model.runningProperty.value = false;
        model.car1.resetRace();
        model.car2.resetRace();
      },
      right: startStopButton.left - 15,
      centerY: startStopButton.centerY
    } );
    playAreaLayer.addChild( restartRaceButton );

    // Rate for car2
    var rateAccordionBox2 = new RateAccordionBox( model.car2.rate, {
      titleString: rate2String,
      expandedProperty: viewProperties.rateExpandedProperty2,
      pickerFont: URConstants.RACING_LAB_PICKER_FONT,
      numeratorRange: URConstants.MILES_RANGE,
      denominatorRange: URConstants.HOURS_RANGE,
      numeratorUnits: milesString,
      denominatorUnits: hoursString,
      numeratorPickerColor: model.car2.color,
      denominatorPickerColor: model.car2.color,
      right: resetAllButton.left - 15,
      bottom: this.layoutBounds.bottom - URConstants.SCREEN_Y_MARGIN
    } );
    playAreaLayer.addChild( rateAccordionBox2 );

    // Rate for car1
    var rateAccordionBox1 = new RateAccordionBox( model.car1.rate, {
      titleString: rate1String,
      expandedProperty: viewProperties.rateExpandedProperty1,
      pickerFont: URConstants.RACING_LAB_PICKER_FONT,
      numeratorRange: URConstants.MILES_RANGE,
      denominatorRange: URConstants.HOURS_RANGE,
      numeratorUnits: milesString,
      denominatorUnits: hoursString,
      numeratorPickerColor: model.car1.color,
      denominatorPickerColor: model.car1.color,
      right: rateAccordionBox2.right,
      top: this.layoutBounds.top + URConstants.SCREEN_Y_MARGIN
    } );
    playAreaLayer.addChild( rateAccordionBox1 );

    // Double number line for car1
    var doubleNumberLineAccordionBox1 = new DoubleNumberLineAccordionBox(
      model.car1.doubleNumberLine, model.car1.markerEditor, keypadLayer, {
        axisViewLength: DOUBLE_NUMBER_LINE_AXIS_LENGTH,
        titleString: doubleNumberLine1String,
        expandedProperty: viewProperties.doubleNumberLineExpandedProperty1,
        indicatorXProperty: model.car1.distanceProperty,
        indicatorColor: model.car1.color,
        left: this.layoutBounds.left + URConstants.SCREEN_X_MARGIN,
        top: this.layoutBounds.top + URConstants.SCREEN_Y_MARGIN
      } );
    playAreaLayer.addChild( doubleNumberLineAccordionBox1 );

    // Double number line for car2
    var doubleNumberLineAccordionBox2 = new DoubleNumberLineAccordionBox(
      model.car2.doubleNumberLine, model.car2.markerEditor, keypadLayer, {
        axisViewLength: DOUBLE_NUMBER_LINE_AXIS_LENGTH,
        titleString: doubleNumberLine2String,
        expandedProperty: viewProperties.doubleNumberLineExpandedProperty2,
        indicatorXProperty: model.car2.distanceProperty,
        indicatorColor: model.car2.color,
        keypadLocation: 'above',
        left: this.layoutBounds.left + URConstants.SCREEN_X_MARGIN,
        bottom: this.layoutBounds.bottom - URConstants.SCREEN_Y_MARGIN
      } );
    playAreaLayer.addChild( doubleNumberLineAccordionBox2 );

    // Track for car1
    var trackNode1 = new RaceTrackNode( model.car1, viewProperties.timerExpandedProperty1, viewProperties.arrowsVisibleProperty, {
      timerTitleString: timer1String,
      trackViewLength: DOUBLE_NUMBER_LINE_AXIS_LENGTH,
      x: this.globalToLocalPoint( doubleNumberLineAccordionBox1.getGlobalOrigin() ).x, // aligned with double number line
      bottom: this.layoutBounds.centerY - 5
    } );
    playAreaLayer.addChild( trackNode1 );

    // Track for car2
    var trackNode2 = new RaceTrackNode( model.car2, viewProperties.timerExpandedProperty2, viewProperties.arrowsVisibleProperty, {
      timerTitleString: timer2String,
      trackViewLength: DOUBLE_NUMBER_LINE_AXIS_LENGTH,
      x: this.globalToLocalPoint( doubleNumberLineAccordionBox2.getGlobalOrigin() ).x, // aligned with double number line
      top: this.layoutBounds.centerY + 5
    } );
    playAreaLayer.addChild( trackNode2 );

    // car1 should always be visible
    assert && assert( model.car1.visibleProperty.value, 'car1 should be visible' );
    model.car1.visibleProperty.lazyLink( function( visible ) {
      assert && assert( model.car1.visibleProperty.value, 'car1 visibility should never change' );
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
        restartRaceButton.enabled = ( distance1 !== 0 || distance2 !== 0 );
      } );
  }

  unitRates.register( 'RacingLabScreenView', RacingLabScreenView );

  return inherit( ScreenView, RacingLabScreenView );
} );

