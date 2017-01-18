// Copyright 2016, University of Colorado Boulder

/**
 * Model for the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var CandyScene = require( 'UNIT_RATES/shopping/model/CandyScene' );
  var FruitScene = require( 'UNIT_RATES/shopping/model/FruitScene' );
  var ShoppingCategory = require( 'UNIT_RATES/shopping/model/ShoppingCategory' );
  var ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var VegetableScene = require( 'UNIT_RATES/shopping/model/VegetableScene' );

  // images
  var appleImage = require( 'image!UNIT_RATES/apple.png' );
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingModel( options ) {

    options = _.extend( {
      categoryIndex: 0  // {number} index of the category that is initially selected
    }, options );

    // @public (read-only) items are grouped into categories
    this.categories = [

      //TODO revisit this, I don't like how it's possible to pass a ShoppingItemData.Fruit to a non-FruitScene
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

  return inherit( Object, ShoppingModel, {

    // @public
    reset: function() {
      this.categoryProperty.reset();
      this.categories.forEach( function( category ) {
        category.reset();
      } );
    }
  } );
} );
