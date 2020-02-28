// Copyright 2017-2020, University of Colorado Boulder

/**
 * View components that are specific to a category in the 'Shopping Lab' screen.
 * Since the Shopping Lab only has 1 scene per category, this is simply a parent node that controls visibility of that scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import unitRates from '../../unitRates.js';
import ShoppingLabSceneNode from './ShoppingLabSceneNode.js';

/**
 * @param {ShoppingCategory} category
 * @param {Property.<ShoppingCategory>} categoryProperty
 * @param {Bounds2} layoutBounds
 * @param {KeypadLayer} keypadLayer
 * @param {ShoppingViewProperties} viewProperties
 * @param {Object} [options]
 * @constructor
 */
function ShoppingLabCategoryNode( category, categoryProperty, layoutBounds, keypadLayer, viewProperties, options ) {

  const self = this;

  Node.call( this );

  // parent for stuff that's specific to a scene, to maintain rendering order
  assert && assert( category.shoppingScenes.length === 1, 'Shopping Lab screen supports 1 scene per category' );
  const shoppingSceneNode = new ShoppingLabSceneNode( category.shoppingScenes[ 0 ], layoutBounds, keypadLayer, viewProperties );
  this.addChild( shoppingSceneNode );

  this.mutate( options );

  // Show this category when it's selected.
  const categoryObserver = function( newCategory ) {
    self.visible = ( newCategory === category );
  };
  categoryProperty.link( categoryObserver ); // unlink in dispose

  // @private
  this.disposeShoppingLabCategoryNode = function() {
    categoryProperty.unlink( categoryObserver );
    shoppingSceneNode.dispose();
  };
}

unitRates.register( 'ShoppingLabCategoryNode', ShoppingLabCategoryNode );

export default inherit( Node, ShoppingLabCategoryNode, {

  // @public
  dispose: function() {
    this.disposeShoppingLabCategoryNode();
    Node.prototype.dispose.call( this );
  }
} );