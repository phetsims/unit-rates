// Copyright 2016, University of Colorado Boulder

/**
 * A fruit item in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Question = require( 'UNIT_RATES/shoppingNEW/model/Question' );
  var ShoppingItem = require( 'UNIT_RATES/shoppingNEW/model/ShoppingItem' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var appleString = require( 'string!UNIT_RATES/apple' );
  var applesString = require( 'string!UNIT_RATES/apples' );
  var dollarsString = require( 'string!UNIT_RATES/dollars' );
  var lemonString = require( 'string!UNIT_RATES/lemon' );
  var lemonsString = require( 'string!UNIT_RATES/lemons' );
  var orangeString = require( 'string!UNIT_RATES/orange' );
  var orangesString = require( 'string!UNIT_RATES/oranges' );
  var pearString = require( 'string!UNIT_RATES/pear' );
  var pearsString = require( 'string!UNIT_RATES/pears' );

  // item images
  var appleImage = require( 'image!UNIT_RATES/apple.png' );
  var lemonImage = require( 'image!UNIT_RATES/lemon.png' );
  var orangeImage = require( 'image!UNIT_RATES/orange.png' );
  var pearImage = require( 'image!UNIT_RATES/pear.png' );

  // bag images
  var appleBagImage = require( 'image!UNIT_RATES/apple_bag.png' );
  var lemonBagImage = require( 'image!UNIT_RATES/lemon_bag.png' );
  var orangeBagImage = require( 'image!UNIT_RATES/orange_bag.png' );
  var pearBagImage = require( 'image!UNIT_RATES/pear_bag.png' );

  /**
   * @param {Object} itemData - data structure that describes a type of Fruit, see for example Fruit.APPLES
   * @constructor
   */
  function Fruit( itemData ) {

    // {Question} 'Unit Rate?'
    var unitRateQuestion = Question.createUnitRate( itemData.unitRate, itemData.singularName );

    // {Question[][]} instantiate Questions, grouped into sets
    var questionSets = [];
    itemData.questionQuantities.forEach( function( quantities ) {
      var questions = [];
      for ( var i = 0; i < quantities.length; i++ ) {
        var quantity = quantities[ i ];
        if ( i < quantities.length - 1 ) {

          // E.g., 'Cost of 3 Apples?'
          questions.push( Question.createCostOf( quantity, itemData.unitRate, itemData.singularName, itemData.pluralName ) );
        }
        else {

          // E.g., 'Apples for $3.00?'
          questions.push( Question.createItemsFor( quantity, itemData.unitRate, itemData.singularName, itemData.pluralName ) );
        }
      }
      questionSets.push( questions );
    } );

    ShoppingItem.call( this, itemData, unitRateQuestion, questionSets );
  }

  unitRates.register( 'Fruit', Fruit );

  inherit( ShoppingItem, Fruit );

  // Data structure that describes a type of Fruit
  Fruit.APPLES = {
    unitRate: 0.5, // cost per item
    bagRate: 2.50, // cost per bag
    numberOfBags: 3,
    singularName: appleString,
    pluralName: applesString,
    numeratorName: dollarsString,
    denominatorName: applesString,
    itemImage: appleImage,
    bagImage: appleBagImage,

    // Number of items for each question. See 'Unit Rates & Challenge Prompts' section of design document.
    questionQuantities: [
      [ 10, 6, 8 ],
      [ 10, 14, 13 ],
      [ 15, 9, 7 ],
      [ 15, 4, 9 ]
    ]
  };

  Fruit.LEMONS = {
    unitRate: 0.25, // dollars per item
    bagRate: 1.25, // dollars per bag
    numberOfBags: 3,
    singularName: lemonString,
    pluralName: lemonsString,
    numeratorName: dollarsString,
    denominatorName: lemonsString,
    itemImage: lemonImage,
    bagImage: lemonBagImage,
    questionQuantities: [
      [ 10, 4, 14 ],
      [ 10, 14, 7 ],
      [ 15, 6, 11 ],
      [ 15, 11, 9 ]
    ]
  };

  Fruit.ORANGES = {
    unitRate: 0.75, // dollars per item
    bagRate: 3.75, // dollars per bag
    numberOfBags: 3,
    singularName: orangeString,
    pluralName: orangesString,
    numeratorName: dollarsString,
    denominatorName: orangesString,
    itemImage: orangeImage,
    bagImage: orangeBagImage,
    questionQuantities: [
      [ 10, 4, 11 ],
      [ 10, 14, 8 ],
      [ 15, 9, 14 ],
      [ 15, 6, 12 ]
    ]
  };

  Fruit.PEARS = {
    unitRate: 0.40, // dollars per item
    bagRate: 2.00, // dollars
    numberOfBags: 3,
    singularName: pearString,
    pluralName: pearsString,
    numeratorName: dollarsString,
    denominatorName: pearsString,
    itemImage: pearImage,
    bagImage: pearBagImage,
    questionQuantities: [
      [ 10, 6, 7 ],
      [ 10, 14, 12 ],
      [ 15, 4, 8 ],
      [ 15, 11, 13 ]
    ]
  };

  return Fruit;
} );
