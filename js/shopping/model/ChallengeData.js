// Copyright 2002-2016, University of Colorado Boulder

/**
 * Data for all the challenge prompts
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  var ChallengeData = Object( {
    APPLES: [
      [ 10, 6, 8 ],
      [ 10, 16, 13 ],
      [ 15, 9, 7 ],
      [ 15, 4, 9 ]
    ],
    LEMONS: [
      [ 10,4, 14 ],
      [ 10, 14, 7 ],
      [ 15, 6, 11 ],
      [ 15,6, 12 ]
    ],
    ORANGES: [
      [ 10, 4, 11 ],
      [ 10, 16, 8 ],
      [ 15, 9, 14 ],
      [ 15, 6, 12 ]
    ],
    PEARS: [
      [ 10, 6, 16 ],
      [ 10, 14, 12 ],
      [ 15, 4, 8 ],
      [ 15, 11, 13 ]
    ],
    CARROTS: [
      [ 9, 19, 21 ],
      [ 15, 25, 23 ],
      [ 6, 21, 36 ],
      [ 114, 18, 28 ]
    ],
    CUCUMBERS: [
      [ 7, 19, 18 ],
      [ 11, 25, 23 ],
      [ 8, 17, 27 ],
      [ 13, 23, 22 ]
    ],
    POTATOES: [
      [ 7, 17, 21 ],
      [ 8, 19, 18 ],
      [ 11, 23, 25 ],
      [ 13, 25, 22 ]
    ],
    TOMATOES: [
      [ 7, 23, 28 ],
      [ 13, 25, 23 ],
      [ 14, 35, 26 ],
      [ 6, 21, 19 ]
    ],
    PURPLE_CANDY: [
      [ 0.6, 2.2, 2.4 ],
      [ 1.5, 3.1, 3.1 ],
      [ 0.3, 2.4, 2.3 ],
      [ 1.3, 2.1, 2.5 ]
    ],
    RED_CANDY: [
      [ 0.4, 2.3, 2 ],
      [ 0.7, 2.1, 2.4 ],
      [ 0.8, 1.7, 1.9 ],
      [ 1.3, 2.4, 2.8 ]
    ],
    GREEN_CANDY: [
      [ 0.7, 1.9, 2.2 ],
      [ 1.3, 2.5, 2.4 ],
      [ 0.4, 1.8, 1.9 ],
      [ 1.5, 2.1, 1.8 ]
    ],
    BLUE_CANDY: [
      [ 0.3, 1.0, 3.2 ],
      [ 0.7, 2.2, 2.3 ],
      [ 1.3, 2.6, 2.4 ],
      [ 1.4,2.8,2.9 ]
    ]
  } );

  unitRates.register( 'ChallengeData', ChallengeData );

  return ChallengeData;
} );





