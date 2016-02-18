// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RacingModel = require( 'UNIT_RATES/racing/model/RacingModel' );
  var RacingScreenView = require( 'UNIT_RATES/racing/view/RacingScreenView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var racingString = require( 'string!UNIT_RATES/racing' );

  /**
   * @constructor
   */
  function RacingScreen() {

    var icon = new Rectangle( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, {
      fill: 'red'
    } );

    Screen.call( this, racingString, icon,
      function() { return new RacingModel(); },
      function( model ) { return new RacingScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  unitRates.register( 'RacingScreen', RacingScreen );

  return inherit( Screen, RacingScreen );
} );