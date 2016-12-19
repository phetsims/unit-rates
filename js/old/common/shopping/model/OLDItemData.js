// Copyright 2016, University of Colorado Boulder

/**
 * Container for all supported shopping items
 * type = the item type (duh)
 * rate = the default unit rate
 * maxUnits = the maximum number of items that should appear on the bottom number line (item count | weight )
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var appleString = require( 'string!UNIT_RATES/apple' );
  var applesString = require( 'string!UNIT_RATES/apples' );
  var carrotString = require( 'string!UNIT_RATES/carrot' );
  var carrotsString = require( 'string!UNIT_RATES/carrots' );
  var cucumberString = require( 'string!UNIT_RATES/cucumber' );
  var cucumbersString = require( 'string!UNIT_RATES/cucumbers' );
  var lemonString = require( 'string!UNIT_RATES/lemon' );
  var lemonsString = require( 'string!UNIT_RATES/lemons' );
  var orangeString = require( 'string!UNIT_RATES/orange' );
  var orangesString = require( 'string!UNIT_RATES/oranges' );
  var pearString = require( 'string!UNIT_RATES/pear' );
  var pearsString = require( 'string!UNIT_RATES/pears' );
  var potatoString = require( 'string!UNIT_RATES/potato' );
  var potatoesString = require( 'string!UNIT_RATES/potatoes' );
  var tomatoString = require( 'string!UNIT_RATES/tomato' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );
  var blueCandyString = require( 'string!UNIT_RATES/blueCandy' );
  var greenCandyString = require( 'string!UNIT_RATES/greenCandy' );
  var purpleCandyString = require( 'string!UNIT_RATES/purpleCandy' );
  var redCandyString = require( 'string!UNIT_RATES/redCandy' );

  var OLDItemData = Object( {

    APPLES: {
      type: 'apple',
      rate: 0.5,
      maxUnit: 16,
      singularName: appleString,
      pluralName: applesString,
      challengeData: [
        [ 10, 6, 8 ],     // set A - [ question#2, question#3, question#4 ]
        [ 10, 14, 13 ],   // set B
        [ 15, 9, 7 ],     // set C
        [ 15, 4, 9 ]      // set D
      ]
    },

    LEMONS: {
      type: 'lemon',
      rate: 0.25,
      maxUnit: 16,
      singularName: lemonString,
      pluralName: lemonsString,
      challengeData: [
        [ 10, 4, 14 ],
        [ 10, 14, 7 ],
        [ 15, 6, 11 ],
        [ 15, 11, 9 ]
      ]
    },

    ORANGES: {
      type: 'orange',
      rate: 0.75,
      maxUnit: 16,
      singularName: orangeString,
      pluralName: orangesString,
      challengeData: [
        [ 10, 4, 11 ],
        [ 10, 14, 8 ],
        [ 15, 9, 14 ],
        [ 15, 6, 12 ]
      ]
    },

    PEARS: {
      type: 'pear',
      rate: 0.4,
      maxUnit: 16,
      singularName: pearString,
      pluralName: pearsString,
      challengeData: [
        [ 10, 6, 7 ],
        [ 10, 14, 12 ],
        [ 15, 4, 8 ],
        [ 15, 11, 13 ]
      ]
    },

    CARROTS: {
      type: 'carrot',
      rate: 0.15,
      maxUnit: 16,
      singularName: carrotString,
      pluralName: carrotsString,
      challengeData: [
        [ 9, 19, 21 ],
        [ 15, 25, 23 ],
        [ 6, 21, 36 ],
        [ 14, 18, 28 ]
      ]
    },

    CUCUMBERS: {
      type: 'cucumber',
      rate: 0.22,
      maxUnit: 12,
      singularName: cucumberString,
      pluralName: cucumbersString,
      challengeData: [
        [ 7, 19, 18 ],
        [ 11, 25, 23 ],
        [ 8, 17, 27 ],
        [ 13, 23, 22 ]
      ]
    },

    POTATOES: {
      type: 'potato',
      rate: 0.45,
      maxUnit: 12,
      singularName: potatoString,
      pluralName: potatoesString,
      challengeData: [
        [ 7, 17, 21 ],
        [ 8, 19, 18 ],
        [ 11, 23, 25 ],
        [ 13, 25, 22 ]
      ]
    },

    TOMATOES: {
      type: 'tomato',
      rate: 0.3,
      maxUnit: 16,
      singularName: tomatoString,
      pluralName: tomatoesString,
      challengeData: [
        [ 7, 23, 28 ],
        [ 13, 25, 23 ],
        [ 14, 35, 26 ],
        [ 6, 21, 19 ]
      ]
    },

    PURPLE_CANDY: {
      type: 'purpleCandy',
      rate: 5.40,
      maxUnit: 1.6,
      singularName: purpleCandyString,
      pluralName: null,
      challengeData: [
        [ 0.6, 2.2, 2.4 ],
        [ 1.5, 3.2, 3.1 ],
        [ 0.3, 2.4, 2.3 ],
        [ 1.3, 2.1, 2.5 ]
      ]
    },

    RED_CANDY: {
      type: 'redCandy',
      rate: 3.80,
      maxUnit: 1.2,
      singularName: redCandyString,
      pluralName: null,
      challengeData: [
        [ 0.4, 2.3, 2 ],
        [ 0.7, 2.1, 2.4 ],
        [ 0.8, 1.7, 1.9 ],
        [ 1.3, 2.4, 2.8 ]
      ]
    },

    GREEN_CANDY: {
      type: 'greenCandy',
      rate: 8.20,
      maxUnit: 1.2,
      singularName: greenCandyString,
      pluralName: null,
      challengeData: [
        [ 0.7, 1.9, 2.2 ],
        [ 1.3, 2.5, 2.4 ],
        [ 0.4, 1.8, 1.9 ],
        [ 1.5, 2.1, 1.8 ]
      ]
    },

    BLUE_CANDY: {
      type: 'blueCandy',
      rate: 1.30,
      maxUnit: 1.6,
      singularName: blueCandyString,
      pluralName: null,
      challengeData: [
        [ 0.3, 1.9, 3.2 ],
        [ 0.7, 2.2, 2.3 ],
        [ 1.3, 2.6, 2.4 ],
        [ 1.4, 2.8, 2.9 ]
      ]
    }
  } );

  unitRates.register( 'OLDItemData', OLDItemData );

  return OLDItemData;
} );

