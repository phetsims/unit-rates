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
  var Candy = require( 'UNIT_RATES/shopping/model/Candy' );
  var Fruit = require( 'UNIT_RATES/shopping/model/Fruit' );
  var ShoppingCategory = require( 'UNIT_RATES/shopping/model/ShoppingCategory' );
  var ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vegetable = require( 'UNIT_RATES/shopping/model/Vegetable' );

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
