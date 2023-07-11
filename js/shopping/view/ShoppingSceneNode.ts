// Copyright 2016-2023, University of Colorado Boulder

/**
 * View components that are specific to a scene in the 'Shopping' screen.
 * Adds a Questions accordion box to the base type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import URConstants from '../../common/URConstants.js';
import unitRates from '../../unitRates.js';
import BaseShoppingSceneNode from './BaseShoppingSceneNode.js';
import ShoppingQuestionsAccordionBox from './ShoppingQuestionsAccordionBox.js';
import ShoppingViewProperties from './ShoppingViewProperties.js';
import ShoppingScene from '../model/ShoppingScene.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import KeypadLayer from '../../common/view/KeypadLayer.js';

export default class ShoppingSceneNode extends BaseShoppingSceneNode {

  private readonly disposeShoppingSceneNode: () => void;

  public constructor( shoppingScene: ShoppingScene, layoutBounds: Bounds2, keypadLayer: KeypadLayer,
                      viewProperties: ShoppingViewProperties ) {

    super( shoppingScene, layoutBounds, keypadLayer, viewProperties );

    // Questions, dispose required
    const questionsAccordionBox = new ShoppingQuestionsAccordionBox( shoppingScene, keypadLayer, {
      expandedProperty: viewProperties.questionsExpandedProperty,
      right: layoutBounds.right - URConstants.SCREEN_X_MARGIN,
      top: this.doubleNumberLineAccordionBox.bottom + 10
    } );
    this.addChild( questionsAccordionBox );
    questionsAccordionBox.moveToBack();

    this.disposeShoppingSceneNode = () => {
      questionsAccordionBox.dispose();
    };
  }

  public override dispose(): void {
    this.disposeShoppingSceneNode();
    super.dispose();
  }
}

unitRates.register( 'ShoppingSceneNode', ShoppingSceneNode );