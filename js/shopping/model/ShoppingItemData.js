// Copyright 2016, University of Colorado Boulder

/**
 * Data structures that describe item types in the 'Shopping' screen.
 * These data structures are used to instantiate instances of ShoppingItem and its subtypes.
 * Using a data structure like this is an alternative to having a large number of constructor parameters.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // Fruit strings
  var appleString = require( 'string!UNIT_RATES/apple' );
  var applesString = require( 'string!UNIT_RATES/apples' );
  var lemonString = require( 'string!UNIT_RATES/lemon' );
  var lemonsString = require( 'string!UNIT_RATES/lemons' );
  var orangeString = require( 'string!UNIT_RATES/orange' );
  var orangesString = require( 'string!UNIT_RATES/oranges' );
  var pearString = require( 'string!UNIT_RATES/pear' );
  var pearsString = require( 'string!UNIT_RATES/pears' );

  // Fruit images
  var appleBagImage = require( 'image!UNIT_RATES/apple_bag.png' );
  var appleImage = require( 'image!UNIT_RATES/apple.png' );
  var lemonBagImage = require( 'image!UNIT_RATES/lemon_bag.png' );
  var lemonImage = require( 'image!UNIT_RATES/lemon.png' );
  var orangeBagImage = require( 'image!UNIT_RATES/orange_bag.png' );
  var orangeImage = require( 'image!UNIT_RATES/orange.png' );
  var pearBagImage = require( 'image!UNIT_RATES/pear_bag.png' );
  var pearImage = require( 'image!UNIT_RATES/pear.png' );

  // Vegetable strings
  var carrotString = require( 'string!UNIT_RATES/carrot' );
  var carrotsString = require( 'string!UNIT_RATES/carrots' );
  var cucumberString = require( 'string!UNIT_RATES/cucumber' );
  var cucumbersString = require( 'string!UNIT_RATES/cucumbers' );
  var potatoString = require( 'string!UNIT_RATES/potato' );
  var potatoesString = require( 'string!UNIT_RATES/potatoes' );
  var tomatoString = require( 'string!UNIT_RATES/tomato' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );

  // Vegetable images
  var carrotBagImage = require( 'image!UNIT_RATES/carrot_bag.png' );
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var cucumberBagImage = require( 'image!UNIT_RATES/cucumber_bag.png' );
  var cucumberImage = require( 'image!UNIT_RATES/cucumber.png' );
  var potatoBagImage = require( 'image!UNIT_RATES/potato_bag.png' );
  var potatoImage = require( 'image!UNIT_RATES/potato.png' );
  var tomatoBagImage = require( 'image!UNIT_RATES/tomato_bag.png' );
  var tomatoImage = require( 'image!UNIT_RATES/tomato.png' );

  // Candy strings
  var blueCandyString = require( 'string!UNIT_RATES/blueCandy' );
  var greenCandyString = require( 'string!UNIT_RATES/greenCandy' );
  var purpleCandyString = require( 'string!UNIT_RATES/purpleCandy' );
  var redCandyString = require( 'string!UNIT_RATES/redCandy' );

  // Candy images
  var blueCandyBagImage = require( 'image!UNIT_RATES/blue_candy_bag.png' );
  var blueCandyImage = require( 'image!UNIT_RATES/blue_candy.png' );
  var greenCandyBagImage = require( 'image!UNIT_RATES/green_candy_bag.png' );
  var greenCandyImage = require( 'image!UNIT_RATES/green_candy.png' );
  var purpleCandyBagImage = require( 'image!UNIT_RATES/purple_candy_bag.png' );
  var purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );
  var redCandyBagImage = require( 'image!UNIT_RATES/red_candy_bag.png' );
  var redCandyImage = require( 'image!UNIT_RATES/red_candy.png' );

  var ShoppingItemData = {

    // Data structures that describe types of Fruit
    Fruit: {

      // NOTE: This instance is assumed to be representative of 'item data', see assertIsItemData
      APPLES: {
        unitRate: 0.5, // {number} cost per item, in $
        bagRate: 2.50, // {number} cost per bag, in $
        numberOfBags: 3, // {number} number of bags initially on the shelf
        singularName: appleString, // {string} name to use for singular quantities (e.g. '1 Apple')
        pluralName: applesString, // {string} name to use for plural quantities (e.g. '2 Apples')
        itemImage: appleImage, // {HTMLImageElement} image for individual items
        bagImage: appleBagImage, // {HTMLImageElement} image for a bag of items

        // {number[][]} Number of items for each question, grouped into 'question sets'.
        // See 'Unit Rates & Challenge Prompts' in design document.
        questionQuantities: [
          [ 10, 6, 8 ],
          [ 10, 14, 13 ],
          [ 15, 9, 7 ],
          [ 15, 4, 9 ]
        ]
      },

      LEMONS: {
        unitRate: 0.25,
        bagRate: 1.25,
        numberOfBags: 3,
        singularName: lemonString,
        pluralName: lemonsString,
        itemImage: lemonImage,
        bagImage: lemonBagImage,
        questionQuantities: [
          [ 10, 4, 14 ],
          [ 10, 14, 7 ],
          [ 15, 6, 11 ],
          [ 15, 11, 9 ]
        ]
      },

      ORANGES: {
        unitRate: 0.75,
        bagRate: 3.75,
        numberOfBags: 3,
        singularName: orangeString,
        pluralName: orangesString,
        itemImage: orangeImage,
        bagImage: orangeBagImage,
        questionQuantities: [
          [ 10, 4, 11 ],
          [ 10, 14, 8 ],
          [ 15, 9, 14 ],
          [ 15, 6, 12 ]
        ]
      },

      PEARS: {
        unitRate: 0.40,
        bagRate: 2.00,
        numberOfBags: 3,
        singularName: pearString,
        pluralName: pearsString,
        itemImage: pearImage,
        bagImage: pearBagImage,
        questionQuantities: [
          [ 10, 6, 7 ],
          [ 10, 14, 12 ],
          [ 15, 4, 8 ],
          [ 15, 11, 13 ]
        ]
      }
    },

    // Data structures that describe types of Vegetables
    Vegetable: {

      CARROTS: {
        unitRate: 0.15,
        bagRate: 0.60,
        numberOfBags: 4,
        singularName: carrotString,
        pluralName: carrotsString,
        itemImage: carrotImage,
        bagImage: carrotBagImage,

        // {number[][]} number of items for each question
        questionQuantities: [
          [ 9, 19, 21 ],
          [ 15, 25, 23 ],
          [ 6, 21, 36 ],
          [ 14, 18, 28 ]
        ]
      },

      CUCUMBERS: {
        unitRate: 0.22,
        bagRate: 0.66,
        numberOfBags: 4,
        singularName: cucumberString,
        pluralName: cucumbersString,
        itemImage: cucumberImage,
        bagImage: cucumberBagImage,
        questionQuantities: [
          [ 7, 19, 18 ],
          [ 11, 25, 23 ],
          [ 8, 17, 27 ],
          [ 13, 23, 22 ]
        ]
      },

      POTATOES: {
        unitRate: 0.45,
        bagRate: 1.35,
        numberOfBags: 4,
        singularName: potatoString,
        pluralName: potatoesString,
        itemImage: potatoImage,
        bagImage: potatoBagImage,
        questionQuantities: [
          [ 7, 17, 21 ],
          [ 8, 19, 18 ],
          [ 11, 23, 25 ],
          [ 13, 25, 22 ]
        ]
      },

      TOMATOES: {
        unitRate: 0.3,
        bagRate: 1.20,
        numberOfBags: 4,
        singularName: tomatoString,
        pluralName: tomatoesString,
        itemImage: tomatoImage,
        bagImage: tomatoBagImage,
        questionQuantities: [
          [ 7, 23, 28 ],
          [ 13, 25, 23 ],
          [ 14, 35, 26 ],
          [ 6, 21, 19 ]
        ]
      }
    },

    // Data structures that describe types of Candy
    Candy: {

      PURPLE_CANDY: {
        unitRate: 5.40,
        bagRate: 2.16,
        numberOfBags: 4,
        singularName: purpleCandyString,
        pluralName: purpleCandyString,
        itemImage: purpleCandyImage,
        bagImage: purpleCandyBagImage,

        // {number[][]} number of pounds for each question
        questionQuantities: [
          [ 0.6, 2.2, 2.4 ],
          [ 1.5, 3.2, 3.1 ],
          [ 0.3, 2.4, 2.3 ],
          [ 1.3, 2.1, 2.5 ]
        ]
      },

      RED_CANDY: {
        unitRate: 3.80,
        bagRate: 1.14,
        numberOfBags: 4,
        singularName: redCandyString,
        pluralName: redCandyString,
        itemImage: redCandyImage,
        bagImage: redCandyBagImage,
        questionQuantities: [
          [ 0.4, 2.3, 2 ],
          [ 0.7, 2.1, 2.4 ],
          [ 0.8, 1.7, 1.9 ],
          [ 1.3, 2.4, 2.8 ]
        ]
      },

      GREEN_CANDY: {
        unitRate: 8.20,
        bagRate: 2.46,
        numberOfBags: 4,
        singularName: greenCandyString,
        pluralName: greenCandyString,
        itemImage: greenCandyImage,
        bagImage: greenCandyBagImage,
        questionQuantities: [
          [ 0.7, 1.9, 2.2 ],
          [ 1.3, 2.5, 2.4 ],
          [ 0.4, 1.8, 1.9 ],
          [ 1.5, 2.1, 1.8 ]
        ]
      },

      BLUE_CANDY: {
        unitRate: 1.30,
        bagRate: 0.52,
        numberOfBags: 4,
        singularName: blueCandyString,
        pluralName: blueCandyString,
        itemImage: blueCandyImage,
        bagImage: blueCandyBagImage,
        questionQuantities: [
          [ 0.3, 1.9, 3.2 ],
          [ 0.7, 2.2, 2.3 ],
          [ 1.3, 2.6, 2.4 ],
          [ 1.4, 2.8, 2.9 ]
        ]
      }
    },

    /**
     * Verifies that an object has all of the properties required to be considered 'item data' (duck typing).
     * Verification occurs only when assertions are enabled. The first missing property causes an assertion failure.
     * @param {*} itemData
     */
    assertIsItemData: function( itemData ) {

      // Instead of keeping a separate list of property names, assume that the APPLES instance is representative.
      var keys = _.keys( ShoppingItemData.Fruit.APPLES );

      keys.forEach( function( key ) {
        assert && assert( _.has( itemData, key ), 'missing property: ' + key );
      } );
    }
  };

  unitRates.register( 'ShoppingItemData', ShoppingItemData );

  return ShoppingItemData;
} );
