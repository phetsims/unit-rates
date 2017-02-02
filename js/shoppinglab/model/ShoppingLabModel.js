// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Shopping Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var CandyScene = require( 'UNIT_RATES/shopping/model/CandyScene' );
  var FruitScene = require( 'UNIT_RATES/shopping/model/FruitScene' );
  var ShoppingCategory = require( 'UNIT_RATES/shopping/model/ShoppingCategory' );
  var ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  var ShoppingModel = require( 'UNIT_RATES/shopping/model/ShoppingModel' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var VegetableScene = require( 'UNIT_RATES/shopping/model/VegetableScene' );

  // images
  var appleImage = require( 'image!UNIT_RATES/apple.png' );
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );

  /**
   * @constructor
   */
  function ShoppingLabModel() {

    ShoppingModel.call( this, {

      // unlike the 'Shopping' screen, each category in 'Shopping Lab' has only 1 associated item
      categories: [

        // fruits
        new ShoppingCategory( appleImage, [
          new FruitScene( ShoppingItemData.Fruit.APPLES, {
            denominatorOptions: {
              pickerColor: 'red'
            }
          } )
        ] ),

        // vegetables
        new ShoppingCategory( carrotImage, [
          new VegetableScene( ShoppingItemData.Vegetable.CARROTS, {
            denominatorOptions: {
              pickerColor: 'orange'
            }
          } )
        ] ),

        // candies
        new ShoppingCategory( purpleCandyImage, [
          new CandyScene( ShoppingItemData.Candy.PURPLE_CANDY, {
            denominatorOptions: {
              pickerColor: 'purple'
            }
          } )
        ] )
      ]
    } );
  }

  unitRates.register( 'ShoppingLabModel', ShoppingLabModel );

  return inherit( ShoppingModel, ShoppingLabModel );
} );
