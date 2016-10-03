// Copyright 2016, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var ShoppingScreen = require( 'UNIT_RATES/shopping/ShoppingScreen' );
  var ShoppingLabScreen = require( 'UNIT_RATES/shoppingLab/ShoppingLabScreen' );
  var RacingLabScreen = require( 'UNIT_RATES/racingLab/RacingLabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var unitRatesTitleString = require( 'string!UNIT_RATES/unit-rates.title' );

  var simOptions = {
    //TODO finalize credits, https://github.com/phetsims/unit-rates/issues/55
    credits: {
      leadDesign: 'Amy Rouinfar',
      softwareDevelopment: 'Dave Schmitz (Schmitzware), Chris Malley (PixelZoom, Inc.)',
      team: 'Amy Hanson, Amanda McGarry, Susan Miller, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Amanda Davis',
      graphicArts: 'Mariah Hermsmeyer'
    }
  };

  SimLauncher.launch( function() {
    var screens = [
      new ShoppingScreen(),
      new ShoppingLabScreen(),
      new RacingLabScreen()
    ];
    var sim = new Sim( unitRatesTitleString, screens, simOptions );
    sim.start();
  } );
} );
