// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );

  // sim modules
  var DoubleNumberLineAccordionBox = require( 'UNIT_RATES/common/view/DoubleNumberLineAccordionBox' );
  var KeypadLayer = require( 'UNIT_RATES/common/view/KeypadLayer' );
  var RacingLabSceneControl = require( 'UNIT_RATES/racinglab/view/RacingLabSceneControl' );
  var RacingLabViewProperties = require( 'UNIT_RATES/racinglab/view/RacingLabViewProperties' );
  var RateAccordionBox = require( 'UNIT_RATES/common/view/RateAccordionBox' );
  var RestartRaceButton = require( 'UNIT_RATES/racinglab/view/RestartRaceButton' );
  var StartStopButton = require( 'UNIT_RATES/racinglab/view/StartStopButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  var doubleNumberLine1String = require( 'string!UNIT_RATES/doubleNumberLine1' );
  var doubleNumberLine2String = require( 'string!UNIT_RATES/doubleNumberLine2' );
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var milesString = require( 'string!UNIT_RATES/miles' );
  var rate1String = require( 'string!UNIT_RATES/rate1' );
  var rate2String = require( 'string!UNIT_RATES/rate2' );

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
    var sceneControl = new RacingLabSceneControl( model.car2VisibleProperty, {
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
        //TODO implement restartRaceButton listener
      },
      right: startStopButton.left - 15,
      centerY: startStopButton.centerY
    } );
    playAreaLayer.addChild( restartRaceButton );

    // Rate for car 2 (blue)
    var rateAccordionBox2 = new RateAccordionBox( model.car2.speedProperty, {
      titleNode: new Text( rate2String, { font: new URFont( 18 ), maxWidth: 100 } ),
      expandedProperty: viewProperties.rateExpandedProperty2,
      pickerFont: URConstants.RACING_LAB_PICKER_FONT,
      numeratorRange: URConstants.MILES_RANGE,
      denominatorRange: URConstants.HOURS_RANGE,
      numeratorUnits: milesString,
      denominatorUnits: hoursString,
      numeratorPickerColor: URColors.car2,
      denominatorPickerColor: URColors.car2,
      right: resetAllButton.left - 15,
      bottom: this.layoutBounds.bottom - URConstants.SCREEN_Y_MARGIN
    } );
    playAreaLayer.addChild( rateAccordionBox2 );

    // Rate for car 1 (red)
    var rateAccordionBox1 = new RateAccordionBox( model.car1.speedProperty, {
      titleNode: new Text( rate1String, { font: new URFont( 18 ), maxWidth: 100 } ),
      expandedProperty: viewProperties.rateExpandedProperty1,
      pickerFont: URConstants.RACING_LAB_PICKER_FONT,
      numeratorRange: URConstants.MILES_RANGE,
      denominatorRange: URConstants.HOURS_RANGE,
      numeratorUnits: milesString,
      denominatorUnits: hoursString,
      numeratorPickerColor: URColors.car1,
      denominatorPickerColor: URColors.car1,
      right: rateAccordionBox2.right,
      top: this.layoutBounds.top + URConstants.SCREEN_Y_MARGIN
    } );
    playAreaLayer.addChild( rateAccordionBox1 );

    // Double number line for car 1
    var doubleNumberLineAccordionBox1 = new DoubleNumberLineAccordionBox(
      model.car1.doubleNumberLine, model.car1.markerEditor, keypadLayer, {
        horizontalAxisLength: 600,
        titleNode: new Text( doubleNumberLine1String, { font: new URFont( 18 ), maxWidth: 300 } ),
        expandedProperty: viewProperties.doubleNumberLineExpandedProperty1,
        left: this.layoutBounds.left + URConstants.SCREEN_X_MARGIN,
        top: this.layoutBounds.top + URConstants.SCREEN_Y_MARGIN
      } );
    playAreaLayer.addChild( doubleNumberLineAccordionBox1 );

    // Double number line for car 2
    var doubleNumberLineAccordionBox2 = new DoubleNumberLineAccordionBox(
      model.car2.doubleNumberLine, model.car2.markerEditor, keypadLayer, {
        horizontalAxisLength: 600,
        titleNode: new Text( doubleNumberLine2String, { font: new URFont( 18 ), maxWidth: 300 } ),
        expandedProperty: viewProperties.doubleNumberLineExpandedProperty2,
        left: this.layoutBounds.left + URConstants.SCREEN_X_MARGIN,
        bottom: this.layoutBounds.bottom - URConstants.SCREEN_Y_MARGIN
      } );
    playAreaLayer.addChild( doubleNumberLineAccordionBox2 );
  }

  unitRates.register( 'RacingLabScreenView', RacingLabScreenView );

  return inherit( ScreenView, RacingLabScreenView );
} );

