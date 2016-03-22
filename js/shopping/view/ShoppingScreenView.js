// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
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
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var SCREEN_MARGIN = 30;
  var PANEL_HORIZONTAL_SPACING = 30; // space between scene buttons/numberline/challenges

  /**
   * @param {ShoppingModel} model
   * @constructor
   */
  function ShoppingScreenView( model ) {

    ScreenView.call( this );

    var self = this;

    this.model = model;

    // properties
    // FIXME: scene & item randomly choosen @ startup
    this.sceneModeProperty = new Property( SceneMode.FRUIT );
    this.fruitItemTypeProperty = new Property( ItemType.APPLES );
    this.produceItemTypeProperty = new Property( ItemType.CARROTS );
    this.candyItemTypeProperty = new Property( ItemType.RED_CANDY );

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

    // item selection - 1 combo boxe for each scene, hidden and shown based on sceneModeProperty
    var itemComboBoxOptions = {
      left:  this.layoutBounds.left + SCREEN_MARGIN,
      bottom: this.layoutBounds.bottom - SCREEN_MARGIN
    };
    this.fruitItemsComboBox = new ItemComboBox( model, SceneMode.FRUIT, this.fruitItemTypeProperty,
      this, itemComboBoxOptions);
    this.addChild( this.fruitItemsComboBox );

    this.produceItemsComboBox = new ItemComboBox( model, SceneMode.PRODUCE, this.produceItemTypeProperty,
      this, itemComboBoxOptions);
    this.addChild( this.produceItemsComboBox );

    this.candyItemsComboBox = new ItemComboBox( model, SceneMode.CANDY, this.candyItemTypeProperty,
      this, itemComboBoxOptions);
    this.addChild( this.candyItemsComboBox );

    // scale
    var itemScaleNode = new ItemScaleNode( model.scale );
    itemScaleNode.setCenterBottom( new Vector2( this.layoutBounds.centerX, doubleNumberLineNode.bottom + 200 ) );
    this.addChild( itemScaleNode );

    // shelf
    this.itemShelfNode = new ItemShelfNode( model.shelf, this.itemMoved.bind (this ), {
      centerX:  this.layoutBounds.centerX,
      bottom: this.layoutBounds.bottom - SCREEN_MARGIN
    } );
    this.addChild( this.itemShelfNode );

    // select the scene
    this.sceneModeProperty.link( this.sceneSelectionChanged.bind( this) );

    // select the item based on scene & item selection
    Property.multilink( [ this.sceneModeProperty, this.fruitItemTypeProperty, this.produceItemTypeProperty,
      this.candyItemTypeProperty ], this.itemSelectionChanged.bind( this ) );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();

        self.fruitItemTypeProperty.reset();
        self.produceItemTypeProperty.reset();
        self.candyItemTypeProperty.reset();
        self.sceneModeProperty.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

  }

  unitRates.register( 'ShoppingScreenView', ShoppingScreenView );

  return inherit( ScreenView, ShoppingScreenView, {

    // @private
    sceneSelectionChanged: function( sceneMode, oldSceneMode ) {

      // hide/show different combo boxes based on scene selection
      switch( sceneMode ) {
        case SceneMode.FRUIT:
          this.fruitItemsComboBox.visible   = true;
          this.produceItemsComboBox.visible = false;
          this.candyItemsComboBox.visible   = false;
          break;
        case SceneMode.PRODUCE:
          this.fruitItemsComboBox.visible   = false;
          this.produceItemsComboBox.visible = true;
          this.candyItemsComboBox.visible   = false;
          break;
        case SceneMode.CANDY:
          this.fruitItemsComboBox.visible   = false;
          this.produceItemsComboBox.visible = false;
          this.candyItemsComboBox.visible   = true;
          break;
        default:
      }
    },

    // @private
    itemSelectionChanged: function( sceneMode, fruitItemType, produceItemType, candyItemType ) {
      switch( sceneMode ) {
        case SceneMode.FRUIT:
            this.model.itemType = fruitItemType;
          break;
        case SceneMode.PRODUCE:
            this.model.itemType = produceItemType;
          break;
        case SceneMode.CANDY:
            this.model.itemType = candyItemType;
          break;
        default:
      }
    },

    // @private
    itemMoved: function( item ) {

      // Remove from shelf
      //this.model.shelf.removeItem( item );

      // Add to scale

      // Snap back to shelf
      item.reset();
      this.itemShelfNode.refresh();

    }

  } ); // inherit

} ); // define

