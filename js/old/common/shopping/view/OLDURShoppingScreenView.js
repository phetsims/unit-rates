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
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  
  // sim modules
  var OLDKeypadPanelNode = require( 'UNIT_RATES/old/common/view/OLDKeypadPanelNode' );
  var OLDNumberLineNode = require( 'UNIT_RATES/old/common/shopping/view/OLDNumberLineNode' );
  var OLDScaleNode = require( 'UNIT_RATES/old/common/shopping/view/OLDScaleNode' );
  var OLDShelfNode = require( 'UNIT_RATES/old/common/shopping/view/OLDShelfNode' );
  var OLDShoppingSceneControl = require( 'UNIT_RATES/old/common/shopping/view/OLDShoppingSceneControl' );
  var OLDURConstants = require( 'UNIT_RATES/old/common/OLDURConstants' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var doubleNumberLineString = require( 'string!UNIT_RATES/doubleNumberLine' );

  /**
   * @param {OLDShoppingModel} model
   * @param {boolean} enableHideScaleCost - flag to enable the option to close the scale value display
   * @param {function} [eraseNumberLineCallback] - function to be called when the number line erase button is pressed
   * @constructor
   */
  function OLDURShoppingScreenView( model, enableHideScaleCost, eraseNumberLineCallback ) {

    ScreenView.call( this );

    var self = this;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.model = model;

    // shared keypad which becomes visible when an edit number display button is selected.
    this.keypad = new OLDKeypadPanelNode( {
      visible: false
    } );
    this.addChild( this.keypad );

    // number line
    // @public
    this.numberLineNode = new OLDNumberLineNode( model.numberLine, this.keypad, {
      left: this.layoutBounds.left + OLDURConstants.PANEL_SPACING,
      top: this.layoutBounds.top + OLDURConstants.SCREEN_VERTICAL_MARGIN,
      numberLineTitle: doubleNumberLineString,
      onEraseCallback: eraseNumberLineCallback
    } );
    this.addChild( this.numberLineNode );

    // keypad layout
    this.keypad.right = this.numberLineNode.right - 15;
    this.keypad.top = this.numberLineNode.bottom + 2 * OLDURConstants.PANEL_SPACING;

    // @protected - covers entire screen, uses pick to close keypad
    this.keypadCloseArea = new Rectangle( 0, 0, window.innerWidth, window.innerHeight, { visible: false } );
    this.addChild( this.keypadCloseArea );

    this.keypad.visibleProperty.link( function( value, oldValue ) {
      self.keypadCloseArea.visible = value;
    } );

    // Click on keypadCloseArea to close keypad
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
    this.shelfNode = new OLDShelfNode( model.shelf, this.itemsLayer,
      this.startUpdateItem.bind( this ),
      this.endUpdateItem.bind( this ), {
        centerX: this.numberLineNode.centerX + 30,
        bottom: this.layoutBounds.bottom - OLDURConstants.SCREEN_VERTICAL_MARGIN
      } );
    this.addChild( this.shelfNode );

    // scale
    this.scaleNode = new OLDScaleNode( model.scale, this.itemsLayer,
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
      right: this.scaleNode.left - OLDURConstants.PANEL_SPACING,
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
      right: this.layoutBounds.maxX - OLDURConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: this.layoutBounds.maxY - OLDURConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( resetAllButton );

    this.addSubclassScreenNodes();

    // scene selection buttons
    var sceneControl = new OLDShoppingSceneControl( model.scenes, model.sceneProperty, {
      right: this.layoutBounds.right - OLDURConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: resetAllButton.top - OLDURConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( sceneControl );

    model.sceneProperty.link( this.sceneChanged.bind( this ) );
    model.itemDataProperty.link( this.itemDataChanged.bind( this ) );

    // Layer the keypad & draggable nodes for proper rendering/interaction
    this.keypadCloseArea.moveToFront();
    this.keypad.moveToFront();
    this.itemsLayer.moveToFront();

    // resize the keypad pick layer on a browser size change
    this.on( 'bounds', this.onResize.bind( this ) );
  }

  unitRates.register( 'OLDURShoppingScreenView', OLDURShoppingScreenView );

  return inherit( ScreenView, OLDURShoppingScreenView, {

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
     * Called when the selected scene changes.
     *
     * @param {Property.<ShoppingScene>} scene
     * @protected
     */
    sceneChanged: function( scene ) {
      this.hideKeypad();
    },

    /**
     * Called when the selected item changes.
     *
     * @param {ItemData} itemData
     * @protected
     * @override
     */
    itemDataChanged: function( itemData ) {
      this.hideKeypad();
      this.removeAllItems();
      this.shelfNode.itemDataChanged( itemData );
      this.scaleNode.itemDataChanged( itemData );
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
        if ( this.model.sceneProperty.value.name === 'fruit' && itemNode.item.countProperty.value > 1 ) {

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
      this.keypadCloseArea.setRect( 0, 0, window.innerWidth, window.innerHeight );
    },

    /**
     * Called when the user selects the sim reset button
     *
     * @protected
     */
    resetAll: function() {

      this.model.reset();

      this.removeAllItems();
      this.hideKeypad();
      this.numberLineNode.reset();
      this.scaleNode.reset();
      this.shelfNode.reset();
    }

  } ); // inherit

} ); // define

