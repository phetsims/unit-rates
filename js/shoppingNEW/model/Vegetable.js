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
  var potatoString = require( 'string!UNIT_RATES/potato' );
  var potatoesString = require( 'string!UNIT_RATES/potatoes' );
  var tomatoString = require( 'string!UNIT_RATES/tomato' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );

  // images
  var carrotBagImage = require( 'image!UNIT_RATES/carrot_bag.png' );
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var cucumberBagImage = require( 'image!UNIT_RATES/cucumber_bag.png' );
  var cucumberImage = require( 'image!UNIT_RATES/cucumber.png' );
  var potatoBagImage = require( 'image!UNIT_RATES/potato_bag.png' );
  var potatoImage = require( 'image!UNIT_RATES/potato.png' );
  var tomatoBagImage = require( 'image!UNIT_RATES/tomato_bag.png' );
  var tomatoImage = require( 'image!UNIT_RATES/tomato.png' );

  /**
   * @param {Object} itemDescription - see one of the static instances for an example
   * @constructor
   */
  function Vegetable( itemDescription ) {
    ShoppingItem.call( this, itemDescription );
  }

  unitRates.register( 'Vegetable', Vegetable );

  inherit( ShoppingItem, Vegetable );

  Vegetable.CARROTS = new Vegetable( {
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
  } );

  Vegetable.CUCUMBERS = new Vegetable( {
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
  } );

  Vegetable.POTATOES = new Vegetable( {
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
  } );

  Vegetable.TOMATOES = new Vegetable( {
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
  } );

  return Vegetable;
} );
