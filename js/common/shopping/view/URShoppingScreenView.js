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
  var ShoppingConstants = require( 'UNIT_RATES/common/shopping/ShoppingConstants' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SceneMode = require( 'UNIT_RATES/common/shopping/enum/SceneMode' );
  var SceneButtonGroupNode = require( 'UNIT_RATES/common/shopping/view/SceneButtonGroupNode' );
  var NumberLineNode = require( 'UNIT_RATES/common/shopping/view/NumberLineNode' );
  var KeypadPanelNode = require( 'UNIT_RATES/common/view/KeypadPanelNode' );
  var ShelfNode = require( 'UNIT_RATES/common/shopping/view/ShelfNode' );
  var ScaleNode = require( 'UNIT_RATES/common/shopping/view/ScaleNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Property = require( 'AXON/Property' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // images
  var removeButtonImage = require( 'image!UNIT_RATES/remove-button.png' );

  /**
   * @param {ShoppingModel} model
   * @param {boolean} labFlag
   * @constructor
   */
  function URShoppingScreenView( model, labFlag ) {

    ScreenView.call( this );

    var self = this;

    this.model = model;

    // properties
    // FIXME: scene & item randomly choosen @ startup (TBD as per current design document)
    this.sceneModeProperty       = new Property( SceneMode.FRUIT );

    // shared keypad which becomes visible when an edit number display button is selected.
    this.keypad = new KeypadPanelNode( {
      maxDigits: 4,
      visible: false
    } );
    this.addChild( this.keypad );

    // number line
    this.numberLineNode = new NumberLineNode( model.numberLine, this.keypad, {
      left: this.layoutBounds.left + ShoppingConstants.SCREEN_PANEL_SPACING,
      top:  this.layoutBounds.top  + ShoppingConstants.SCREEN_VERTICAL_MARGIN } );
    this.addChild( this.numberLineNode );

    // keypad layout
    this.keypad.right = this.numberLineNode.right - 30;
    this.keypad.top   = this.numberLineNode.bottom + 2 * ShoppingConstants.SCREEN_PANEL_SPACING;

    // transparent layer holding draggable shelf & scale item nodes
    this.itemsLayer = new Rectangle( 0, 0, this.width, this.height );
    this.addChild( this.itemsLayer );

    // shelf
    this.shelfNode = new ShelfNode( model.shelf, this.itemsLayer,
                                    this.startUpdateItem.bind( this ), this.endUpdateItem.bind( this ), {
      centerX: this.numberLineNode.centerX + 15,
      bottom:  this.layoutBounds.bottom - ShoppingConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( this.shelfNode );

    // scale
    this.scaleNode = new ScaleNode( model.scale, this.itemsLayer,
                                    this.startUpdateItem.bind( this ), this.endUpdateItem.bind( this ) , {
      centerX: this.shelfNode.centerX,
      bottom:  this.shelfNode.top - 75
    } );
    this.addChild( this.scaleNode );

    // remove button
    var scaleRemoveButtonNode = new RectangularPushButton( {
      right:  this.scaleNode.left - ShoppingConstants.SCREEN_PANEL_SPACING,
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
        self.resetAll();
      },
      right:  this.layoutBounds.maxX - ShoppingConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: this.layoutBounds.maxY - ShoppingConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( resetAllButton );

    this.addSubclassScreenNodes();

    // scene buttons
    var sceneControlButtons = new SceneButtonGroupNode( this.sceneModeProperty, {
      right:  this.layoutBounds.right - ShoppingConstants.SCREEN_HORIZONTAL_MARGIN,
      //centerX:  this.challengesNode.centerX,
      bottom: resetAllButton.top - ShoppingConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( sceneControlButtons );

    // select the scene
    this.sceneModeProperty.link( this.sceneSelectionChanged.bind( this) );

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

  unitRates.register( 'URShoppingScreenView', URShoppingScreenView );

  return inherit( ScreenView, URShoppingScreenView, {

    /**
     * Called from the constructor to allow for subclassed to add additional nodes/properties to the screen
     * @protected
     */
    constructScreenNodes: function() {
      // no implementation in base screen class
    },

    /**
     * Called when the user selects the sim reset button
     * @private
     */
    resetAll: function() {
        this.model.reset();

        this.sceneModeProperty.reset();
        this.hideKeypad();

        this.removeAllItems();

        this.numberLineNode.reset();
        this.scaleNode.reset();
        this.shelfNode.reset();
    },

    /**
     * Call when the user selected a new scene
     * @param {Property}.<SceneMode> sceneMode - indicates the new scene type
     * @param {Property}.<SceneMode> oldSceneMode - indicates the previous scene type
     * @private
     */
    sceneSelectionChanged: function( sceneMode, oldSceneMode ) {

      this.hideKeypad();

      // This fixes an issue with items hanging in space when the item type selection changes. (see. issue #21, #18)
      this.itemsLayer.getChildren().forEach( function( child ) {
        self.endUpdateItem( child );
      } );
    },

    /*
     * Updates the model based on where the item is on on the screen - i.e. on the scale or shelf or in no-man's land.
     * Called on scene changes or when an item's node (i.e. individual items or bags) is moved to a new location
     * @param {Node} itemNode - the item being moved.
     * @private
     */
    startUpdateItem: function( itemNode ) {
      // Move item back to the shelf
      this.model.addScaleItemToShelf( itemNode.item );
      this.scaleNode.adjustItemPositions( true );
    },

    /*
     * Updates the model based on where the item is on on the screen - i.e. on the scale or shelf or in no-man's land.
     * Called on scene changes or when an item's node (i.e. individual items or bags) is moved to a new location
     * @param {Node} itemNode - the item being moved.
     * @private
     */
    endUpdateItem: function( itemNode ) {

      var animate = true;

      // Check node position - on scale, shelf or in no-man's land
      if ( this.scaleNode.intersectsDropArea( itemNode.bounds ) ) {

        // Dropped on the scale
        this.model.addShelfItemToScale( itemNode.item );
        this.model.addScaleItemsToNumberline();

        // Fruit bags should be expanded
        if ( this.sceneModeProperty.value === SceneMode.FRUIT && itemNode.item.count > 1 ) {

          // remove the bag node & children nodes
          this.itemsLayer.removeChild( itemNode );
          itemNode.dispose();

          // populate new scale items
          this.scaleNode.populate();

          animate = false;
        }

        // make sure items are stacked on the scale
        this.scaleNode.adjustItemPositions( animate );

        // populate number line
        this.numberLineNode.populate();
      }
      else {

        // Move item back to the shelf
        this.model.addScaleItemToShelf( itemNode.item );

        // Update the number line
        this.model.addScaleItemsToNumberline();

        // make sure items are stacked on the scale
        this.scaleNode.adjustItemPositions( animate );

        // make sure items are stacked on the scale
        this.shelfNode.adjustItemPositions( animate );
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

