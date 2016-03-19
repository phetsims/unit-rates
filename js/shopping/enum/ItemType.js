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

  var ItemType = Object.freeze( {
    APPLES: applesString,
    LEMONS: lemonsString,
    ORANGES: orangesString,
    PEARS: pearsString,
    CARROTS: carrotsString,
    CUCUMBERS: cucumbersString,
    POTATOES: potatoesString,
    TOMATOES: tomatoesString,
    RED_CANDY: redCandyString,
    YELLOW_CANDY: yellowCandyString,
    GREEN_CANDY: greenCandyString,
    BLUE_CANDY: blueCandyString
  } );

  unitRates.register( 'ItemType', ItemType );

  return ItemType;
} );

