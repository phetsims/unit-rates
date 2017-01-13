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

    //TODO delete this when development is done
    // show screens related to new development, see https://github.com/phetsims/unit-rates/issues/120
    showNew: { type: 'flag' },

    // shows answers for Shopping questions and marker editor
    showAnswers: { type: 'flag' },

    // enables console logging
    log: { type: 'flag' },

    // enables random selection of scenes, items, questions, etc.
    randomEnabled: {
      type: 'boolean',
      defaultValue: true
    },

    // duration of animations, larger values make animations run slower
    animationDuration: {
      type: 'number',
      defaultValue: 1.25,
      isValidValue: function( value ) { return value > 0; }
    }
  } );

  unitRates.register( 'URQueryParameters', URQueryParameters );

  //TODO delete this when development is done
  // Convenience during development, make 'cm' override other query parameters.
  if ( URQueryParameters.cm ) {
    URQueryParameters.log = true;
    URQueryParameters.showNew = true;
    URQueryParameters.showAnswers = true;
    URQueryParameters.randomEnabled = false;
  }

  // enable logging to the console
  if ( URQueryParameters.log ) {

    console.log( 'enabling log' );
    unitRates.log = function( message ) {
      console.log( '%clog: ' + message, 'color: #009900' ); // display messages in green
    };

    unitRates.log( 'showAnswers=' + URQueryParameters.showAnswers );
    unitRates.log( 'randomEnabled=' + URQueryParameters.randomEnabled );
    unitRates.log( 'animationDuration=' + URQueryParameters.animationDuration );
  }

  return URQueryParameters;
} );
