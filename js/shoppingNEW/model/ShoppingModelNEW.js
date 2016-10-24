// Copyright 2016, University of Colorado Boulder

/**
 * Model for the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ShoppingItem = require( 'UNIT_RATES/shoppingNEW/model/ShoppingItem' );
  var ShoppingSceneNEW = require( 'UNIT_RATES/shoppingNEW/model/ShoppingSceneNEW' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

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
      sceneIndex: 0  // {number} index of the scene that is initially selected
    }, options );

    // @public (read-only)
    this.scenes = [
      new ShoppingSceneNEW( 'fruits', appleImage, [ ShoppingItem.APPLES, ShoppingItem.LEMONS, ShoppingItem.ORANGES, ShoppingItem.PEARS ] ),
      new ShoppingSceneNEW( 'vegetables', carrotImage, [ ShoppingItem.CARROTS, ShoppingItem.CUCUMBERS, ShoppingItem.POTATOES, ShoppingItem.TOMATOES ] ),
      new ShoppingSceneNEW( 'candies', purpleCandyImage, [ ShoppingItem.PURPLE_CANDY, ShoppingItem.RED_CANDY, ShoppingItem.GREEN_CANDY, ShoppingItem.BLUE_CANDY ] )
    ];

    // validate options
    assert && assert( options.sceneIndex >= 0 && options.sceneIndex < this.scenes.length, 'invalid sceneIndex: ' + options.sceneIndex );

    // @public the selected scene
    this.sceneProperty = new Property( this.scenes[ options.sceneIndex ], {
      validValues: this.scenes
    } );
  }

  unitRates.register( 'ShoppingModelNEW', ShoppingModelNEW );

  return inherit( Object, ShoppingModelNEW, {

    // @public
    reset: function() {
      this.sceneProperty.reset();
      this.scenes.forEach( function( scene ) {
        scene.reset();
      } );
    }
  } );
} );
