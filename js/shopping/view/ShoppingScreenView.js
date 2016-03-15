// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SceneMode = require( 'UNIT_RATES/shopping/enum/SceneMode' );
  var ItemType = require( 'UNIT_RATES/shopping/enum/ItemType' );
  var SceneControlButtons = require( 'UNIT_RATES/shopping/view/SceneControlButtons' );
  var DoubleNumberLineNode = require( 'UNIT_RATES/common/view/DoubleNumberLineNode' );
  var ChallangesNode = require( 'UNIT_RATES/common/view/ChallangesNode' );
  var ItemComboBox = require( 'UNIT_RATES/shopping/view/ItemComboBox' );
  var ItemShelfNode = require( 'UNIT_RATES/shopping/view/ItemShelfNode' );
  var ItemScaleNode = require( 'UNIT_RATES/shopping/view/ItemScaleNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Property = require( 'AXON/Property' );


  // constants
  var SCREEN_MARGIN = 30;
  var PANEL_HORIZONTAL_SPACING = 30;

  /**
   * @param {ShoppingModel} model
   * @constructor
   */
  function ShoppingScreenView( model ) {

    ScreenView.call( this );

    // properties
    this.sceneModeProperty = new Property( SceneMode.FRUIT );
    this.itemTypeProperty = new Property( ItemType.APPLES );

    // scene buttons
    var sceneControlButtons = new SceneControlButtons( model, this.sceneModeProperty, {
      left:  this.layoutBounds.left + SCREEN_MARGIN,
      top: this.layoutBounds.top + SCREEN_MARGIN
    } );
    this.addChild( sceneControlButtons );

    // number line
    var doubleNumberLineNode = new DoubleNumberLineNode( model, {
      left:  sceneControlButtons.right + PANEL_HORIZONTAL_SPACING,
      top: this.layoutBounds.top + SCREEN_MARGIN } );
    this.addChild( doubleNumberLineNode );

    // challenges
    var challangesNode = new ChallangesNode( model, {
      left:  doubleNumberLineNode.right + PANEL_HORIZONTAL_SPACING,
      top: this.layoutBounds.top + SCREEN_MARGIN } );
    this.addChild( challangesNode );

    // item selection
    var itemsComboBox = new ItemComboBox( model, this.itemTypeProperty, this, {
      left:  this.layoutBounds.left + SCREEN_MARGIN,
      bottom: this.layoutBounds.bottom - SCREEN_MARGIN
    } );
    this.addChild( itemsComboBox );

    // shelf
    var itemShelfNode = new ItemShelfNode( model, {
      centerX:  this.layoutBounds.centerX,
      bottom: this.layoutBounds.bottom - SCREEN_MARGIN
    } );
    this.addChild( itemShelfNode );

    // scale
    var itemScaleNode = new ItemScaleNode( model, {
      centerX:  this.layoutBounds.centerX,
      bottom: itemShelfNode.top - 90
    } );
    this.addChild( itemScaleNode );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    // select the scene
    this.sceneModeProperty.link( function( mode, oldMode ) {
      itemsComboBox.setSceneMode( mode );
    } );

    // select the item
    this.itemTypeProperty.link( function( type, oldType ) {
      console.log( 'Item '  + type );
    } );

  }

  unitRates.register( 'ShoppingScreenView', ShoppingScreenView );

  return inherit( ScreenView, ShoppingScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    }

  } ); // inherit

} ); // define

