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
      new ShoppingCategory( appleImage, [ Fruit.APPLES, Fruit.LEMONS, Fruit.ORANGES, Fruit.PEARS ] ),
      new ShoppingCategory( carrotImage, [ Vegetable.CARROTS, Vegetable.CUCUMBERS, Vegetable.POTATOES, Vegetable.TOMATOES ] ),
      new ShoppingCategory( purpleCandyImage, [ Candy.PURPLE_CANDY, Candy.RED_CANDY, Candy.GREEN_CANDY, Candy.BLUE_CANDY ] )
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
