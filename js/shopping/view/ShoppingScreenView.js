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
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var SceneControlButtons = require( 'UNIT_RATES/shopping/view/SceneControlButtons' );
  var DoubleNumberLineNode = require( 'UNIT_RATES/common/view/DoubleNumberLineNode' );
  var ChallangesNode = require( 'UNIT_RATES/common/view/ChallangesNode' );
  var ItemComboBox = require( 'UNIT_RATES/shopping/view/ItemComboBox' );
  var ItemShelfNode = require( 'UNIT_RATES/shopping/view/ItemShelfNode' );
  var ItemScaleNode = require( 'UNIT_RATES/shopping/view/ItemScaleNode' );
  var Node = require( 'SCENERY/nodes/Node' );
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
    this.fruitItemDataProperty = new Property( ItemData.APPLES );
    this.produceItemDataProperty = new Property( ItemData.CARROTS );
    this.candyItemDataProperty = new Property( ItemData.RED_CANDY );

    // scene buttons
    var sceneControlButtons = new SceneControlButtons( model, this.sceneModeProperty, {
      left:  this.layoutBounds.left + SCREEN_MARGIN,
      top: this.layoutBounds.top + SCREEN_MARGIN
    } );
    this.addChild( sceneControlButtons );

    // item selection - 1 combo boxe for each scene, hidden and shown based on sceneModeProperty
    var itemComboBoxOptions = {
      left:  this.layoutBounds.left + SCREEN_MARGIN,
      bottom: this.layoutBounds.bottom - SCREEN_MARGIN
    };
    this.fruitItemsComboBox = new ItemComboBox( model, SceneMode.FRUIT, this.fruitItemDataProperty,
      this, itemComboBoxOptions);
    this.addChild( this.fruitItemsComboBox );

    this.produceItemsComboBox = new ItemComboBox( model, SceneMode.PRODUCE, this.produceItemDataProperty,
      this, itemComboBoxOptions);
    this.addChild( this.produceItemsComboBox );

    this.candyItemsComboBox = new ItemComboBox( model, SceneMode.CANDY, this.candyItemDataProperty,
      this, itemComboBoxOptions);
    this.addChild( this.candyItemsComboBox );

    // number line
    var doubleNumberLineNode = new DoubleNumberLineNode( model, {
      left:  sceneControlButtons.right + PANEL_HORIZONTAL_SPACING,
      top: this.layoutBounds.top + SCREEN_MARGIN } );
    this.addChild( doubleNumberLineNode );

    this.itemsLayer = new Node();
    this.addChild( this.itemsLayer );

    // scale
    this.itemScaleNode = new ItemScaleNode( model.scale, this.itemsLayer, this.itemMoved.bind( this ) );
    this.itemScaleNode.setCenterBottom( new Vector2( this.layoutBounds.centerX, doubleNumberLineNode.bottom + 200 ) );  // FIXME
    this.addChild( this.itemScaleNode );

    // shelf
    this.itemShelfNode = new ItemShelfNode( model.shelf, this.itemsLayer, this.itemMoved.bind( this ), {
      centerX:  this.layoutBounds.centerX,
      bottom: this.layoutBounds.bottom - SCREEN_MARGIN
    } );
    this.addChild( this.itemShelfNode );

    // challenges
    var challangesNode = new ChallangesNode( model, {
      left:  doubleNumberLineNode.right + PANEL_HORIZONTAL_SPACING,
      top: this.layoutBounds.top + SCREEN_MARGIN } );
    this.addChild( challangesNode );

    // select the scene
    this.sceneModeProperty.link( this.sceneSelectionChanged.bind( this) );

    // select the item based on scene & item selection
    Property.multilink( [ this.sceneModeProperty, this.fruitItemDataProperty, this.produceItemDataProperty,
      this.candyItemDataProperty ], this.itemSelectionChanged.bind( this ) );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();

        self.fruitItemDataProperty.reset();
        self.produceItemDataProperty.reset();
        self.candyItemDataProperty.reset();
        self.sceneModeProperty.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    // move items layer on top of all other nodes
    this.itemsLayer.moveToFront();

    // initialize shelf items
    this.itemShelfNode.populate();
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
    itemSelectionChanged: function( sceneMode, fruitItemData, produceItemData, candyItemData ) {

      // dispose of children before calling removeAllChildren
      this.itemsLayer.getChildren().forEach( function( child ) {
        if ( child.dispose ) {
          child.dispose();
        }
      } );
      this.itemsLayer.removeAllChildren();

      switch( sceneMode ) {
        case SceneMode.FRUIT:
            this.model.itemData = fruitItemData;
          break;
        case SceneMode.PRODUCE:
            this.model.itemData = produceItemData;
          break;
        case SceneMode.CANDY:
            this.model.itemData = candyItemData;
          break;
        default:
      }
    },

    // Called when an item's node is dragged to a new location
    // @private
    itemMoved: function( itemNode ) {

      var nodeCenterBottom = new Vector2( itemNode.item.positionProperty.value.x,
      itemNode.item.positionProperty.value.y + itemNode.height / 2 );

      // Check node position
      if( this.itemScaleNode.pointInDropArea( nodeCenterBottom ) ) {
        console.log('on scale');
        // Remove from shelf & add to scale
        this.model.shelf.removeItem( itemNode.item );
        this.model.scale.addItem( itemNode.item );
      }
      else if( this.itemShelfNode.pointInDropArea( nodeCenterBottom ) ) {
        console.log('on shelf');

        // Remove from scale & add to shelf
        this.model.scale.removeItem( itemNode.item );
        this.model.shelf.addItem( itemNode.item );
      }
      else {
        // Send it back from whence it came
        itemNode.restoreLastPosition();
      }
    }

  } ); // inherit

} ); // define

