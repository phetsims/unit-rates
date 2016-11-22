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
   * @param {Object} itemDescription - see one of the static instances for an example
   * @constructor
   */
  function Fruit( itemDescription ) {
    ShoppingItem.call( this, itemDescription );
  }

  unitRates.register( 'Fruit', Fruit );

  inherit( ShoppingItem, Fruit );

  Fruit.APPLES = {
    unitRate: 0.5, // dollars per item
    bagRate: 2.50, // dollars per bag
    numberOfBags: 3,
    singularName: appleString,
    pluralName: applesString,
    numeratorName: dollarsString,
    denominatorName: applesString,
    itemImage: appleImage,
    bagImage: appleBagImage,
    questionSets: [
      [ 10, 6, 8 ],     // set A - [ question#2, question#3, question#4 ]
      [ 10, 16, 13 ],   // set B
      [ 15, 9, 7 ],     // set C
      [ 15, 4, 9 ]      // set D
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
    questionSets: [
      [ 10, 4, 14 ],
      [ 10, 14, 7 ],
      [ 15, 6, 11 ],
      [ 15, 6, 12 ]
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
    questionSets: [
      [ 10, 4, 11 ],
      [ 10, 16, 8 ],
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
    questionSets: [
      [ 10, 6, 16 ],
      [ 10, 14, 12 ],
      [ 15, 4, 8 ],
      [ 15, 11, 13 ]
    ]
  };

  return Fruit;
} );
