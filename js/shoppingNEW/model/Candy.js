// Copyright 2016, University of Colorado Boulder

/**
 * A candy item in the Shopping screen.
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
  var blueCandyString = require( 'string!UNIT_RATES/blueCandy' );
  var dollarsString = require( 'string!UNIT_RATES/dollars' );
  var greenCandyString = require( 'string!UNIT_RATES/greenCandy' );
  var poundString = require( 'string!UNIT_RATES/pound' );
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var purpleCandyString = require( 'string!UNIT_RATES/purpleCandy' );
  var redCandyString = require( 'string!UNIT_RATES/redCandy' );

  // item images
  var blueCandyImage = require( 'image!UNIT_RATES/blue_candy.png' );
  var greenCandyImage = require( 'image!UNIT_RATES/green_candy.png' );
  var purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );
  var redCandyImage = require( 'image!UNIT_RATES/red_candy.png' );

  // bag images
  var blueCandyBagImage = require( 'image!UNIT_RATES/blue_candy_bag.png' );
  var greenCandyBagImage = require( 'image!UNIT_RATES/green_candy_bag.png' );
  var purpleCandyBagImage = require( 'image!UNIT_RATES/purple_candy_bag.png' );
  var redCandyBagImage = require( 'image!UNIT_RATES/red_candy_bag.png' );

  /**
   * @param {Object} itemData - data structure that describes a type of candy, see for example Candy.PURPLE_CANDY
   * @constructor
   */
  function Candy( itemData ) {
    ShoppingItem.call( this, itemData, {

      // Candy questions use 'pound' and 'pounds' for the units, e.g. 'Cost of 2.2 pounds?'
      questionSingularUnits: poundString,
      questionPluralUnits: poundsString,

      // All Candy questions have the same form, i.e. 'Cost of N pounds?'
      uniformQuestions: true
    } );
  }

  unitRates.register( 'Candy', Candy );

  inherit( ShoppingItem, Candy );

  // Data structure that describes a type of Candy
  Candy.PURPLE_CANDY = {
    unitRate: 5.40, // cost per pound
    bagRate: 2.16, // cost per bag
    numberOfBags: 4,
    singularName: purpleCandyString,
    pluralName: purpleCandyString,
    numeratorName: dollarsString,
    denominatorName: poundsString,
    itemImage: purpleCandyImage,
    bagImage: purpleCandyBagImage,

    // Number of pounds for each question. See 'Unit Rates & Challenge Prompts' section of design document.
    questionQuantities: [
      [ 0.6, 2.2, 2.4 ],
      [ 1.5, 3.2, 3.1 ],
      [ 0.3, 2.4, 2.3 ],
      [ 1.3, 2.1, 2.5 ]
    ]
  };

  Candy.RED_CANDY = {
    unitRate: 3.80,
    bagRate: 1.14,
    numberOfBags: 4,
    singularName: redCandyString,
    pluralName: redCandyString,
    numeratorName: dollarsString,
    denominatorName: poundsString,
    itemImage: redCandyImage,
    bagImage: redCandyBagImage,
    questionQuantities: [
      [ 0.4, 2.3, 2 ],
      [ 0.7, 2.1, 2.4 ],
      [ 0.8, 1.7, 1.9 ],
      [ 1.3, 2.4, 2.8 ]
    ]
  };

  Candy.GREEN_CANDY = {
    unitRate: 8.20,
    bagRate: 2.46,
    numberOfBags: 4,
    singularName: greenCandyString,
    pluralName: greenCandyString,
    numeratorName: dollarsString,
    denominatorName: poundsString,
    itemImage: greenCandyImage,
    bagImage: greenCandyBagImage,
    questionQuantities: [
      [ 0.7, 1.9, 2.2 ],
      [ 1.3, 2.5, 2.4 ],
      [ 0.4, 1.8, 1.9 ],
      [ 1.5, 2.1, 1.8 ]
    ]
  };

  Candy.BLUE_CANDY = {
    unitRate: 1.30,
    bagRate: 0.52,
    numberOfBags: 4,
    singularName: blueCandyString,
    pluralName: blueCandyString,
    numeratorName: dollarsString,
    denominatorName: poundsString,
    itemImage: blueCandyImage,
    bagImage: blueCandyBagImage,
    questionQuantities: [
      [ 0.3, 1.9, 3.2 ],
      [ 0.7, 2.2, 2.3 ],
      [ 1.3, 2.6, 2.4 ],
      [ 1.4, 2.8, 2.9 ]
    ]
  };

  return Candy;
} );
