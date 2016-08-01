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
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SceneMode = require( 'UNIT_RATES/shopping/enum/SceneMode' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var SceneButtonGroupNode = require( 'UNIT_RATES/shopping/view/SceneButtonGroupNode' );
  var NumberLineNode = require( 'UNIT_RATES/shopping/view/NumberLineNode' );
  var KeypadPanelNode = require( 'UNIT_RATES/common/view/KeypadPanelNode' );
  var ChallengesNode = require( 'UNIT_RATES/shopping/view/ChallengesNode' );
  var ItemComboBox = require( 'UNIT_RATES/shopping/view/ItemComboBox' );
  var ShelfNode = require( 'UNIT_RATES/shopping/view/ShelfNode' );
  var ScaleNode = require( 'UNIT_RATES/shopping/view/ScaleNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Property = require( 'AXON/Property' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // constants
  var SCREEN_HORIZONTAL_MARGIN  = 15; // screen top/bottom margin for panels (i.e numberline/challenges/shelf)
  var SCREEN_VERTICAL_MARGIN    = 20; // screen left/right panel margin
  var PANEL_SPACING             = 12; // space between major panels (i.e. numberline/challenges/keypad)

  // images
  var removeButtonImage = require( 'image!UNIT_RATES/remove-button.png' );

  /**
   * @param {ShoppingModel} model
   * @constructor
   */
  function ShoppingScreenView( model ) {

    ScreenView.call( this );

    var self = this;

    this.model = model;

    // properties
    // FIXME: scene & item randomly choosen @ startup (TBD as per current design document)
    this.sceneModeProperty       = new Property( SceneMode.FRUIT );
    this.fruitItemDataProperty   = new Property( ItemData.APPLES );
    this.produceItemDataProperty = new Property( ItemData.CARROTS );
    this.candyItemDataProperty   = new Property( ItemData.RED_CANDY );

    // shared keypad which becomes visible when an edit number display button is selected.
    this.keypad = new KeypadPanelNode( {
      maxDigits: 4,
      visible: false
    } );
    this.addChild( this.keypad );

    // number line
    this.numberLineNode = new NumberLineNode( model.numberLine, this.keypad, {
      left: this.layoutBounds.left + PANEL_SPACING,
      top:  this.layoutBounds.top  + SCREEN_VERTICAL_MARGIN } );
    this.addChild( this.numberLineNode );

    // challenges
    var onChallengePopulate = function() {
      self.model.removeChallengeItemsFromNumberline();  // remove old
      self.model.addChallengeItemsToNumberline();       // add new (i.e. unit rate)
      self.numberLineNode.populate();
    };
    var challengeWidth = this.layoutBounds.maxX - ( this.numberLineNode.right + PANEL_SPACING + SCREEN_HORIZONTAL_MARGIN );
    this.challengesNode = new ChallengesNode( model.challenges, this.keypad, challengeWidth, onChallengePopulate, {
      left: this.numberLineNode.right + PANEL_SPACING,
      top:  this.layoutBounds.top + SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( this.challengesNode );

    // keypad layout
    this.keypad.right = this.numberLineNode.right - 30;
    this.keypad.top   = this.numberLineNode.bottom + 2 * PANEL_SPACING;

    // transparent layer holding draggable shelf & scale item nodes
    this.itemsLayer = new Rectangle( 0, 0, this.width, this.height );
    this.addChild( this.itemsLayer );

    // shelf
    this.shelfNode = new ShelfNode( model.shelf, this.itemsLayer, this.updateItem.bind( this ), {
      centerX: this.numberLineNode.centerX + 15,
      bottom:  this.layoutBounds.bottom - SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( this.shelfNode );

    // scale
    this.scaleNode = new ScaleNode( model.scale, this.itemsLayer, this.updateItem.bind( this ) , {
      centerX: this.shelfNode.centerX,
      bottom:  this.shelfNode.top - 75
    } );
    this.addChild( this.scaleNode );

    // remove button
    var scaleRemoveButtonNode = new RectangularPushButton( {
      right:  this.scaleNode.left - PANEL_SPACING,
      bottom: this.scaleNode.bottom,
      baseColor: URConstants.DEFAULT_BUTTON_COLOR,
      content: new Image( removeButtonImage, { scale: 0.25 } ),
      listener: function() {

        // reset the current item type - remove scale items & re-populates shelf items
        self.removeAllItems();
        self.scaleNode.resetCurrentItem();
        self.shelfNode.resetCurrentItem();
      }
    } );
    this.addChild( scaleRemoveButtonNode );

    // Reset All button - resets the sim to it's initial state
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();

        self.fruitItemDataProperty.reset();
        self.produceItemDataProperty.reset();
        self.candyItemDataProperty.reset();
        self.sceneModeProperty.reset();
        self.hideKeypad();

        self.removeAllItems();

        self.numberLineNode.reset();
        self.scaleNode.reset();
        self.shelfNode.reset();
        self.challengesNode.reset();
      },
      right:  this.layoutBounds.maxX - SCREEN_HORIZONTAL_MARGIN,
      bottom: this.layoutBounds.maxY - SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( resetAllButton );

    // item selection - 1 combo box for each scene, hidden and shown based on sceneModeProperty
    var itemComboBoxOptions = {
      left:   this.layoutBounds.left   + SCREEN_HORIZONTAL_MARGIN,
      bottom: this.layoutBounds.bottom - SCREEN_VERTICAL_MARGIN
    };
    this.fruitItemsComboBox = new ItemComboBox( SceneMode.FRUIT, this.fruitItemDataProperty,
      this, itemComboBoxOptions);
    this.addChild( this.fruitItemsComboBox );

    this.produceItemsComboBox = new ItemComboBox( SceneMode.PRODUCE, this.produceItemDataProperty,
      this, itemComboBoxOptions);
    this.addChild( this.produceItemsComboBox );

    this.candyItemsComboBox = new ItemComboBox( SceneMode.CANDY, this.candyItemDataProperty,
      this, itemComboBoxOptions);
    this.addChild( this.candyItemsComboBox );

    // scene buttons
    var sceneControlButtons = new SceneButtonGroupNode( this.sceneModeProperty, {
      right:  this.layoutBounds.right - SCREEN_HORIZONTAL_MARGIN,
      //centerX:  this.challengesNode.centerX,
      bottom: resetAllButton.top - SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( sceneControlButtons );

    // select the scene
    this.sceneModeProperty.link( this.sceneSelectionChanged.bind( this) );

    // select the item based on scene & item selection - no dispose as this never goes away
    Property.multilink( [ this.sceneModeProperty, this.fruitItemDataProperty, this.produceItemDataProperty,
      this.candyItemDataProperty ], this.itemSelectionChanged.bind( this ) );

    // Layer the draggable/clickable nodes for proper rendering/interaction
    this.itemsLayer.moveToBack();
    this.scaleNode.moveToBack();
    this.shelfNode.moveToBack();

    // Click on screen to close keypad
    this.itemsLayer.addInputListener( {
      down: function( event ) {
        self.hideKeypad();
      }
    } );

    // resize the items layer on a browser size change
    this.onResize();
    this.addEventListener( 'bounds', this.onResize.bind( this ) );

    // initialize shelf items
    this.shelfNode.populate();
  }

  unitRates.register( 'ShoppingScreenView', ShoppingScreenView );

  return inherit( ScreenView, ShoppingScreenView, {

    /**
     * Call when the user selected a new scene (i.e. "1", "2", "3")
     * @param {Property}.<SceneMode> sceneMode - indicates the new scene type
     * @param {Property}.<SceneMode> oldSceneMode - indicates the previous scene type
     * @private
     */
    sceneSelectionChanged: function( sceneMode, oldSceneMode ) {

      this.hideKeypad();

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
          assert && assert( true, 'Unrecognized scene' );
      }
    },

    /**
     * Called when the user selected a new item type (i.e. "apples", "carrots", "red candy")
     * @param {Property}.<SceneMode> sceneMode - indicates the scene type
     * @param {Property}.<ItemData> fruitItemData - the item data for the selected fruit item
     * @param {Property}.<ItemData> produceItemData - the item data for the selected produce item
     * @param {Property}.<ItemData> candyItemData - the item data for the selected candy item
     * @private
     */
    itemSelectionChanged: function( sceneMode, fruitItemData, produceItemData, candyItemData ) {

      this.hideKeypad();

      this.removeAllItems();

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
          assert && assert( true, 'Unrecognized scene' );
      }

      this.model.addChallengeItemsToNumberline();

      // This fixes an issue with items hanging in space when the item type selection changes. (see. issue #21, #18)
      var self = this;
      this.itemsLayer.getChildren().forEach( function( child ) {
        self.updateItem( child );
      } );
    },

    /*
     * Updates the model based on where the item is on on the screen - i.e. on the scale or shelf or in no-man's land.
     * Called on scene changes or when an item's node (i.e. individual items or bags) is moved to a new location
     * @param {Node} itemNode - the item being moved.
     * @private
     */
    updateItem: function( itemNode ) {

      // Check node position - on scale, shelf or in no-man's land
      if( this.scaleNode.intersectsDropArea( itemNode.bounds ) ) {

        // Dropped on the scale
        this.model.addShelfItemToScale( itemNode.item );
        this.model.addScaleItemsToNumberline();

        // Fruit bags should be expanded
        if( this.sceneModeProperty.value === SceneMode.FRUIT && itemNode.item.count > 1 ) {

          // remove the bag node
          this.itemsLayer.removeChild( itemNode );
          itemNode.dispose();

          // populate new scale items
          this.scaleNode.populate();
        }

        // make sure bottom of items are actually on the scale
        this.scaleNode.adjustItemPositions();

        // populate number line
        this.numberLineNode.populate();
      }
      else { //if ( !this.shelfNode.intersectsDropArea( itemNode.bounds ) ) {

        // Item has not been moved to the scale, place it back on the shelf.
        var point = this.shelfNode.getClosePoint( itemNode.item.position );
        itemNode.item.setPosition( point.x, point.y, true );

        // Move back to the shelf
        this.model.addScaleItemToShelf( itemNode.item );
        this.model.addScaleItemsToNumberline();
      }
    },

    /**
     * @private
     */
    hideKeypad: function() {
      this.keypad.visible = false;
      this.keypad.clear();
      this.keypad.clearListeners();
    },

    /**
     * @private
     */
    removeAllItems: function() {
      // dispose of children before calling removeAllChildren
      this.itemsLayer.getChildren().forEach( function( child ) {
        if ( child.dispose ) {
          child.dispose();
        }
      } );
      this.itemsLayer.removeAllChildren();
    },

    /**
     * @private
     */
    onResize: function() {
      // resize the items layer to match the screen
      this.itemsLayer.setRectBounds( new Bounds2( 0, 0,  window.innerWidth, window.innerHeight ) );
    }

  } ); // inherit

} ); // define

