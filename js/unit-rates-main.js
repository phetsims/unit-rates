// Copyright 2016-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // sim modules
  var OLDRacingLabScreen = require( 'UNIT_RATES/old/racingLab/OLDRacingLabScreen' );
  var RacingLabScreen = require( 'UNIT_RATES/racinglab/RacingLabScreen' );
  var ShoppingLabScreen = require( 'UNIT_RATES/shoppinglab/ShoppingLabScreen' );
  var ShoppingScreen = require( 'UNIT_RATES/shopping/ShoppingScreen' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

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

    //TODO delete when development is done
    if ( URQueryParameters.old ) {
      screens.push( new OLDRacingLabScreen() );
    }

    var sim = new Sim( unitRatesTitleString, screens, simOptions );
    sim.start();
  } );
} );
