// Copyright 2016-2020, University of Colorado Boulder

/**
 * Data structures that describe item types in the 'Shopping' screen.
 * These data structures are used to instantiate instances of ShoppingItem and its subtypes.
 * Using a data structure like this is an alternative to having a large number of constructor parameters.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import appleBagImage from '../../../images/apple_bag_png.js';
import appleImage from '../../../images/apple_png.js';
import blueCandyBagImage from '../../../images/blue_candy_bag_png.js';
import blueCandyImage from '../../../images/blue_candy_png.js';
import carrotBagImage from '../../../images/carrot_bag_png.js';
import carrotImage from '../../../images/carrot_png.js';
import cucumberBagImage from '../../../images/cucumber_bag_png.js';
import cucumberImage from '../../../images/cucumber_png.js';
import greenCandyBagImage from '../../../images/green_candy_bag_png.js';
import greenCandyImage from '../../../images/green_candy_png.js';
import lemonBagImage from '../../../images/lemon_bag_png.js';
import lemonImage from '../../../images/lemon_png.js';
import orangeBagImage from '../../../images/orange_bag_png.js';
import orangeImage from '../../../images/orange_png.js';
import pearBagImage from '../../../images/pear_bag_png.js';
import pearImage from '../../../images/pear_png.js';
import potatoBagImage from '../../../images/potato_bag_png.js';
import potatoImage from '../../../images/potato_png.js';
import purpleCandyBagImage from '../../../images/purple_candy_bag_png.js';
import purpleCandyImage from '../../../images/purple_candy_png.js';
import redCandyBagImage from '../../../images/red_candy_bag_png.js';
import redCandyImage from '../../../images/red_candy_png.js';
import tomatoBagImage from '../../../images/tomato_bag_png.js';
import tomatoImage from '../../../images/tomato_png.js';
import unitRates from '../../unitRates.js';
import unitRatesStrings from '../../unitRatesStrings.js';

const ShoppingItemData = {

  // Data structures that describe types of Fruit
  Fruit: {

    // NOTE: This instance is representative of 'item data', see assertIsItemData
    APPLES: {
      unitRate: 0.5, // {number} cost per item, in $
      numberOfBags: 3, // {number} number of bags of the item
      quantityPerBag: 5, // {number} quantity in each bag
      singularName: unitRatesStrings.apple, // {string} name to use for singular quantities (e.g. '1 Apple')
      pluralName: unitRatesStrings.apples, // {string} name to use for plural quantities (e.g. '2 Apples')
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
      singularName: unitRatesStrings.lemon,
      pluralName: unitRatesStrings.lemons,
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
      singularName: unitRatesStrings.orange,
      pluralName: unitRatesStrings.oranges,
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
      singularName: unitRatesStrings.pear,
      pluralName: unitRatesStrings.pears,
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
      singularName: unitRatesStrings.carrot,
      pluralName: unitRatesStrings.carrots,
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
      singularName: unitRatesStrings.cucumber,
      pluralName: unitRatesStrings.cucumbers,
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
      singularName: unitRatesStrings.potato,
      pluralName: unitRatesStrings.potatoes,
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
      singularName: unitRatesStrings.tomato,
      pluralName: unitRatesStrings.tomatoes,
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
      singularName: unitRatesStrings.purpleCandy,
      pluralName: unitRatesStrings.purpleCandy,
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
      singularName: unitRatesStrings.redCandy,
      pluralName: unitRatesStrings.redCandy,
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
      singularName: unitRatesStrings.greenCandy,
      pluralName: unitRatesStrings.greenCandy,
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
      singularName: unitRatesStrings.blueCandy,
      pluralName: unitRatesStrings.blueCandy,
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
  assertIsItemData: itemData => {

    // Instead of keeping a separate list of property names, assume that the APPLES instance is representative.
    const keys = _.keys( ShoppingItemData.Fruit.APPLES );

    keys.forEach( key => assert && assert( _.has( itemData, key ), `missing property: ${key}` ) );
  }
};

unitRates.register( 'ShoppingItemData', ShoppingItemData );

export default ShoppingItemData;