// Copyright 2016-2017, University of Colorado Boulder

/**
 * View components that are specific to a scene in the 'Shopping' screen.
 * Adds a Questions accordion box to the base type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BaseShoppingSceneNode = require( 'UNIT_RATES/shopping/view/BaseShoppingSceneNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShoppingQuestionsAccordionBox = require( 'UNIT_RATES/shopping/view/ShoppingQuestionsAccordionBox' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );

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
    var questionsAccordionBox = new ShoppingQuestionsAccordionBox( shoppingScene, keypadLayer, {
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

  return inherit( BaseShoppingSceneNode, ShoppingSceneNode, {

    // @public
    dispose: function() {
      this.disposeShoppingSceneNode();
      BaseShoppingSceneNode.prototype.dispose.call( this );
    }
  } );
} );
