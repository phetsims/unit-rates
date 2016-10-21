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
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var ItemRateNode = require( 'UNIT_RATES/shoppingLab/view/ItemRateNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URShoppingScreenView = require( 'UNIT_RATES/common/shopping/view/URShoppingScreenView' );

  /**
   * @param {ShoppingLabModel} model
   * @constructor
   */
  function ShoppingLabScreenView( model ) {

    var self = this;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.model = model;

    // @private - mapping from scene to item type
    this.sceneItemData = [];
    this.sceneItemData[ 'fruit' ] = ItemData.APPLES;
    this.sceneItemData[ 'produce' ] = ItemData.CARROTS;
    this.sceneItemData[ 'candy' ] = ItemData.PURPLE_CANDY;

    URShoppingScreenView.call( this, model, true, this.onNumberLineEraseCallback.bind( this ) );

    // refresh on item change
    this.model.itemRateProperty.link( function( itemRate, oldRate ) {
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
     * @override @protected
     */
    resetAll: function() {

      this.itemRateNode.reset();

      URShoppingScreenView.prototype.resetAll.call( this );
    },

    /**
     * Called when the user selects a new scene
     *
     * @param {Property.<string>} scene
     * @param {Property.<string>} oldScene
     * @override @protected
     */
    sceneSelectionChanged: function( scene, oldScene ) {

      URShoppingScreenView.prototype.sceneSelectionChanged.call( this, scene, oldScene );

      this.removeAllItems();

      // change the item type
      this.model.itemDataProperty.value = this.sceneItemData[ scene ];
    }

  } ); // inherit

} ); // define

