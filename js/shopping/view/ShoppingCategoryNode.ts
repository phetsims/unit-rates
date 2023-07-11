// Copyright 2016-2023, University of Colorado Boulder

/**
 * View components that are specific to a category in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import URConstants from '../../common/URConstants.js';
import unitRates from '../../unitRates.js';
import ShoppingSceneComboBox from './ShoppingSceneComboBox.js';
import ShoppingSceneNode from './ShoppingSceneNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import KeypadLayer from '../../common/view/KeypadLayer.js';
import ShoppingCategory from '../model/ShoppingCategory.js';
import Property from '../../../../axon/js/Property.js';
import ShoppingViewProperties from './ShoppingViewProperties.js';
import ShoppingScene from '../model/ShoppingScene.js';

export default class ShoppingCategoryNode extends Node {

  private readonly disposeShoppingCategoryNode: () => void;

  public constructor( category: ShoppingCategory,
                      categoryProperty: Property<ShoppingCategory>,
                      layoutBounds: Bounds2,
                      keypadLayer: KeypadLayer,
                      viewProperties: ShoppingViewProperties ) {

    super();

    // parent for stuff that's specific to a scene, to maintain rendering order
    const shoppingSceneParent = new Node();
    this.addChild( shoppingSceneParent );

    // combo box, for selecting a scene, dispose required
    const comboBox = new ShoppingSceneComboBox( category.shoppingSceneProperty, category.shoppingScenes, this, {
      left: layoutBounds.left + URConstants.SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - 80
    } );
    this.addChild( comboBox );

    // Show this category when it's selected.
    const categoryObserver = ( newCategory: ShoppingCategory ) => {
      this.visible = ( newCategory === category );
    };
    categoryProperty.link( categoryObserver ); // unlink in dispose

    // When the selected scene changes, replace the UI elements that are item-specific
    let shoppingSceneNode: Node;
    const shoppingSceneObserver = ( shoppingScene: ShoppingScene ) => {

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

    this.disposeShoppingCategoryNode = () => {
      comboBox.dispose();
      categoryProperty.unlink( categoryObserver );
      category.shoppingSceneProperty.unlink( shoppingSceneObserver );
      shoppingSceneNode.dispose();
    };
  }

  public override dispose(): void {
    this.disposeShoppingCategoryNode();
    super.dispose();
  }
}

unitRates.register( 'ShoppingCategoryNode', ShoppingCategoryNode );