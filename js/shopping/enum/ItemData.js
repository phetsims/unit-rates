// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var applesString = require( 'string!UNIT_RATES/Apples' );
  var lemonsString = require( 'string!UNIT_RATES/Lemons' );
  var orangesString = require( 'string!UNIT_RATES/Oranges' );
  var pearsString = require( 'string!UNIT_RATES/Pears' );
  var carrotsString = require( 'string!UNIT_RATES/Carrots' );
  var cucumbersString = require( 'string!UNIT_RATES/Cucumbers' );
  var potatoesString = require( 'string!UNIT_RATES/Potatoes' );
  var tomatoesString = require( 'string!UNIT_RATES/Tomatoes' );
  var redCandyString = require( 'string!UNIT_RATES/RedCandy' );
  var yellowCandyString = require( 'string!UNIT_RATES/YellowCandy' );
  var greenCandyString = require( 'string!UNIT_RATES/GreenCandy' );
  var blueCandyString = require( 'string!UNIT_RATES/BlueCandy' );
  var weightUnitString = require( 'string!UNIT_RATES/weightUnit' );

  var ItemData = Object.freeze( {
    APPLES: {
      type: applesString,
      unit: applesString,
      rate: 0.5
    },
    LEMONS: {
      type: lemonsString,
      unit: lemonsString,
      rate: 0.5
    },
    ORANGES: {
      type: orangesString,
      unit: orangesString,
      rate: 0.5
    },
    PEARS: {
      type: pearsString,
      unit: pearsString,
      rate: 0.5
    },
    CARROTS:{
      type: carrotsString,
      unit: carrotsString,
      rate: 0.5
    },
    CUCUMBERS: {
      type: cucumbersString,
      unit: cucumbersString,
      rate: 0.5
    },
    POTATOES: {
      type: potatoesString,
      unit: potatoesString,
      rate: 0.5
    },
    TOMATOES: {
      type: tomatoesString,
      unit: tomatoesString,
      rate: 0.5
    },
    RED_CANDY: {
      type: redCandyString,
      unit: weightUnitString,
      rate: 0.5
    },
    YELLOW_CANDY: {
      type: yellowCandyString,
      unit: weightUnitString,
      rate: 0.5
    },
    GREEN_CANDY: {
      type: greenCandyString,
      unit: weightUnitString,
      rate: 0.5
    },
    BLUE_CANDY: {
      type: blueCandyString,
      unit: weightUnitString,
      rate: 0.5
    }
  } );

  unitRates.register( 'ItemData', ItemData );

  return ItemData;
} );

