// Copyright 2016, University of Colorado Boulder

/**
 * View for the 'Shopping Lab' screen.
 * This is derived from URShoppingScreenView and adds rate adjustment panel to it.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemRateNode = require( 'UNIT_RATES/shoppingLab/view/ItemRateNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URShoppingScreenView = require( 'UNIT_RATES/common/shopping/view/URShoppingScreenView' );

  /**
   * @param {ShoppingLabModel} model
   * @constructor
   */
  function ShoppingLabScreenView( model ) {

    URShoppingScreenView.call( this, model, true, this.onNumberLineEraseCallback.bind( this ) );

    var self = this;
    model.itemRateProperty.link( function( itemRate, oldRate ) {
      self.refreshNumberLine();
    } );
  }

  unitRates.register( 'ShoppingLabScreenView', ShoppingLabScreenView );

  return inherit( URShoppingScreenView, ShoppingLabScreenView, {

    /**
     * Called from constructor to give subclass a chance to add UI elements at a specific point in the constructor
     *
     * @protected
     */
    addSubclassScreenNodes: function() {

      this.itemRateNode = new ItemRateNode( this.model.itemTypeProperty, this.model.itemRateProperty, {
        left: this.layoutBounds.left + URConstants.PANEL_SPACING,
        bottom: this.scaleNode.bottom
      } );
      this.addChild( this.itemRateNode );
    },

    /**
     * Called from constructor to give subclass a chance to add UI elements at a specific point in the constructor
     *
     * @protected
     */
    onNumberLineEraseCallback: function() {
      this.model.addScaleItemsToNumberLine();
      this.numberLineNode.populate();
    },

    /**
     * TODO document, https://github.com/phetsims/unit-rates/issues/64
     *
     * @protected
     */
    refreshNumberLine: function() {
      this.numberLineNode.removeAllMarkerNodes();
      this.numberLineNode.populate();
    },

    /**
     * Called when the user selects the sim reset button
     *
     * @protected
     * @override
     */
    resetAll: function() {
      this.itemRateNode.reset();
      URShoppingScreenView.prototype.resetAll.call( this );
    }
  } );
} );

