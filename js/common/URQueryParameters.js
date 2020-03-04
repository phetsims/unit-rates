// Copyright 2016-2020, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

// sim modules
import unitRates from '../unitRates.js';

const URQueryParameters = QueryStringMachine.getAll( {

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

// log the values of all sim-specific query parameters
phet.log && phet.log( 'query parameters: ' + JSON.stringify( URQueryParameters, null, 2 ) );

export default URQueryParameters;