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
  var SceneMode = require( 'UNIT_RATES/common/shopping/enum/SceneMode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URShoppingScreenView = require( 'UNIT_RATES/common/shopping/view/URShoppingScreenView' );

  /**
   * @param {ShoppingLabModel} model
   * @constructor
   */
  function ShoppingLabScreenView( model ) {

    var self = this;

    this.model = model;

    // @private - mapping from scene to item type
    this.sceneItemData = [];
    this.sceneItemData[ SceneMode.FRUIT ] = ItemData.APPLES;
    this.sceneItemData[ SceneMode.PRODUCE ] = ItemData.CARROTS;
    this.sceneItemData[ SceneMode.CANDY ] = ItemData.PURPLE_CANDY;

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
     * @protected
     */
    addSubclassScreenNodes: function() {

      this.itemRateNode = new ItemRateNode( this.model.itemTypeProperty, this.model.itemRateProperty, {
        left: this.layoutBounds.left + URConstants.SCREEN_PANEL_SPACING,
        bottom: this.scaleNode.bottom
      } );
      this.addChild( this.itemRateNode );
    },

    /**
     * Called from constructor to give subclass a chance to add UI elements at a specific point in the constructor
     * @protected
     */
    onNumberLineEraseCallback: function() {
      this.model.addScaleItemsToNumberLine();
      this.numberLineNode.populate();
    },

    /**
     *
     * @protected
     */
    refreshNumberLine: function() {
      this.numberLineNode.removeAllMarkerNodes();
      this.numberLineNode.populate();
    },

    /**
     * Called when the user selects the sim reset button
     * @override @protected
     */
    resetAll: function() {

      this.itemRateNode.reset();

      URShoppingScreenView.prototype.resetAll.call( this );
    },

    /**
     * Called when the user selects a new scene
     * @param {Property.<SceneMode>} sceneMode - indicates the new scene type
     * @param {Property.<SceneMode>} oldSceneMode - indicates the previous scene type
     * @override @protected
     */
    sceneSelectionChanged: function( sceneMode, oldSceneMode ) {

      this.hideKeypad();

      this.removeAllItems();

      assert && assert( ( sceneMode !== SceneMode.FRUIT || sceneMode !== SceneMode.PRODUCE || sceneMode !== SceneMode.CANDY),
        'Unrecognized scene' );

      // change the item type
      this.model.itemDataProperty.value = this.sceneItemData[ sceneMode ];
    }

  } ); // inherit

} ); // define

