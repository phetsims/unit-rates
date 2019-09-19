// Copyright 2016-2017, University of Colorado Boulder

/**
 * Data structures that describe item types in the 'Shopping' screen.
 * These data structures are used to instantiate instances of ShoppingItem and its subtypes.
 * Using a data structure like this is an alternative to having a large number of constructor parameters.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const unitRates = require( 'UNIT_RATES/unitRates' );

  // Fruit strings
  const applesString = require( 'string!UNIT_RATES/apples' );
  const appleString = require( 'string!UNIT_RATES/apple' );
  const lemonsString = require( 'string!UNIT_RATES/lemons' );
  const lemonString = require( 'string!UNIT_RATES/lemon' );
  const orangesString = require( 'string!UNIT_RATES/oranges' );
  const orangeString = require( 'string!UNIT_RATES/orange' );
  const pearsString = require( 'string!UNIT_RATES/pears' );
  const pearString = require( 'string!UNIT_RATES/pear' );

  // Fruit images
  const appleBagImage = require( 'image!UNIT_RATES/apple_bag.png' );
  const appleImage = require( 'image!UNIT_RATES/apple.png' );
  const lemonBagImage = require( 'image!UNIT_RATES/lemon_bag.png' );
  const lemonImage = require( 'image!UNIT_RATES/lemon.png' );
  const orangeBagImage = require( 'image!UNIT_RATES/orange_bag.png' );
  const orangeImage = require( 'image!UNIT_RATES/orange.png' );
  const pearBagImage = require( 'image!UNIT_RATES/pear_bag.png' );
  const pearImage = require( 'image!UNIT_RATES/pear.png' );

  // Vegetable strings
  const carrotsString = require( 'string!UNIT_RATES/carrots' );
  const carrotString = require( 'string!UNIT_RATES/carrot' );
  const cucumbersString = require( 'string!UNIT_RATES/cucumbers' );
  const cucumberString = require( 'string!UNIT_RATES/cucumber' );
  const potatoesString = require( 'string!UNIT_RATES/potatoes' );
  const potatoString = require( 'string!UNIT_RATES/potato' );
  const tomatoesString = require( 'string!UNIT_RATES/tomatoes' );
  const tomatoString = require( 'string!UNIT_RATES/tomato' );

  // Vegetable images
  const carrotBagImage = require( 'image!UNIT_RATES/carrot_bag.png' );
  const carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  const cucumberBagImage = require( 'image!UNIT_RATES/cucumber_bag.png' );
  const cucumberImage = require( 'image!UNIT_RATES/cucumber.png' );
  const potatoBagImage = require( 'image!UNIT_RATES/potato_bag.png' );
  const potatoImage = require( 'image!UNIT_RATES/potato.png' );
  const tomatoBagImage = require( 'image!UNIT_RATES/tomato_bag.png' );
  const tomatoImage = require( 'image!UNIT_RATES/tomato.png' );

  // Candy strings
  const blueCandyString = require( 'string!UNIT_RATES/blueCandy' );
  const greenCandyString = require( 'string!UNIT_RATES/greenCandy' );
  const purpleCandyString = require( 'string!UNIT_RATES/purpleCandy' );
  const redCandyString = require( 'string!UNIT_RATES/redCandy' );

  // Candy images
  const blueCandyBagImage = require( 'image!UNIT_RATES/blue_candy_bag.png' );
  const blueCandyImage = require( 'image!UNIT_RATES/blue_candy.png' );
  const greenCandyBagImage = require( 'image!UNIT_RATES/green_candy_bag.png' );
  const greenCandyImage = require( 'image!UNIT_RATES/green_candy.png' );
  const purpleCandyBagImage = require( 'image!UNIT_RATES/purple_candy_bag.png' );
  const purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );
  const redCandyBagImage = require( 'image!UNIT_RATES/red_candy_bag.png' );
  const redCandyImage = require( 'image!UNIT_RATES/red_candy.png' );

  var ShoppingItemData = {

    // Data structures that describe types of Fruit
    Fruit: {

      // NOTE: This instance is representative of 'item data', see assertIsItemData
      APPLES: {
        unitRate: 0.5, // {number} cost per item, in $
        numberOfBags: 3, // {number} number of bags of the item
        quantityPerBag: 5, // {number} quantity in each bag
        singularName: appleString, // {string} name to use for singular quantities (e.g. '1 Apple')
        pluralName: applesString, // {string} name to use for plural quantities (e.g. '2 Apples')
        itemImage: appleImage, // {HTMLImageElement} image for individual items
        itemRowOverlap: 7, // {number} for tweaking how items overlap when stacked, specific to itemImage
        bagImage: appleBagImage, // {HTMLImageElement} image for a bag of items

        // {number[][]} Number of items (or pounds, for Candy) for each question, grouped into 'question sets'.
        // See 'Unit Rates & Challenge Prompts' table in design document.
        // ShoppingQuestionFactory takes these values and creates ShoppingQuestion instances.
        questionQuantities: [
          [ 10, 6, 8 ],
          [ 10, 14, 13 ],
          [ 15, 9, 7 ],
          [ 15, 4, 9 ]
        ]
      },

      LEMONS: {
        unitRate: 0.25,
        numberOfBags: 3,
        quantityPerBag: 5,
        singularName: lemonString,
        pluralName: lemonsString,
        itemImage: lemonImage,
        itemRowOverlap: 5,
        bagImage: lemonBagImage,

        // number of items
        questionQuantities: [
          [ 10, 4, 14 ],
          [ 10, 14, 7 ],
          [ 15, 6, 11 ],
          [ 15, 11, 9 ]
        ]
      },

      ORANGES: {
        unitRate: 0.75,
        numberOfBags: 3,
        quantityPerBag: 5,
        singularName: orangeString,
        pluralName: orangesString,
        itemImage: orangeImage,
        itemRowOverlap: 5,
        bagImage: orangeBagImage,

        // number of items
        questionQuantities: [
          [ 10, 4, 11 ],
          [ 10, 14, 8 ],
          [ 15, 9, 14 ],
          [ 15, 6, 12 ]
        ]
      },

      PEARS: {
        unitRate: 0.40,
        numberOfBags: 3,
        quantityPerBag: 5,
        singularName: pearString,
        pluralName: pearsString,
        itemImage: pearImage,
        itemRowOverlap: 5,
        bagImage: pearBagImage,

        // number of items
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
        numberOfBags: 4,
        quantityPerBag: 4,
        singularName: carrotString,
        pluralName: carrotsString,
        itemImage: carrotImage,
        itemRowOverlap: 0,
        bagImage: carrotBagImage,

        // number of items
        questionQuantities: [
          [ 9, 19, 21 ],
          [ 15, 25, 23 ],
          [ 6, 21, 36 ],
          [ 14, 18, 28 ]
        ]
      },

      CUCUMBERS: {
        unitRate: 0.22,
        numberOfBags: 4,
        quantityPerBag: 3,
        singularName: cucumberString,
        pluralName: cucumbersString,
        itemImage: cucumberImage,
        itemRowOverlap: 0,
        bagImage: cucumberBagImage,

        // number of items
        questionQuantities: [
          [ 7, 19, 18 ],
          [ 11, 25, 23 ],
          [ 8, 17, 27 ],
          [ 13, 23, 22 ]
        ]
      },

      POTATOES: {
        unitRate: 0.45,
        numberOfBags: 4,
        quantityPerBag: 3,
        singularName: potatoString,
        pluralName: potatoesString,
        itemImage: potatoImage,
        itemRowOverlap: 0,
        bagImage: potatoBagImage,

        // number of items
        questionQuantities: [
          [ 7, 17, 21 ],
          [ 8, 19, 18 ],
          [ 11, 23, 25 ],
          [ 13, 25, 22 ]
        ]
      },

      TOMATOES: {
        unitRate: 0.3,
        numberOfBags: 4,
        quantityPerBag: 4,
        singularName: tomatoString,
        pluralName: tomatoesString,
        itemImage: tomatoImage,
        itemRowOverlap: 0,
        bagImage: tomatoBagImage,

        // number of items
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
        numberOfBags: 4,
        quantityPerBag: 0.4,
        singularName: purpleCandyString,
        pluralName: purpleCandyString,
        itemImage: purpleCandyImage,
        itemRowOverlap: 0,
        bagImage: purpleCandyBagImage,

        // pounds
        questionQuantities: [
          [ 0.6, 2.2, 2.4 ],
          [ 1.5, 3.2, 3.1 ],
          [ 0.3, 2.4, 2.3 ],
          [ 1.3, 2.1, 2.5 ]
        ]
      },

      RED_CANDY: {
        unitRate: 3.80,
        numberOfBags: 4,
        quantityPerBag: 0.3,
        singularName: redCandyString,
        pluralName: redCandyString,
        itemImage: redCandyImage,
        itemRowOverlap: 0,
        bagImage: redCandyBagImage,

        // pounds
        questionQuantities: [
          [ 0.4, 2.3, 2 ],
          [ 0.7, 2.1, 2.4 ],
          [ 0.8, 1.7, 1.9 ],
          [ 1.3, 2.4, 2.8 ]
        ]
      },

      GREEN_CANDY: {
        unitRate: 8.20,
        numberOfBags: 4,
        quantityPerBag: 0.3,
        singularName: greenCandyString,
        pluralName: greenCandyString,
        itemImage: greenCandyImage,
        itemRowOverlap: 0,
        bagImage: greenCandyBagImage,

        // pounds
        questionQuantities: [
          [ 0.7, 1.9, 2.2 ],
          [ 1.3, 2.5, 2.4 ],
          [ 0.4, 1.8, 1.9 ],
          [ 1.5, 2.1, 1.8 ]
        ]
      },

      BLUE_CANDY: {
        unitRate: 1.30,
        numberOfBags: 4,
        quantityPerBag: 0.4,
        singularName: blueCandyString,
        pluralName: blueCandyString,
        itemImage: blueCandyImage,
        itemRowOverlap: 0,
        bagImage: blueCandyBagImage,

        // pounds
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
      const keys = _.keys( ShoppingItemData.Fruit.APPLES );

      keys.forEach( function( key ) {
        assert && assert( _.has( itemData, key ), 'missing property: ' + key );
      } );
    }
  };

  unitRates.register( 'ShoppingItemData', ShoppingItemData );

  return ShoppingItemData;
} );
