// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  var URQueryParameters = QueryStringMachine.getAll( {

    // enables developer-only features
    dev: { type: 'flag' },

    // shows answers to Shopping questions
    showAnswers: { type: 'flag' }
  } );

  unitRates.register( 'URQueryParameters', URQueryParameters );

  return URQueryParameters;
} );
