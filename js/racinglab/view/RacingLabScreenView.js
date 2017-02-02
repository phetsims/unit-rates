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

  // common modules
  var RacingLabSceneControl = require( 'UNIT_RATES/racinglab/view/RacingLabSceneControl' );
  var RestartRaceButton = require( 'UNIT_RATES/racinglab/view/RestartRaceButton' );
  var StartStopButton = require( 'UNIT_RATES/racinglab/view/StartStopButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );

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
    var sceneControl = new RacingLabSceneControl( model.numberOfCarsProperty, {
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
  }

  unitRates.register( 'RacingLabScreenView', RacingLabScreenView );

  return inherit( ScreenView, RacingLabScreenView );
} );

