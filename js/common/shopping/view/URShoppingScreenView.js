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
  var SceneMode = require( 'UNIT_RATES/common/shopping/enum/SceneMode' );
  var SceneButtonGroupNode = require( 'UNIT_RATES/common/shopping/view/SceneButtonGroupNode' );
  var NumberLineNode = require( 'UNIT_RATES/common/shopping/view/NumberLineNode' );
  var KeypadPanelNode = require( 'UNIT_RATES/common/view/KeypadPanelNode' );
  var ShelfNode = require( 'UNIT_RATES/common/shopping/view/ShelfNode' );
  var ScaleNode = require( 'UNIT_RATES/common/shopping/view/ScaleNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Property = require( 'AXON/Property' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // images
  var removeButtonImage = require( 'image!UNIT_RATES/remove-button.png' );

  // strings
  var doubleNumberLineString = require( 'string!UNIT_RATES/doubleNumberLine' );

  /**
   * @param {ShoppingModel} model
   * @param {boolean} enableHideScaleCost
   * @constructor
   */
  function URShoppingScreenView( model, enableHideScaleCost ) {

    ScreenView.call( this );

    var self = this;

    this.model = model;

    // properties
    // FIXME: scene & item randomly choosen @ startup (TBD as per current design document)
    this.sceneModeProperty = new Property( SceneMode.FRUIT );

    // shared keypad which becomes visible when an edit number display button is selected.
    this.keypad = new KeypadPanelNode( {
      maxDigits: 4,
      visible: false
    } );
    this.addChild( this.keypad );

    // number line
    this.numberLineNode = new NumberLineNode( model.numberLine, this.keypad, {
      left: this.layoutBounds.left + URConstants.SCREEN_PANEL_SPACING,
      top:  this.layoutBounds.top  + URConstants.SCREEN_VERTICAL_MARGIN,
      numberLineTitle: doubleNumberLineString
    } );
    this.addChild( this.numberLineNode );

    // keypad layout
    this.keypad.right = this.numberLineNode.right - 30;
    this.keypad.top   = this.numberLineNode.bottom + 2 * URConstants.SCREEN_PANEL_SPACING;

    // @protected - covers entire screen, uses pick to close keypad
    this.keypadCloseArea = new Rectangle( 0, 0, window.innerWidth, window.innerHeight, { visible: false } );
    this.addChild( this.keypadCloseArea );

    this.keypad.visibleProperty.link( function( value, oldValue ) {
      self.keypadCloseArea.visible = value;
    } );

    // Click on pickCloseArea to close keypad
    this.keypadCloseArea.addInputListener( {
      down: function( event ) {
        self.keypad.hide();
        self.keypad.clear();
        self.keypad.clearListeners();
      }
    } );

    // transparent layer holding draggable shelf & scale item nodes
    this.itemsLayer = new Node();
    this.addChild( this.itemsLayer );

    // shelf
    this.shelfNode = new ShelfNode( model.shelf, this.itemsLayer,
                                    this.startUpdateItem.bind( this ), this.endUpdateItem.bind( this ), {
      centerX: this.numberLineNode.centerX + 15,
      bottom:  this.layoutBounds.bottom - URConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( this.shelfNode );

    // scale
    this.scaleNode = new ScaleNode( model.scale, this.itemsLayer,
                                    this.startUpdateItem.bind( this ), this.endUpdateItem.bind( this ) , {
      centerX: this.shelfNode.centerX,
      bottom:  this.shelfNode.top - 75,
      enableHideCost: enableHideScaleCost
    } );
    this.addChild( this.scaleNode );

    // remove button
    var scaleRemoveButtonNode = new RectangularPushButton( {
      right:  this.scaleNode.left - URConstants.SCREEN_PANEL_SPACING,
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
      right:  this.layoutBounds.maxX - URConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: this.layoutBounds.maxY - URConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( resetAllButton );

    this.addSubclassScreenNodes();

    // scene buttons
    var sceneControlButtons = new SceneButtonGroupNode( this.sceneModeProperty, {
      right:  this.layoutBounds.right - URConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: resetAllButton.top - URConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( sceneControlButtons );

    // select the scene
    this.sceneModeProperty.link( this.sceneSelectionChanged.bind( this) );

    // Layer the keypad & draggable nodes for proper rendering/interaction
    this.keypadCloseArea.moveToFront();
    this.keypad.moveToFront();
    this.itemsLayer.moveToFront();

    // resize the keypad pick layer on a browser size change
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
     * @protected
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
     * @param {Property.<SceneMode>} sceneMode - indicates the new scene type
     * @param {Property.<SceneMode>} oldSceneMode - indicates the previous scene type
     * @protected
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
     * @protected
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
     * @protected
     */
    endUpdateItem: function( itemNode ) {

      var animate = true;

      // Check node position - on scale, shelf or in no-man's land
      if ( this.scaleNode.intersectsDropArea( itemNode.bounds ) ) {

        // Dropped on the scale
        this.model.addShelfItemToScale( itemNode.item );
        this.model.addScaleItemsToNumberline();

        // Fruit bags should be expanded
        if ( this.sceneModeProperty.value === SceneMode.FRUIT && itemNode.item.countProperty.value > 1 ) {

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
     * @protected
     */
    hideKeypad: function() {
      this.keypad.hide();
      this.keypad.clear();
      this.keypad.clearListeners();
    },

    /**
     * @protected
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
     * @protected
     */
    onResize: function() {
      // resize the pick area to match the screen
      this.keypadCloseArea.setRectBounds( new Bounds2( 0, 0,  window.innerWidth, window.innerHeight ) );
    }

  } ); // inherit

} ); // define

