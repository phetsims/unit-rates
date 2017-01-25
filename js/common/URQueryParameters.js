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

    //TODO delete this when development is done
    // Don't use this, it's for the exclusive use of CM during development
    cm: { type: 'flag' },

    //TODO delete this when development is done
    // show old screens related to original development, see https://github.com/phetsims/unit-rates/issues/120
    old: { type: 'flag' },

    // shows answers for Shopping questions and marker editor
    showAnswers: { type: 'flag' },

    // enables console logging
    log: { type: 'flag' },

    // enables random selection of scenes, items, questions, etc.
    randomEnabled: {
      type: 'boolean',
      defaultValue: true
    },

    // Speed of animations. Larger values make animations run faster. Smaller values are useful for testing multi-touch.
    animationSpeed: {
      type: 'number',
      defaultValue: 400,
      isValidValue: function( value ) { return value > 0; }
    }
  } );

  unitRates.register( 'URQueryParameters', URQueryParameters );

  //TODO delete this when development is done
  // Convenience during development, make 'cm' override other query parameters.
  if ( URQueryParameters.cm ) {
    URQueryParameters.log = true;
    URQueryParameters.old = true;
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
    unitRates.log( 'animationSpeed=' + URQueryParameters.animationSpeed );
  }

  return URQueryParameters;
} );
