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
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var racingString = require( 'string!UNIT_RATES/racing' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/Racing-screen-icon.png' );

  /**
   * @constructor
   */
  function RacingScreen() {

    Screen.call( this,
      racingString,
      new Image( screenIcon ),
      function() { return new RacingModel(); },
      function( model ) { return new RacingScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  unitRates.register( 'RacingScreen', RacingScreen );

  return inherit( Screen, RacingScreen );
} );
