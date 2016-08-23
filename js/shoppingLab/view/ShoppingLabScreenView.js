// Copyright 2002-2016, University of Colorado Boulder

/**
 * The main shopping screen layout and top level behaviors
 * (i.e. scene selection, moving items between shelf/scale, reset, etc.)
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URShoppingScreenView = require( 'UNIT_RATES/common/shopping/view/URShoppingScreenView' );
  var ShoppingConstants = require( 'UNIT_RATES/common/shopping/ShoppingConstants' );
  var SceneMode = require( 'UNIT_RATES/common/shopping/enum/SceneMode' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var RateAdjustNode = require( 'UNIT_RATES/shoppingLab/view/RateAdjustNode' );
  //var Property = require( 'AXON/Property' );

  /**
   * @param {ShoppingLabModel} model
   * @param {boolean} labFlag
   * @constructor
   */
  function ShoppingLabScreenView( model ) {

    this.sceneItemData = [];
    this.sceneItemData[ SceneMode.FRUIT ]   = ItemData.APPLES;
    this.sceneItemData[ SceneMode.PRODUCE ] = ItemData.CARROTS;
    this.sceneItemData[ SceneMode.CANDY ]   = ItemData.PURPLE_CANDY;

    URShoppingScreenView.call( this, model );
  }

  unitRates.register( 'ShoppingLabScreenView', ShoppingLabScreenView );

  return inherit( URShoppingScreenView, ShoppingLabScreenView, {

    /**
     * Called from constructor to give subclass a chance to add UI elements at a specific point in the constructor
     * @protected
     */
    addSubclassScreenNodes: function() {

      this.adjustRateNode = new RateAdjustNode( this.model.itemDataProperty, {
        left: this.layoutBounds.left + ShoppingConstants.SCREEN_PANEL_SPACING,
        top:  this.numberLineNode.bottom + 2 * ShoppingConstants.SCREEN_PANEL_SPACING
      } );
      this.addChild( this.adjustRateNode );
    },

    /**
     * Called when the user selects the sim reset button
     * @overrride @protected
     */
    resetAll: function() {

      this.adjustRateNode.reset();

      URShoppingScreenView.prototype.resetAll.call( this );
    },

    /**
     * Called when the user selects a new scene
     * @param {Property}.<SceneMode> sceneMode - indicates the new scene type
     * @param {Property}.<SceneMode> oldSceneMode - indicates the previous scene type
     * @override @protected
     */
    sceneSelectionChanged: function( sceneMode, oldSceneMode ) {
      var self = this;

      this.hideKeypad();

      this.removeAllItems();

      assert && assert( ( sceneMode !== SceneMode.FRUIT || sceneMode !== SceneMode.PRODUCE || sceneMode !== SceneMode.CANDY),
        'Unrecognized scene' );

      // change the item type
      this.model.itemDataProperty.value= this.sceneItemData[ sceneMode ];

      // This fixes an issue with items hanging in space when the item type selection changes. (see. issue #21, #18)
      this.itemsLayer.getChildren().forEach( function( child ) {
        self.endUpdateItem( child );
      } );
    }

  } ); // inherit

} ); // define

