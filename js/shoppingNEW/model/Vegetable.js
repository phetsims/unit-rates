// Copyright 2016, University of Colorado Boulder

/**
 * A vegetable item in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ShoppingItem = require( 'UNIT_RATES/shoppingNEW/model/ShoppingItem' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var carrotString = require( 'string!UNIT_RATES/carrot' );
  var carrotsString = require( 'string!UNIT_RATES/carrots' );
  var cucumberString = require( 'string!UNIT_RATES/cucumber' );
  var cucumbersString = require( 'string!UNIT_RATES/cucumbers' );
  var dollarsString = require( 'string!UNIT_RATES/dollars' );
  var potatoString = require( 'string!UNIT_RATES/potato' );
  var potatoesString = require( 'string!UNIT_RATES/potatoes' );
  var tomatoString = require( 'string!UNIT_RATES/tomato' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );

  // item images
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var cucumberImage = require( 'image!UNIT_RATES/cucumber.png' );
  var potatoImage = require( 'image!UNIT_RATES/potato.png' );
  var tomatoImage = require( 'image!UNIT_RATES/tomato.png' );

  // bag images
  var carrotBagImage = require( 'image!UNIT_RATES/carrot_bag.png' );
  var cucumberBagImage = require( 'image!UNIT_RATES/cucumber_bag.png' );
  var potatoBagImage = require( 'image!UNIT_RATES/potato_bag.png' );
  var tomatoBagImage = require( 'image!UNIT_RATES/tomato_bag.png' );

  /**
   * @param {Object} itemData - data structure that describes a type of Vegetable, see for example Vegetable.CARROTS
   * @constructor
   */
  function Vegetable( itemData ) {
    ShoppingItem.call( this, itemData, {

      // Vegetables questions have 2 forms, e.g. 'Cost of 3 Carrots?' and 'Carrots for $3.00?'
      uniformQuestions: false
    } );
  }

  unitRates.register( 'Vegetable', Vegetable );

  inherit( ShoppingItem, Vegetable );

  // Data structure that describes a type of Vegetable
  Vegetable.CARROTS = {
    unitRate: 0.15, // cost per item
    bagRate: 0.60, // cost per bag
    numberOfBags: 4,
    singularName: carrotString,
    pluralName: carrotsString,
    numeratorName: dollarsString,
    denominatorName: carrotsString,
    itemImage: carrotImage,
    bagImage: carrotBagImage,

    // Number of items for each question. See 'Unit Rates & Challenge Prompts' section of design document.
    questionQuantities: [
      [ 9, 19, 21 ],
      [ 15, 25, 23 ],
      [ 6, 21, 36 ],
      [ 14, 18, 28 ]
    ]
  };

  Vegetable.CUCUMBERS = {
    unitRate: 0.22,
    bagRate: 0.66,
    numberOfBags: 4,
    singularName: cucumberString,
    pluralName: cucumbersString,
    numeratorName: dollarsString,
    denominatorName: cucumbersString,
    itemImage: cucumberImage,
    bagImage: cucumberBagImage,
    questionQuantities: [
      [ 7, 19, 18 ],
      [ 11, 25, 23 ],
      [ 8, 17, 27 ],
      [ 13, 23, 22 ]
    ]
  };

  Vegetable.POTATOES = {
    unitRate: 0.45,
    bagRate: 1.35,
    numberOfBags: 4,
    singularName: potatoString,
    pluralName: potatoesString,
    numeratorName: dollarsString,
    denominatorName: potatoesString,
    itemImage: potatoImage,
    bagImage: potatoBagImage,
    questionQuantities: [
      [ 7, 17, 21 ],
      [ 8, 19, 18 ],
      [ 11, 23, 25 ],
      [ 13, 25, 22 ]
    ]
  };

  Vegetable.TOMATOES = {
    unitRate: 0.3,
    bagRate: 1.20,
    numberOfBags: 4,
    singularName: tomatoString,
    pluralName: tomatoesString,
    numeratorName: dollarsString,
    denominatorName: tomatoesString,
    itemImage: tomatoImage,
    bagImage: tomatoBagImage,
    questionQuantities: [
      [ 7, 23, 28 ],
      [ 13, 25, 23 ],
      [ 14, 35, 26 ],
      [ 6, 21, 19 ]
    ]
  };

  return Vegetable;
} );
