// Copyright 2016, University of Colorado Boulder

/**
 * The main shopping screen layout and top level behaviors
 * (i.e. scene selection, moving items between shelf/scale, reset, etc.)
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadPanelNode = require( 'UNIT_RATES/common/view/KeypadPanelNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberLineNode = require( 'UNIT_RATES/common/shopping/view/NumberLineNode' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScaleNode = require( 'UNIT_RATES/common/shopping/view/ScaleNode' );
  var SceneButtonGroupNode = require( 'UNIT_RATES/common/shopping/view/SceneButtonGroupNode' );
  var SceneMode = require( 'UNIT_RATES/common/shopping/enum/SceneMode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShelfNode = require( 'UNIT_RATES/common/shopping/view/ShelfNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );

  // strings
  var doubleNumberLineString = require( 'string!UNIT_RATES/doubleNumberLine' );

  /**
   * @param {ShoppingModel} model
   * @param {boolean} enableHideScaleCost - flag to enable the option to close the scale value display
   * @param {function} [eraseNumberLineCallback] - function to be called when the number line erase button is pressed
   * @constructor
   */
  function URShoppingScreenView( model, enableHideScaleCost, eraseNumberLineCallback ) {

    ScreenView.call( this );

    var self = this;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.model = model;

    // @public - the scene type (fruit | produce | candy )
    // FIXME: scene & item randomly chosen @ startup (TBD as per current design document)
    this.sceneModeProperty = new Property( SceneMode.FRUIT );

    // shared keypad which becomes visible when an edit number display button is selected.
    this.keypad = new KeypadPanelNode( {
      maxDigits: 4,
      visible: false
    } );
    this.addChild( this.keypad );

    // number line
    // @public
    this.numberLineNode = new NumberLineNode( model.numberLine, this.keypad, {
      left: this.layoutBounds.left + URConstants.PANEL_SPACING,
      top: this.layoutBounds.top + URConstants.SCREEN_VERTICAL_MARGIN,
      numberLineTitle: doubleNumberLineString,
      onEraseCallback: eraseNumberLineCallback
    } );
    this.addChild( this.numberLineNode );

    // keypad layout
    this.keypad.right = this.numberLineNode.right - 30;
    this.keypad.top = this.numberLineNode.bottom + 2 * URConstants.PANEL_SPACING;

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
      this.startUpdateItem.bind( this ),
      this.endUpdateItem.bind( this ), {
        centerX: this.numberLineNode.centerX + 15,
        bottom: this.layoutBounds.bottom - URConstants.SCREEN_VERTICAL_MARGIN
      } );
    this.addChild( this.shelfNode );

    // scale
    this.scaleNode = new ScaleNode( model.scale, this.itemsLayer,
      this.startUpdateItem.bind( this ),
      this.endUpdateItem.bind( this ), {
        centerX: this.shelfNode.centerX,
        bottom: this.shelfNode.top - 75,
        enableHideCost: enableHideScaleCost
      } );
    this.addChild( this.scaleNode );

    // scale remove all items button
    var scaleRemoveIcon = new FontAwesomeNode( 'level_down' );
    scaleRemoveIcon.setScaleMagnitude( -0.7, 0.7 ); // reflect about the y axis
    var scaleRemoveButtonNode = new RectangularPushButton( {
      xMargin: 12,
      right: this.scaleNode.left - URConstants.PANEL_SPACING,
      bottom: this.scaleNode.bottom,
      baseColor: '#f2f2f2',
      content: scaleRemoveIcon,
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
      right: this.layoutBounds.maxX - URConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: this.layoutBounds.maxY - URConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( resetAllButton );

    this.addSubclassScreenNodes();

    // scene selection buttons
    var sceneControlButtons = new SceneButtonGroupNode( this.sceneModeProperty, {
      right: this.layoutBounds.right - URConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: resetAllButton.top - URConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( sceneControlButtons );

    // select the scene
    this.sceneModeProperty.link( this.sceneSelectionChanged.bind( this ) );

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

    // no dispose, persists for the lifetime of the sim.

    /**
     * Called from the constructor to allow for subclassed to add additional nodes/properties to the screen
     *
     * @protected
     */
    constructScreenNodes: function() {
      // no implementation in base screen class
    },

    /**
     * Call when the user selected a new scene
     *
     * @param {Property.<SceneMode>} sceneMode - indicates the new scene type
     * @param {Property.<SceneMode>} oldSceneMode - indicates the previous scene type
     * @protected
     */
    sceneSelectionChanged: function( sceneMode, oldSceneMode ) {
      this.hideKeypad();
    },

    /**
     * Called before an item is dragged
     *
     * @param {Node} itemNode - the item being moved.
     * @protected
     */
    startUpdateItem: function( itemNode ) {
    },

    /*
     * Called after an item is dropped. Updates the model based on where the item is on on the screen - i.e. on the
     * scale or shelf or in no-man's land. Called on scene changes or when an item's node (i.e. individual items or
     * bags) is moved to a new location
     *
     * @param {Node} itemNode - the item being moved.
     * @protected
     */
    endUpdateItem: function( itemNode ) {

      var animate = true;

      // Check node position - on scale or in no-man's land
      if ( this.scaleNode.intersectsDropArea( itemNode.bounds ) ) {

        // Dropped on the scale
        this.model.addShelfItemToScale( itemNode.item );
        this.model.addScaleItemsToNumberLine();
        // populate number line
        this.numberLineNode.populate();

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
      }
      else {
        // Move item back to the shelf
        this.model.addScaleItemToShelf( itemNode.item );

        // Update the number line
        this.model.addScaleItemsToNumberLine();

        // populate number line
        this.numberLineNode.populate();

        // make sure items are stacked on the scale
        this.scaleNode.adjustItemPositions( animate );

        // make sure items are stacked on the scale
        this.shelfNode.adjustItemPositions( animate );
      }
    },

    /**
     * TODO document this
     *
     * @protected
     */
    hideKeypad: function() {
      this.keypad.hide();
      this.keypad.clear();
      this.keypad.clearListeners();
    },

    /**
     * Removed all movable items from the screen
     *
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
     * Resize the keypad close area to match that of the browser window.
     *
     * @protected
     */
    onResize: function() {
      // resize the pick area to match the screen
      this.keypadCloseArea.setRectBounds( new Bounds2( 0, 0, window.innerWidth, window.innerHeight ) );
    },

    /**
     * Called when the user selects the sim reset button
     *
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
    }

  } ); // inherit

} ); // define

