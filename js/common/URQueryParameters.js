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

    // enables console logging
    log: { type: 'flag' },

    // shows answers for Shopping questions and marker editor
    showAnswers: { type: 'flag' },

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
    },

    // 1 second of sim type is equivalent to this many hours of race time. Larger values make the race run faster.
    raceTimeScale: {
      type: 'number',
      defaultValue: 8,
      isValidValue: function( value ) { return value > 0; }
    }
  } );

  unitRates.register( 'URQueryParameters', URQueryParameters );

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
