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
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var blueCandyString = require( 'string!UNIT_RATES/blueCandy' );
  var greenCandyString = require( 'string!UNIT_RATES/greenCandy' );
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
   * @param {Object} itemDescription - see one of the static instances for an example
   * @constructor
   */
  function Candy( itemDescription ) {
    ShoppingItem.call( this, itemDescription );
  }

  unitRates.register( 'Candy', Candy );

  inherit( ShoppingItem, Candy );

  Candy.PURPLE_CANDY = new Candy( {
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
  } );

  Candy.RED_CANDY = new Candy( {
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
  } );

  Candy.GREEN_CANDY = new Candy( {
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
  } );

  Candy.BLUE_CANDY = new Candy( {
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
  } );

  return Candy;
} );
