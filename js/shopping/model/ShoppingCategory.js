// Copyright 2016-2019, University of Colorado Boulder

/**
 * A category in the 'Shopping' screen. A category is a group of related scenes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import URQueryParameters from '../../common/URQueryParameters.js';
import unitRates from '../../unitRates.js';

/**
 * @param {HTMLImageElement} image - image used to represent the category
 * @param {ShoppingScene[]} shoppingScenes - scenes in the category
 * @param {Object} [options]
 * @constructor
 */
function ShoppingCategory( image, shoppingScenes, options ) {

  assert && assert( shoppingScenes.length > 0, 'at least 1 ShoppingScene is required' );

  options = merge( {

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

export default inherit( Object, ShoppingCategory, {

  /**
   * Updates time-dependent parts of the model.
   * @param {number} dt - time since the previous step, in seconds
   * @public
   */
  step: function( dt ) {

    // step the selected scene
    for ( let i = 0; i < this.shoppingScenes.length; i++ ) {
      if ( this.shoppingScenes[ i ] === this.shoppingSceneProperty.value ) {
        this.shoppingScenes[ i ].step( dt );
        break;
      }
    }
  },

  // @public
  reset: function() {

    // Reset all scenes
    this.shoppingScenes.forEach( function( shoppingScene ) {
      shoppingScene.reset();
    } );

    this.shoppingSceneProperty.reset();
  }
} );