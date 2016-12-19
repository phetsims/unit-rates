// Copyright 2016, University of Colorado Boulder

/**
 * View for the 'Shopping Lab' screen.
 * This is derived from URShoppingScreenView and adds rate adjustment panel to it.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var OLDItemRateNode = require( 'UNIT_RATES/old/shoppingLab/view/OLDItemRateNode' );
  var OLDURConstants = require( 'UNIT_RATES/old/common/OLDURConstants' );
  var OLDURShoppingScreenView = require( 'UNIT_RATES/old/common/shopping/view/OLDURShoppingScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingLabModel} model
   * @constructor
   */
  function OLDShoppingLabScreenView( model ) {

    OLDURShoppingScreenView.call( this, model, true, this.onNumberLineEraseCallback.bind( this ) );

    var self = this;
    model.itemRateProperty.link( function( itemRate, oldRate ) {
      self.refreshNumberLine();
    } );
  }

  unitRates.register( 'OLDShoppingLabScreenView', OLDShoppingLabScreenView );

  return inherit( OLDURShoppingScreenView, OLDShoppingLabScreenView, {

    /**
     * Called from constructor to give subclass a chance to add UI elements at a specific point in the constructor
     *
     * @protected
     */
    addSubclassScreenNodes: function() {

      this.itemRateNode = new OLDItemRateNode( this.model.itemTypeProperty, this.model.itemRateProperty, {
        left: this.layoutBounds.left + OLDURConstants.PANEL_SPACING,
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
      OLDURShoppingScreenView.prototype.resetAll.call( this );
    }
  } );
} );

