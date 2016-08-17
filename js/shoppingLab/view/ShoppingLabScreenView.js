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
  //var ShoppingConstants = require( 'UNIT_RATES/common/shopping/ShoppingConstants' );
  var SceneMode = require( 'UNIT_RATES/common/shopping/enum/SceneMode' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  //var RateAdjustNode = require( 'UNIT_RATES/shoppingLab/view/RateAdjustNode' );
  //var Property = require( 'AXON/Property' );

  /**
   * @param {ShoppingModel} model
   * @param {boolean} labFlag
   * @constructor
   */
  function ShoppingLabScreenView( model ) {

    URShoppingScreenView.call( this, model );
  }

  unitRates.register( 'ShoppingLabScreenView', ShoppingLabScreenView );

  return inherit( URShoppingScreenView, ShoppingLabScreenView, {

    /**
     * Called from constructor to give subclass a chance to add UI elements at a specific point in the constructor
     * @protected
     */
    addSubclassScreenNodes: function() {
    },

    /**
     * Called when the user selects the sim reset button
     * @overrride @protected
     */
    resetAll: function() {

      URShoppingScreenView.prototype.resetAll.call( this );
    },

    /**
     * Call when the user selected a new scene
     * @param {Property}.<SceneMode> sceneMode - indicates the new scene type
     * @param {Property}.<SceneMode> oldSceneMode - indicates the previous scene type
     * @override @protected
     */
    sceneSelectionChanged: function( sceneMode, oldSceneMode ) {
      var self = this;

      this.hideKeypad();

      this.removeAllItems();

      switch( sceneMode ) {
        case SceneMode.FRUIT:
            this.model.itemData = ItemData.APPLES;
          break;
        case SceneMode.PRODUCE:
            this.model.itemData = ItemData.CARROTS;
          break;
        case SceneMode.CANDY:
            this.model.itemData = ItemData.PURPLE_CANDY;
          break;
        default:
          assert && assert( false, 'Unrecognized scene' );
      }

      // This fixes an issue with items hanging in space when the item type selection changes. (see. issue #21, #18)
      this.itemsLayer.getChildren().forEach( function( child ) {
        self.endUpdateItem( child );
      } );
    }

  } ); // inherit

} ); // define

