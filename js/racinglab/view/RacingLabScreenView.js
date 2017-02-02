// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // sim modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );

  // common modules
  var RacingLabSceneControl = require( 'UNIT_RATES/racinglab/view/RacingLabSceneControl' );
  var RateAccordionBox = require( 'UNIT_RATES/common/view/RateAccordionBox' );
  var RestartRaceButton = require( 'UNIT_RATES/racinglab/view/RestartRaceButton' );
  var StartStopButton = require( 'UNIT_RATES/racinglab/view/StartStopButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
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

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.maxX - URConstants.SCREEN_X_MARGIN,
      bottom: this.layoutBounds.maxY - URConstants.SCREEN_Y_MARGIN
    } );
    this.addChild( resetAllButton );

    // Scene control (1 vs 2 cars)
    var sceneControl = new RacingLabSceneControl( model.car2VisibleProperty, {
      right: this.layoutBounds.maxX - URConstants.SCREEN_X_MARGIN,
      bottom: resetAllButton.top - 30
    } );
    this.addChild( sceneControl );

    // Start/stop button
    var startStopButton = new StartStopButton( model.runningProperty, {
      right: this.layoutBounds.maxX - URConstants.SCREEN_X_MARGIN,
      centerY: this.layoutBounds.centerY
    } );
    this.addChild( startStopButton );

    // Restart race button
    var restartRaceButton = new RestartRaceButton( {
      listener: function() {
        //TODO
      },
      right: startStopButton.left - 15,
      centerY: startStopButton.centerY
    } );
    this.addChild( restartRaceButton );

    // Rate for car 2 (blue)
    var rate2AccordionBox = new RateAccordionBox( model.car2.speedProperty, {
      titleNode: new Text( rate2String, { font: new URFont( 18 ), maxWidth: 100 } ),
      pickerFont: URConstants.RACING_LAB_PICKER_FONT,
      numeratorRange: URConstants.MILES_RANGE,
      denominatorRange: URConstants.HOURS_RANGE,
      numeratorUnits: milesString,
      denominatorUnits: hoursString,
      numeratorPickerColor: URColors.car2,
      denominatorPickerColor: URColors.car2,
      right: sceneControl.left - 20,
      bottom: this.layoutBounds.bottom - URConstants.SCREEN_Y_MARGIN
    } );
    this.addChild( rate2AccordionBox );

    // Rate for car 1 (red)
    var rate1AccordionBox = new RateAccordionBox( model.car1.speedProperty, {
      titleNode: new Text( rate1String, { font: new URFont( 18 ), maxWidth: 100 } ),
      pickerFont: URConstants.RACING_LAB_PICKER_FONT,
      numeratorRange: URConstants.MILES_RANGE,
      denominatorRange: URConstants.HOURS_RANGE,
      numeratorUnits: milesString,
      denominatorUnits: hoursString,
      numeratorPickerColor: URColors.car1,
      denominatorPickerColor: URColors.car1,
      right: rate2AccordionBox.right,
      top: this.layoutBounds.top + URConstants.SCREEN_Y_MARGIN
    } );
    this.addChild( rate1AccordionBox );


  }

  unitRates.register( 'RacingLabScreenView', RacingLabScreenView );

  return inherit( ScreenView, RacingLabScreenView );
} );

