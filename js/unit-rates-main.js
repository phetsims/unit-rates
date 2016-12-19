// Copyright 2016, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var OLDRacingLabScreen = require( 'UNIT_RATES/old/racingLab/OLDRacingLabScreen' );
  var OLDShoppingScreen = require( 'UNIT_RATES/old/shopping/OLDShoppingScreen' );
  var OLDShoppingLabScreen = require( 'UNIT_RATES/old/shoppingLab/OLDShoppingLabScreen' );
  var ShoppingScreen = require( 'UNIT_RATES/shopping/ShoppingScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
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
      new OLDShoppingScreen(),
      new OLDShoppingLabScreen(),
      new OLDRacingLabScreen()
    ];

    if ( URQueryParameters.showNew ) {
      screens.push( new ShoppingScreen() );
    }

    var sim = new Sim( unitRatesTitleString, screens, simOptions );
    sim.start();
  } );
} );
