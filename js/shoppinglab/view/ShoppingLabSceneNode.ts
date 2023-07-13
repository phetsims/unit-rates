// Copyright 2016-2023, University of Colorado Boulder

/**
 * View components that are specific to a scene in the 'Shopping Lab' screen.
 * Adds a Rate accordion box to the base type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import URConstants from '../../common/URConstants.js';
import RateAccordionBox from '../../common/view/RateAccordionBox.js';
import BaseShoppingSceneNode from '../../shopping/view/BaseShoppingSceneNode.js';
import unitRates from '../../unitRates.js';
import ShoppingScene from '../../shopping/model/ShoppingScene.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import KeypadLayer from '../../common/view/KeypadLayer.js';
import ShoppingViewProperties from '../../shopping/view/ShoppingViewProperties.js';

export default class ShoppingLabSceneNode extends BaseShoppingSceneNode {

  private readonly disposeShoppingLabSceneNode: () => void;

  public constructor( shoppingScene: ShoppingScene, layoutBounds: Bounds2, keypadLayer: KeypadLayer,
                      viewProperties: ShoppingViewProperties ) {

    super( shoppingScene, layoutBounds, keypadLayer, viewProperties, {
      extraCostDecimalVisible: true // {boolean} add an extra decimal place to cost on the scale
    } );

    // Rate accordion box, dispose required
    const rateAccordionBox = new RateAccordionBox( shoppingScene.rate, {
      numeratorRange: URConstants.COST_RANGE,
      denominatorRange: URConstants.QUANTITY_RANGE,
      numeratorUnits: shoppingScene.numeratorAxis.units,
      denominatorUnits: shoppingScene.denominatorAxis.units,
      denominatorPickerColor: shoppingScene.itemData.pickerColor,
      expandedProperty: viewProperties.rateExpandedProperty,
      left: layoutBounds.left + URConstants.SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - 100
    } );
    this.addChild( rateAccordionBox );
    rateAccordionBox.moveToBack();

    this.disposeShoppingLabSceneNode = () => {
      rateAccordionBox.dispose();
    };
  }

  public override dispose(): void {
    this.disposeShoppingLabSceneNode();
    super.dispose();
  }
}

unitRates.register( 'ShoppingLabSceneNode', ShoppingLabSceneNode );