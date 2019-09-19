// Copyright 2016-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const RacingLabScreen = require( 'UNIT_RATES/racinglab/RacingLabScreen' );
  const ShoppingLabScreen = require( 'UNIT_RATES/shoppinglab/ShoppingLabScreen' );
  const ShoppingScreen = require( 'UNIT_RATES/shopping/ShoppingScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const unitRatesTitleString = require( 'string!UNIT_RATES/unit-rates.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.), Dave Schmitz (Schmitzware)',
      team: 'Amy Hanson, Amanda McGarry, Susan Miller, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Amanda Davis, Bryce Griebenow, Ethan Johnson',
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
