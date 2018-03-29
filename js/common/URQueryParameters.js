// Copyright 2016-2017, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  var URQueryParameters = QueryStringMachine.getAll( {

    // Shows answers for Shopping questions and marker editor
    showAnswers: { type: 'flag' },

    // Enables random selection of scenes and questions in Shopping and Shopping Lab screens
    randomEnabled: {
      type: 'boolean',
      defaultValue: true
    },

    // Controls the animation speed of car races.
    // 1 second of sim type is equivalent to this many hours of race time.
    // Larger values make car animation run faster.
    raceTimeScale: {
      type: 'number',
      defaultValue: 8, // hours
      isValidValue: function( value ) { return value > 0; }
    },

    // shows cells on the scale and shelf, indicating where bags and items may reside
    showCells: { type: 'flag' }
  } );

  unitRates.register( 'URQueryParameters', URQueryParameters );

  //TODO if production version, URQueryParameters.showAnswers = false; See https://github.com/phetsims/unit-rates/issues/160

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( URQueryParameters, null, 2 ) );

  return URQueryParameters;
} );
