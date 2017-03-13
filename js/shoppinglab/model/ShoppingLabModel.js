// Copyright 2016-2017, University of Colorado Boulder

/**
 * Model for the 'Shopping Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CandyScene = require( 'UNIT_RATES/shopping/model/CandyScene' );
  var FruitScene = require( 'UNIT_RATES/shopping/model/FruitScene' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rate = require( 'UNIT_RATES/common/model/Rate' );
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
            rate: new Rate( 1, 1 ),
            denominatorOptions: {
              pickerColor: 'red'
            }
          } )
        ] ),

        // vegetables
        new ShoppingCategory( carrotImage, [
          new VegetableScene( ShoppingItemData.Vegetable.CARROTS, {
            rate: new Rate( 3, 4 ),
            denominatorOptions: {
              pickerColor: 'orange'
            }
          } )
        ] ),

        // candies
        new ShoppingCategory( purpleCandyImage, [
          new CandyScene( ShoppingItemData.Candy.PURPLE_CANDY, {
            rate: new Rate( 3, 2 ),
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
