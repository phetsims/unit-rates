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

    // show screens related to new development, see https://github.com/phetsims/unit-rates/issues/120
    new: { type: 'flag' },

    // shows answers to Shopping questions
    showAnswers: { type: 'flag' },

    // enables console logging
    log: { type: 'flag' }
  } );

  unitRates.register( 'URQueryParameters', URQueryParameters );

  return URQueryParameters;
} );
