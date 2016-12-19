// Copyright 2016, University of Colorado Boulder

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

    //TODO delete this when development is done
    // Don't use this, it's for the exclusive use of CM during development
    cm: { type: 'flag' },

    // show screens related to new development, see https://github.com/phetsims/unit-rates/issues/120
    showNew: { type: 'flag' },

    // shows answers to Shopping questions
    showAnswers: { type: 'flag' },

    // enables console logging
    log: { type: 'flag' },

    // enables random selection of scenes, items, questions, etc.
    randomEnabled: {
      type: 'boolean',
      defaultValue: true
    }
  } );

  unitRates.register( 'URQueryParameters', URQueryParameters );

  //TODO delete this when development is done
  // Convenience during development, make 'cm' override other query parameters.
  if ( URQueryParameters.cm ) {
    URQueryParameters.showNew = true;
    URQueryParameters.showAnswers = true;
    URQueryParameters.randomEnabled = false;
  }

  return URQueryParameters;
} );
