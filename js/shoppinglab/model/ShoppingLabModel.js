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
  function ShoppingLabModel( options ) {

    options = _.extend( {
      categoryIndex: 0  // {number} index of the category that is initially selected
    }, options );

    // @public (read-only) unlike the 'Shopping' screen, each category in this screen has only 1 associated item
    this.categories = [

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
    ];

    // validate options
    assert && assert( options.categoryIndex >= 0 && options.categoryIndex < this.categories.length,
      'invalid categoryIndex: ' + options.categoryIndex );

    // @public the selected category
    this.categoryProperty = new Property( this.categories[ options.categoryIndex ], {
      validValues: this.categories
    } );
  }

  unitRates.register( 'ShoppingLabModel', ShoppingLabModel );

  return inherit( Object, ShoppingLabModel, {

    // @public
    step: function( dt ) {
      for ( var i = 0; i < this.categories.length; i++ ) {
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
} );
