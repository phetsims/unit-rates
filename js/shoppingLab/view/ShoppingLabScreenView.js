// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var SceneMode = require( 'UNIT_RATES/common/shopping/enum/SceneMode' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var SceneButtonGroupNode = require( 'UNIT_RATES/common/shopping/view/SceneButtonGroupNode' );
  var Property = require( 'AXON/Property' );

  // constants
  var SCREEN_HORIZONTAL_MARGIN  = 15; // screen top/bottom margin for panels (i.e numberline/challenges/shelf)
  var SCREEN_VERTICAL_MARGIN    = 20; // screen left/right panel margin
  var PANEL_SPACING             = 12; // space between major panels (i.e. numberline/challenges/keypad)

  /**
   * @param {ShoppingLabModel} model
   * @constructor
   */
  function ShoppingLabScreenView( model ) {

    ScreenView.call( this );

    var self = this;

    this.model = model;

    this.sceneModeProperty = new Property( SceneMode.FRUIT );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    // scene buttons
    var sceneControlButtons = new SceneButtonGroupNode( this.sceneModeProperty, {
      right:  this.layoutBounds.right - SCREEN_HORIZONTAL_MARGIN,
      //centerX:  this.challengesNode.centerX,
      bottom: resetAllButton.top - SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( sceneControlButtons );

    // select the scene
    this.sceneModeProperty.link( this.sceneSelectionChanged.bind( this) );

  }

  unitRates.register( 'ShoppingLabScreenView', ShoppingLabScreenView );

  return inherit( ScreenView, ShoppingLabScreenView, {


     /**
     * Called when the user selected a new item type (i.e. "apples", "carrots", "red candy")
     * @param {Property}.<SceneMode> sceneMode - indicates the scene type
     * @private
     */
    sceneSelectionChanged: function( sceneMode ) {

      //this.hideKeypad();

      //this.removeAllItems();

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
      //var self = this;
      //this.itemsLayer.getChildren().forEach( function( child ) {
      //  self.endUpdateItem( child );
      //} );
    },

  } ); // inherit

} ); // define
