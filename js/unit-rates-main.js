// Copyright 2016, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var UnitRatesScreen = require( 'UNIT_RATES/unit-rates/UnitRatesScreen' );
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
    var sim = new Sim( unitRatesTitleString, [ new UnitRatesScreen() ], simOptions );
    sim.start();
  } );
} );