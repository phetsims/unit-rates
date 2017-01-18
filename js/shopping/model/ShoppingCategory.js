// Copyright 2016, University of Colorado Boulder

/**
 * A category in the 'Shopping' screen. A category is a group of related scenes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

  /**
   * @param {HTMLImageElement} image - image used to represent the category
   * @param {ShoppingScene[]} shoppingScenes - scenes in the category
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingCategory( image, shoppingScenes, options ) {

    assert && assert( shoppingScenes.length > 0, 'at least 1 ShoppingScene is required' );

    options = _.extend( {

      // index of the scene that is initially selected, randomly chosen
      shoppingSceneIndex: URQueryParameters.randomEnabled ? phet.joist.random.nextIntBetween( 0, shoppingScenes.length - 1 ) : 0
    }, options );

    // validate options
    assert && assert( options.shoppingSceneIndex >= 0 && options.shoppingSceneIndex < shoppingScenes.length,
      'invalid shoppingSceneIndex: ' + options.shoppingSceneIndex );

    // @public (read-only)
    this.image = image;
    this.shoppingScenes = shoppingScenes;
    this.shoppingSceneProperty = new Property( shoppingScenes[ options.shoppingSceneIndex ] );
  }

  unitRates.register( 'ShoppingCategory', ShoppingCategory );

  return inherit( Object, ShoppingCategory, {

    // @public
    reset: function() {

      // Reset all scenes
      this.shoppingScenes.forEach( function( shoppingScene ) {
        shoppingScene.reset();
      } );

      // Randomly choose an item
      var shoppingSceneIndex = URQueryParameters.randomEnabled ? phet.joist.random.nextIntBetween( 0, this.shoppingScenes.length - 1 ) : 0;
      this.shoppingSceneProperty.value = this.shoppingScenes[ shoppingSceneIndex ];
    }
  } );
} );
