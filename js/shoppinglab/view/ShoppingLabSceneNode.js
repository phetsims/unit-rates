// Copyright 2017, University of Colorado Boulder

/**
 * View components that are specific to a scene in the 'Shopping Lab' screen.
 * Adds a Rate accordion box to the base type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BaseShoppingSceneNode = require( 'UNIT_RATES/shopping/view/BaseShoppingSceneNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RateAccordionBox = require( 'UNIT_RATES/common/view/RateAccordionBox' );
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
  function ShoppingLabSceneNode( shoppingScene, layoutBounds, keypadLayer, viewProperties, options ) {

    options = _.extend( {
      extraCostDecimalVisible: true // {boolean} add an extra decimal place to cost on the scale
    }, options );

    BaseShoppingSceneNode.call( this, shoppingScene, layoutBounds, keypadLayer, viewProperties, options );

    // Rate accordion box, dispose required
    var rateAccordionBox = new RateAccordionBox( shoppingScene.rate, {
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

  return inherit( BaseShoppingSceneNode, ShoppingLabSceneNode, {

    // @public
    dispose: function() {
      this.disposeShoppingLabSceneNode();
      ShoppingLabSceneNode.prototype.dispose.call( this );
    }
  } );
} );
