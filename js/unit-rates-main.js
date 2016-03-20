// Copyright 2016, University of Colorado Boulder
// Copyright 2016, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var LabScreen = require( 'UNIT_RATES/lab/LabScreen' );
  var RacingScreen = require( 'UNIT_RATES/racing/RacingScreen' );
  var ShoppingScreen = require( 'UNIT_RATES/shopping/ShoppingScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var unitRatesTitleString = require( 'string!UNIT_RATES/Unit-Rates.title' );

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
      new RacingScreen(),
      new LabScreen()
    ];
    var sim = new Sim( unitRatesTitleString, screens, simOptions );
    sim.start();
  } );
} );
