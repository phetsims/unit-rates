// Copyright 2016-2019, University of Colorado Boulder

/**
 * Model for the 'Shopping' screen. Also used as the base type for the 'Shopping Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import appleImage from '../../../images/apple_png.js';
import carrotImage from '../../../images/carrot_png.js';
import purpleCandyImage from '../../../images/purple_candy_png.js';
import unitRates from '../../unitRates.js';
import CandyScene from './CandyScene.js';
import FruitScene from './FruitScene.js';
import ShoppingCategory from './ShoppingCategory.js';
import ShoppingItemData from './ShoppingItemData.js';
import VegetableScene from './VegetableScene.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function ShoppingModel( options ) {

  options = merge( {
    categoryIndex: 0, // {number} index of the category that is initially selected
    categories: null // {ShoppingCategory[]} categories, populated below if not provided
  }, options );

  // @public (read-only) items are grouped into categories
  this.categories = options.categories || [

    // fruits
    new ShoppingCategory( appleImage, [
      new FruitScene( ShoppingItemData.Fruit.APPLES ),
      new FruitScene( ShoppingItemData.Fruit.LEMONS ),
      new FruitScene( ShoppingItemData.Fruit.ORANGES ),
      new FruitScene( ShoppingItemData.Fruit.PEARS )
    ] ),

    // vegetables
    new ShoppingCategory( carrotImage, [
      new VegetableScene( ShoppingItemData.Vegetable.CARROTS ),
      new VegetableScene( ShoppingItemData.Vegetable.CUCUMBERS ),
      new VegetableScene( ShoppingItemData.Vegetable.POTATOES ),
      new VegetableScene( ShoppingItemData.Vegetable.TOMATOES )
    ] ),

    // candies
    new ShoppingCategory( purpleCandyImage, [
      new CandyScene( ShoppingItemData.Candy.PURPLE_CANDY ),
      new CandyScene( ShoppingItemData.Candy.RED_CANDY ),
      new CandyScene( ShoppingItemData.Candy.GREEN_CANDY ),
      new CandyScene( ShoppingItemData.Candy.BLUE_CANDY )
    ] )
  ];

  // validate options
  assert && assert( options.categoryIndex >= 0 && options.categoryIndex < this.categories.length,
    'invalid categoryIndex: ' + options.categoryIndex );

  // @public the selected category
  this.categoryProperty = new Property( this.categories[ options.categoryIndex ], {
    validValues: this.categories
  } );
}

unitRates.register( 'ShoppingModel', ShoppingModel );

export default inherit( Object, ShoppingModel, {

  /**
   * Updates time-dependent parts of the model.
   * @param {number} dt - time since the previous step, in seconds
   * @public
   */
  step: function( dt ) {

    // Cap dt, see https://github.com/phetsims/unit-rates/issues/193
    dt = Math.min( dt, 0.1 );

    // step the selected category
    for ( let i = 0; i < this.categories.length; i++ ) {
      if ( this.categories[ i ] === this.categoryProperty.value ) {
        this.categories[ i ].step( dt );
        break;
      }
    }
  },

  // @public
  reset: function() {
    this.categoryProperty.reset();
    this.categories.forEach( function( category ) {
      category.reset();
    } );
  }
} );