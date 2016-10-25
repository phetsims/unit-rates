// Copyright 2016, University of Colorado Boulder

/**
 * Items in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
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
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var tomatoString = require( 'string!UNIT_RATES/tomato' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );
  var blueCandyString = require( 'string!UNIT_RATES/blueCandy' );
  var greenCandyString = require( 'string!UNIT_RATES/greenCandy' );
  var purpleCandyString = require( 'string!UNIT_RATES/purpleCandy' );
  var redCandyString = require( 'string!UNIT_RATES/redCandy' );

  // item images
  var appleImage = require( 'image!UNIT_RATES/apple.png' );
  var blueCandyImage = require( 'image!UNIT_RATES/blue_candy.png' );
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var cucumberImage = require( 'image!UNIT_RATES/cucumber.png' );
  var greenCandyImage = require( 'image!UNIT_RATES/green_candy.png' );
  var lemonImage = require( 'image!UNIT_RATES/lemon.png' );
  var orangeImage = require( 'image!UNIT_RATES/orange.png' );
  var pearImage = require( 'image!UNIT_RATES/pear.png' );
  var potatoImage = require( 'image!UNIT_RATES/potato.png' );
  var purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );
  var redCandyImage = require( 'image!UNIT_RATES/red_candy.png' );
  var tomatoImage = require( 'image!UNIT_RATES/tomato.png' );

  // bag images
  var appleBagImage = require( 'image!UNIT_RATES/apple_bag.png' );
  var blueCandyBagImage = require( 'image!UNIT_RATES/blue_candy_bag.png' );
  var carrotBagImage = require( 'image!UNIT_RATES/carrot_bag.png' );
  var cucumberBagImage = require( 'image!UNIT_RATES/cucumber_bag.png' );
  var greenCandyBagImage = require( 'image!UNIT_RATES/green_candy_bag.png' );
  var lemonBagImage = require( 'image!UNIT_RATES/lemon_bag.png' );
  var orangeBagImage = require( 'image!UNIT_RATES/orange_bag.png' );
  var pearBagImage = require( 'image!UNIT_RATES/pear_bag.png' );
  var purpleCandyBagImage = require( 'image!UNIT_RATES/purple_candy_bag.png' );
  var potatoBagImage = require( 'image!UNIT_RATES/potato_bag.png' );
  var redCandyBagImage = require( 'image!UNIT_RATES/red_candy_bag.png' );
  var tomatoBagImage = require( 'image!UNIT_RATES/tomato_bag.png' );

  var ShoppingItem = {

    APPLES: {
      unitRate: 0.5, // dollars per item
      bagRate: 2.50, // dollars per bag
      numberOfBags: 3,
      singularName: appleString,
      pluralName: applesString,
      itemImage: appleImage,
      bagImage: appleBagImage,
      questions: [
        [ 10, 6, 8 ],     // set A - [ question#2, question#3, question#4 ]
        [ 10, 16, 13 ],   // set B
        [ 15, 9, 7 ],     // set C
        [ 15, 4, 9 ]      // set D
      ]
    },

    LEMONS: {
      unitRate: 0.25, // dollars per item
      bagRate: 1.25, // dollars per bag
      numberOfBags: 3,
      singularName: lemonString,
      pluralName: lemonsString,
      itemImage: lemonImage,
      bagImage: lemonBagImage,
      questions: [
        [ 10, 4, 14 ],
        [ 10, 14, 7 ],
        [ 15, 6, 11 ],
        [ 15, 6, 12 ]
      ]
    },

    ORANGES: {
      unitRate: 0.75, // dollars per item
      bagRate: 3.75, // dollars per bag
      numberOfBags: 3,
      singularName: orangeString,
      pluralName: orangesString,
      itemImage: orangeImage,
      bagImage: orangeBagImage,
      questions: [
        [ 10, 4, 11 ],
        [ 10, 16, 8 ],
        [ 15, 9, 14 ],
        [ 15, 6, 12 ]
      ]
    },

    PEARS: {
      unitRate: 0.40, // dollars per item
      bagRate: 2.00, // dollars
      numberOfBags: 3,
      singularName: pearString,
      pluralName: pearsString,
      itemImage: pearImage,
      bagImage: pearBagImage,
      questions: [
        [ 10, 6, 16 ],
        [ 10, 14, 12 ],
        [ 15, 4, 8 ],
        [ 15, 11, 13 ]
      ]
    },

    CARROTS: {
      unitRate: 0.15, // dollars per item
      bagRate: 0.60, // dollars per bag
      numberOfBags: 4,
      singularName: carrotString,
      pluralName: carrotsString,
      itemImage: carrotImage,
      bagImage: carrotBagImage,
      questions: [
        [ 9, 19, 21 ],
        [ 15, 25, 23 ],
        [ 6, 21, 36 ],
        [ 14, 18, 28 ]
      ]
    },

    CUCUMBERS: {
      unitRate: 0.22, // dollars per item
      bagRate: 0.66, // dollars
      numberOfBags: 4,
      singularName: cucumberString,
      pluralName: cucumbersString,
      itemImage: cucumberImage,
      bagImage: cucumberBagImage,
      questions: [
        [ 7, 19, 18 ],
        [ 11, 25, 23 ],
        [ 8, 17, 27 ],
        [ 13, 23, 22 ]
      ]
    },

    POTATOES: {
      singularName: potatoString,
      pluralName: potatoesString,
      unitRate: 0.45, // dollars per item
      bagRate: 1.35, // dollars per bag
      numberOfBags: 4,
      itemImage: potatoImage,
      bagImage: potatoBagImage,
      questions: [
        [ 7, 17, 21 ],
        [ 8, 19, 18 ],
        [ 11, 23, 25 ],
        [ 13, 25, 22 ]
      ]
    },

    TOMATOES: {
      unitRate: 0.3, // dollars per item
      bagRate: 1.20, // dollars per bag
      numberOfBags: 4,
      singularName: tomatoString,
      pluralName: tomatoesString,
      itemImage: tomatoImage,
      bagImage: tomatoBagImage,
      questions: [
        [ 7, 23, 28 ],
        [ 13, 25, 23 ],
        [ 14, 35, 26 ],
        [ 6, 21, 19 ]
      ]
    },

    PURPLE_CANDY: {
      unitRate: 5.40, // dollars per pound
      bagRate: 2.16, // dollars per bag
      numberOfBags: 4,
      singularName: purpleCandyString,
      pluralName: null,
      denominatorName: poundsString,
      itemImage: purpleCandyImage,
      bagImage: purpleCandyBagImage,
      questions: [
        [ 0.6, 2.2, 2.4 ],
        [ 1.5, 3.1, 3.1 ],
        [ 0.3, 2.4, 2.3 ],
        [ 1.3, 2.1, 2.5 ]
      ]
    },

    RED_CANDY: {
      unitRate: 3.80, // dollars per pound
      bagRate: 1.14, // dollars per bag
      numberOfBags: 4,
      singularName: redCandyString,
      pluralName: null,
      denominatorName: poundsString,
      itemImage: redCandyImage,
      bagImage: redCandyBagImage,
      questions: [
        [ 0.4, 2.3, 2 ],
        [ 0.7, 2.1, 2.4 ],
        [ 0.8, 1.7, 1.9 ],
        [ 1.3, 2.4, 2.8 ]
      ]
    },

    GREEN_CANDY: {
      unitRate: 8.20, // dollars per pound
      bagRate: 2.46, // dollars per bag
      numberOfBags: 4,
      singularName: greenCandyString,
      pluralName: null,
      denominatorName: poundsString,
      itemImage: greenCandyImage,
      bagImage: greenCandyBagImage,
      questions: [
        [ 0.7, 1.9, 2.2 ],
        [ 1.3, 2.5, 2.4 ],
        [ 0.4, 1.8, 1.9 ],
        [ 1.5, 2.1, 1.8 ]
      ]
    },

    BLUE_CANDY: {
      unitRate: 1.30, // dollars per pound
      bagRate: 0.52, // dollars per bag
      numberOfBags: 4,
      singularName: blueCandyString,
      pluralName: null,
      denominatorName: poundsString,
      itemImage: blueCandyImage,
      bagImage: blueCandyBagImage,
      questions: [
        [ 0.3, 1.9, 3.2 ],
        [ 0.7, 2.2, 2.3 ],
        [ 1.3, 2.6, 2.4 ],
        [ 1.4, 2.8, 2.9 ]
      ]
    }
  };

  unitRates.register( 'ShoppingItem', ShoppingItem );

  return ShoppingItem;
} );
