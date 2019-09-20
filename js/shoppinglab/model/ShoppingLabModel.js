// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for the 'Shopping Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CandyScene = require( 'UNIT_RATES/shopping/model/CandyScene' );
  const FruitScene = require( 'UNIT_RATES/shopping/model/FruitScene' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Rate = require( 'UNIT_RATES/common/model/Rate' );
  const ShoppingCategory = require( 'UNIT_RATES/shopping/model/ShoppingCategory' );
  const ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  const ShoppingModel = require( 'UNIT_RATES/shopping/model/ShoppingModel' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const VegetableScene = require( 'UNIT_RATES/shopping/model/VegetableScene' );

  // images
  const appleImage = require( 'image!UNIT_RATES/apple.png' );
  const carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  const purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );

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
