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
  var NumberLineNode = require( 'UNIT_RATES/shopping/view/NumberLineNode' );
  var KeypadPanel = require( 'UNIT_RATES/common/view/KeypadPanel' );
  var ChallengesNode = require( 'UNIT_RATES/shopping/view/ChallengesNode' );
  var ItemComboBox = require( 'UNIT_RATES/shopping/view/ItemComboBox' );
  var ShelfNode = require( 'UNIT_RATES/shopping/view/ShelfNode' );
  var ScaleNode = require( 'UNIT_RATES/shopping/view/ScaleNode' );
  var CurvedArrowButton = require( 'UNIT_RATES/common/view/CurvedArrowButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Property = require( 'AXON/Property' );

  // constants
  var SCREEN_HORIZONTAL_MARGIN = 15;
  var SCREEN_VERTICAL_MARGIN = 20;
  var PANEL_HORIZONTAL_SPACING = 12; // space between scene buttons/numberline/challenges

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
      left:  this.layoutBounds.left + SCREEN_HORIZONTAL_MARGIN,
      top: this.layoutBounds.top + SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( sceneControlButtons );

    // item selection - 1 combo boxe for each scene, hidden and shown based on sceneModeProperty
    var itemComboBoxOptions = {
      left:  this.layoutBounds.left + SCREEN_HORIZONTAL_MARGIN,
      bottom: this.layoutBounds.bottom - SCREEN_VERTICAL_MARGIN
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

    // layer for draggable shelf & scale item nodes
    this.itemsLayer = new Node();
    this.addChild( this.itemsLayer );

    // shelf
    this.shelfNode = new ShelfNode( model.shelf, this.itemsLayer, this.itemMoved.bind( this ), {
      centerX:  this.layoutBounds.centerX,
      bottom: this.layoutBounds.bottom - SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( this.shelfNode );

    // scale
    this.scaleNode = new ScaleNode( model.scale, this.itemsLayer, this.itemMoved.bind( this ) , {
      centerX:  this.layoutBounds.centerX,
      bottom: this.shelfNode.top - 50
    } );
    this.addChild( this.scaleNode );

    // remove button
    var scaleRemoveButtonNode = new CurvedArrowButton( {
      right:  this.scaleNode.left - PANEL_HORIZONTAL_SPACING,
      bottom: this.scaleNode.bottom,
      listener: function() {

        // reset the current item type - remove scale items & re-populate shelf items
        self.itemsLayer.removeAllChildren();
        self.scaleNode.resetCurrentItem();
        self.shelfNode.resetCurrentItem();
      }
    } );
    this.addChild( scaleRemoveButtonNode );

    this.keypad = new KeypadPanel( {
      left:  this.scaleNode.right + PANEL_HORIZONTAL_SPACING,
      bottom: this.scaleNode.bottom + 2*PANEL_HORIZONTAL_SPACING,
      maxDigits: 4,
      visible: false
    } );
    this.addChild( this.keypad );

    // number line
    this.numberLineNode = new NumberLineNode( model.numberLine, this.keypad, {
      left:  sceneControlButtons.right + PANEL_HORIZONTAL_SPACING,
      top: this.layoutBounds.top + SCREEN_VERTICAL_MARGIN } );
    this.addChild( this.numberLineNode );

    // challenges
    var challengeWidth = this.layoutBounds.maxX - ( this.numberLineNode.right + PANEL_HORIZONTAL_SPACING + SCREEN_HORIZONTAL_MARGIN );
    var challengesNode = new ChallengesNode( model.challenges, this.keypad, challengeWidth, {
      left:  this.numberLineNode.right + PANEL_HORIZONTAL_SPACING,
      top: this.layoutBounds.top + SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( challengesNode );

    // select the scene
    this.sceneModeProperty.link( this.sceneSelectionChanged.bind( this) );

    // select the item based on scene & item selection
    Property.multilink( [ this.sceneModeProperty, this.fruitItemDataProperty, this.produceItemDataProperty,
      this.candyItemDataProperty ], this.itemSelectionChanged.bind( this ) );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();

        self.hideKeypad();

        self.numberLineNode.reset();

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

    // FIXME: figure out how to get click on screen to close keypad
    //this.addInputListener( {
    //  down: function( event ) {
    //    console.log('click');
    //    event.handle();
    //  }
    //} );

    // initialize shelf items
    this.shelfNode.populate();
  }

  unitRates.register( 'ShoppingScreenView', ShoppingScreenView );

  return inherit( ScreenView, ShoppingScreenView, {

    // @private
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

    // @private
    itemSelectionChanged: function( sceneMode, fruitItemData, produceItemData, candyItemData ) {

      this.hideKeypad();

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
          assert && assert( true, 'Unrecognized scene' );
      }
    },

    // Called when an item's node (i.e. individual items & bags) is dragged to a new location
    // @private
    itemMoved: function( itemNode ) {

      // Check node position - on scale, shelf or in no-man's land
      if( this.scaleNode.intersectsDropArea( itemNode.bounds ) ) {

        this.model.addShelfItemToScale( itemNode.item );

        // Fruit bags should be expanded
        if( this.sceneModeProperty.value === SceneMode.FRUIT && itemNode.item.count > 1 ) {

          // remove the bag node
          this.itemsLayer.removeChild( itemNode );

          // populate new scale items
          this.scaleNode.populate();
        }

        // make sure bottom of items are actually on the scale
        this.scaleNode.adjustItemPositions();

        // populate nuber line
        this.numberLineNode.populate();
      }
      else if( this.shelfNode.intersectsDropArea( itemNode.bounds ) ) {

        this.model.addScaleItemToShelf( itemNode.item );

        // make sure bottom of items are actually on the shelf
        this.shelfNode.adjustItemPositions();

        // populate nuber line
        this.numberLineNode.populate();
      }
      else {
        // Send it back from whence it came
        itemNode.restoreLastPosition();
      }
    },

    /**
     * @protected
     */
    hideKeypad: function() {
      //this.keypad.visible = false;
      //this.keypad.digitStringProperty.unlinkAll();
      //this.keypad.clear();
    }

  } ); // inherit

} ); // define

