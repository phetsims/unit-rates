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
  var applesString = require( 'string!UNIT_RATES/apples' );
  var lemonsString = require( 'string!UNIT_RATES/lemons' );
  var orangesString = require( 'string!UNIT_RATES/oranges' );
  var pearsString = require( 'string!UNIT_RATES/pears' );
  var carrotsString = require( 'string!UNIT_RATES/carrots' );
  var cucumbersString = require( 'string!UNIT_RATES/cucumbers' );
  var potatoesString = require( 'string!UNIT_RATES/potatoes' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );
  var redCandyString = require( 'string!UNIT_RATES/redCandy' );
  var yellowCandyString = require( 'string!UNIT_RATES/yellowCandy' );
  var greenCandyString = require( 'string!UNIT_RATES/greenCandy' );
  var blueCandyString = require( 'string!UNIT_RATES/blueCandy' );

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
    GREEN_CANDY: yellowCandyString,
    BLUE_CANDY: blueCandyString
  } );

  unitRates.register( 'ItemType', ItemType );

  return ItemType;
} );

