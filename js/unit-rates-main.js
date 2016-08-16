// Copyright 2016, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var ShoppingScreen = require( 'UNIT_RATES/shopping/ShoppingScreen' );
  var ShoppingLabScreen = require( 'UNIT_RATES/shoppingLab/ShoppingLabScreen' );
  var RacingScreen = require( 'UNIT_RATES/racing/RacingScreen' );
  var RacingLabScreen = require( 'UNIT_RATES/racingLab/RacingLabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var unitRatesTitleString = require( 'string!UNIT_RATES/unit-rates.title' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var screens = [
      new ShoppingScreen(),
      new ShoppingLabScreen(),
      new RacingScreen(),
      new RacingLabScreen()
    ];
    var sim = new Sim( unitRatesTitleString, screens, simOptions );
    sim.start();
  } );
} );
