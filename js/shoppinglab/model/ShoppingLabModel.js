// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for the 'Shopping Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import appleImage from '../../../images/apple_png.js';
import carrotImage from '../../../images/carrot_png.js';
import purpleCandyImage from '../../../images/purple_candy_png.js';
import Rate from '../../common/model/Rate.js';
import CandyScene from '../../shopping/model/CandyScene.js';
import FruitScene from '../../shopping/model/FruitScene.js';
import ShoppingCategory from '../../shopping/model/ShoppingCategory.js';
import ShoppingItemData from '../../shopping/model/ShoppingItemData.js';
import ShoppingModel from '../../shopping/model/ShoppingModel.js';
import VegetableScene from '../../shopping/model/VegetableScene.js';
import unitRates from '../../unitRates.js';

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

inherit( ShoppingModel, ShoppingLabModel );
export default ShoppingLabModel;