// Copyright 2016, University of Colorado Boulder

/**
 * Model for the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Candy = require( 'UNIT_RATES/shoppingNEW/model/Candy' );
  var Fruit = require( 'UNIT_RATES/shoppingNEW/model/Fruit' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ShoppingCategory = require( 'UNIT_RATES/shoppingNEW/model/ShoppingCategory' );
  var ShoppingItemData = require( 'UNIT_RATES/shoppingNEW/model/ShoppingItemData' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vegetable = require( 'UNIT_RATES/shoppingNEW/model/Vegetable' );

  // images
  var appleImage = require( 'image!UNIT_RATES/apple.png' );
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingModelNEW( options ) {

    options = _.extend( {
      categoryIndex: 0  // {number} index of the category that is initially selected
    }, options );

    // @public (read-only) items are grouped into categories
    this.categories = [

      // fruits
      new ShoppingCategory( appleImage, [
        new Fruit( ShoppingItemData.Fruit.APPLES ),
        new Fruit( ShoppingItemData.Fruit.LEMONS ),
        new Fruit( ShoppingItemData.Fruit.ORANGES ),
        new Fruit( ShoppingItemData.Fruit.PEARS )
      ] ),

      // vegetables
      new ShoppingCategory( carrotImage, [
        new Vegetable( ShoppingItemData.Vegetable.CARROTS ),
        new Vegetable( ShoppingItemData.Vegetable.CUCUMBERS ),
        new Vegetable( ShoppingItemData.Vegetable.POTATOES ),
        new Vegetable( ShoppingItemData.Vegetable.TOMATOES )
      ] ),

      // candies
      new ShoppingCategory( purpleCandyImage, [
        new Candy( ShoppingItemData.Candy.PURPLE_CANDY ),
        new Candy( ShoppingItemData.Candy.RED_CANDY ),
        new Candy( ShoppingItemData.Candy.GREEN_CANDY ),
        new Candy( ShoppingItemData.Candy.BLUE_CANDY )
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

  unitRates.register( 'ShoppingModelNEW', ShoppingModelNEW );

  return inherit( Object, ShoppingModelNEW, {

    // @public
    reset: function() {
      this.categoryProperty.reset();
      this.categories.forEach( function( category ) {
        category.reset();
      } );
    }
  } );
} );
