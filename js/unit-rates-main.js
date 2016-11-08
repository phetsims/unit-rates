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
  var RacingLabScreen = require( 'UNIT_RATES/racingLab/RacingLabScreen' );
  var ShoppingScreen = require( 'UNIT_RATES/shopping/ShoppingScreen' );
  var ShoppingScreenNEW = require( 'UNIT_RATES/shoppingNEW/ShoppingScreenNEW' );
  var ShoppingLabScreen = require( 'UNIT_RATES/shoppingLab/ShoppingLabScreen' );
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
      new ShoppingScreen(),
      new ShoppingLabScreen(),
      new RacingLabScreen()
    ];

    if ( URQueryParameters.new ) {
      screens.push( new ShoppingScreenNEW() );
    }

    var sim = new Sim( unitRatesTitleString, screens, simOptions );
    sim.start();
  } );
} );
