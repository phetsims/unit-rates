// Copyright 2016-2020, University of Colorado Boulder

/**
 * View components that are specific to a scene in the 'Shopping Lab' screen.
 * Adds a Rate accordion box to the base type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import URConstants from '../../common/URConstants.js';
import RateAccordionBox from '../../common/view/RateAccordionBox.js';
import BaseShoppingSceneNode from '../../shopping/view/BaseShoppingSceneNode.js';
import unitRates from '../../unitRates.js';

/**
 * @param {ShoppingScene} shoppingScene
 * @param {Bounds2} layoutBounds
 * @param {KeypadLayer} keypadLayer
 * @param {ShoppingViewProperties} viewProperties
 * @param {Object} [options]
 * @constructor
 */
function ShoppingLabSceneNode( shoppingScene, layoutBounds, keypadLayer, viewProperties, options ) {

  options = merge( {
    extraCostDecimalVisible: true // {boolean} add an extra decimal place to cost on the scale
  }, options );

  BaseShoppingSceneNode.call( this, shoppingScene, layoutBounds, keypadLayer, viewProperties, options );

  // Rate accordion box, dispose required
  const rateAccordionBox = new RateAccordionBox( shoppingScene.rate, {
    numeratorRange: URConstants.COST_RANGE,
    denominatorRange: URConstants.QUANTITY_RANGE,
    numeratorUnits: shoppingScene.numeratorOptions.axisLabel,  // matches the axis of the double number line
    numeratorPickerColor: shoppingScene.numeratorOptions.pickerColor,
    denominatorUnits: shoppingScene.denominatorOptions.axisLabel,  // matches the axis of the double number line
    denominatorPickerColor: shoppingScene.denominatorOptions.pickerColor,
    expandedProperty: viewProperties.rateExpandedProperty,
    left: layoutBounds.left + URConstants.SCREEN_X_MARGIN,
    bottom: layoutBounds.bottom - 100
  } );
  this.addChild( rateAccordionBox );
  rateAccordionBox.moveToBack();

  // @private
  this.disposeShoppingLabSceneNode = function() {
    rateAccordionBox.dispose();
  };
}

unitRates.register( 'ShoppingLabSceneNode', ShoppingLabSceneNode );

export default inherit( BaseShoppingSceneNode, ShoppingLabSceneNode, {

  // @public
  dispose: function() {
    this.disposeShoppingLabSceneNode();
    BaseShoppingSceneNode.prototype.dispose.call( this );
  }
} );