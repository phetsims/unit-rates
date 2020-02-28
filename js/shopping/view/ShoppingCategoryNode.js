// Copyright 2016-2020, University of Colorado Boulder

/**
 * View components that are specific to a category in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import URConstants from '../../common/URConstants.js';
import unitRates from '../../unitRates.js';
import ShoppingSceneComboBox from './ShoppingSceneComboBox.js';
import ShoppingSceneNode from './ShoppingSceneNode.js';

/**
 * @param {ShoppingCategory} category
 * @param {Property.<ShoppingCategory>} categoryProperty
 * @param {Bounds2} layoutBounds
 * @param {KeypadLayer} keypadLayer
 * @param {ShoppingViewProperties} viewProperties
 * @param {Object} [options]
 * @constructor
 */
function ShoppingCategoryNode( category, categoryProperty, layoutBounds, keypadLayer, viewProperties, options ) {

  const self = this;

  Node.call( this );

  // parent for stuff that's specific to a scene, to maintain rendering order
  let shoppingSceneNode = null; // created below
  const shoppingSceneParent = new Node();
  this.addChild( shoppingSceneParent );

  // combo box, for selecting a scene, dispose required
  const comboBox = new ShoppingSceneComboBox( category.shoppingScenes, category.shoppingSceneProperty, this, {
    left: layoutBounds.left + URConstants.SCREEN_X_MARGIN,
    bottom: layoutBounds.bottom - 80
  } );
  this.addChild( comboBox );

  this.mutate( options );

  // Show this category when it's selected.
  const categoryObserver = function( newCategory ) {
    self.visible = ( newCategory === category );
  };
  categoryProperty.link( categoryObserver ); // unlink in dispose

  // When the selected scene changes, replace the UI elements that are item-specific
  const shoppingSceneObserver = function( shoppingScene ) {

    // remove the old scene
    if ( shoppingSceneNode ) {
      shoppingSceneNode.interruptSubtreeInput(); // cancel drags that are in progress
      shoppingSceneParent.removeChild( shoppingSceneNode );
      shoppingSceneNode.dispose();
    }

    // add the new scene
    shoppingSceneNode = new ShoppingSceneNode( shoppingScene, layoutBounds, keypadLayer, viewProperties );
    shoppingSceneParent.addChild( shoppingSceneNode );
  };
  category.shoppingSceneProperty.link( shoppingSceneObserver ); // unlink in dispose

  // @private
  this.disposeShoppingCategoryNode = function() {
    comboBox.dispose();
    categoryProperty.unlink( categoryObserver );
    category.shoppingSceneProperty.unlink( shoppingSceneObserver );
    shoppingSceneNode.dispose();
  };
}

unitRates.register( 'ShoppingCategoryNode', ShoppingCategoryNode );

export default inherit( Node, ShoppingCategoryNode, {

  // @public
  dispose: function() {
    this.disposeShoppingCategoryNode();
    Node.prototype.dispose.call( this );
  }
} );