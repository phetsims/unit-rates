// Copyright 2016-2019, University of Colorado Boulder

/**
 * View components that are specific to a scene in the 'Shopping' screen.
 * Adds a Questions accordion box to the base type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import URConstants from '../../common/URConstants.js';
import unitRates from '../../unitRates.js';
import BaseShoppingSceneNode from './BaseShoppingSceneNode.js';
import ShoppingQuestionsAccordionBox from './ShoppingQuestionsAccordionBox.js';

/**
 * @param {ShoppingScene} shoppingScene
 * @param {Bounds2} layoutBounds
 * @param {KeypadLayer} keypadLayer
 * @param {ShoppingViewProperties} viewProperties
 * @param {Object} [options]
 * @constructor
 */
function ShoppingSceneNode( shoppingScene, layoutBounds, keypadLayer, viewProperties, options ) {

  BaseShoppingSceneNode.call( this, shoppingScene, layoutBounds, keypadLayer, viewProperties, options );

  // Questions, dispose required
  const questionsAccordionBox = new ShoppingQuestionsAccordionBox( shoppingScene, keypadLayer, {
    expandedProperty: viewProperties.questionsExpandedProperty,
    right: layoutBounds.right - URConstants.SCREEN_X_MARGIN,
    top: this.doubleNumberLineAccordionBox.bottom + 10
  } );
  this.addChild( questionsAccordionBox );
  questionsAccordionBox.moveToBack();

  // @private
  this.disposeShoppingSceneNode = function() {
    questionsAccordionBox.dispose();
  };
}

unitRates.register( 'ShoppingSceneNode', ShoppingSceneNode );

export default inherit( BaseShoppingSceneNode, ShoppingSceneNode, {

  // @public
  dispose: function() {
    this.disposeShoppingSceneNode();
    BaseShoppingSceneNode.prototype.dispose.call( this );
  }
} );