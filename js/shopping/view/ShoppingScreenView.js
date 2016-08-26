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
  var ShoppingConstants = require( 'UNIT_RATES/common/shopping/ShoppingConstants' );
  var URShoppingScreenView = require( 'UNIT_RATES/common/shopping/view/URShoppingScreenView' );
  var SceneMode = require( 'UNIT_RATES/common/shopping/enum/SceneMode' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var ChallengesNode = require( 'UNIT_RATES/shopping/view/ChallengesNode' );
  var ItemComboBox = require( 'UNIT_RATES/shopping/view/ItemComboBox' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {ShoppingModel} model
   * @constructor
   */
  function ShoppingScreenView( model ) {

    URShoppingScreenView.call( this, model, false );
  }

  unitRates.register( 'ShoppingScreenView', ShoppingScreenView );

  return inherit( URShoppingScreenView, ShoppingScreenView, {

    /**
     * Called from constructor to give subclass a chance to add UI elements at a specific point in the constructor
     * @protected
     */
    addSubclassScreenNodes: function() {
      var self = this;

      this.fruitItemDataProperty   = new Property( ItemData.APPLES );
      this.produceItemDataProperty = new Property( ItemData.CARROTS );
      this.candyItemDataProperty   = new Property( ItemData.PURPLE_CANDY );

      // challenges
      var onChallengePopulate = function() {
        self.model.resetChallengeNumberlineItems();   // make old challenge markers regular/black markers
        self.model.addChallengeItemsToNumberline();   // add new (i.e. correct unit rate)
        self.numberLineNode.populate();
      };
      var challengeWidth = this.layoutBounds.maxX - ( this.numberLineNode.right + ShoppingConstants.SCREEN_PANEL_SPACING + ShoppingConstants.SCREEN_HORIZONTAL_MARGIN );
      this.challengesNode = new ChallengesNode( this.model.challenges, this.keypad, challengeWidth, onChallengePopulate, {
        left: this.numberLineNode.right + ShoppingConstants.SCREEN_PANEL_SPACING,
        top:  this.layoutBounds.top + ShoppingConstants.SCREEN_VERTICAL_MARGIN
      } );
      this.addChild( this.challengesNode );

      // item selection - 1 combo box for each scene, hidden and shown based on sceneModeProperty
      var itemComboBoxOptions = {
        left:   this.layoutBounds.left   + ShoppingConstants.SCREEN_HORIZONTAL_MARGIN,
        bottom: this.layoutBounds.bottom - ShoppingConstants.SCREEN_VERTICAL_MARGIN
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

      // select the item based on scene & item selection - no dispose as this never goes away
      Property.multilink( [ this.sceneModeProperty, this.fruitItemDataProperty, this.produceItemDataProperty,
        this.candyItemDataProperty ], this.itemSelectionChanged.bind( this ) );
    },

    /**
     * Called when the user selects the sim reset button
     * @overrride @protected
     */
    resetAll: function() {

      this.fruitItemDataProperty.reset();
      this.produceItemDataProperty.reset();
      this.candyItemDataProperty.reset();

      URShoppingScreenView.prototype.resetAll.call( this );

      this.challengesNode.reset();
    },

    /**
     * Call when the user selected a new scene (i.e. "1", "2", "3")
     * @param {Property.<SceneMode>} sceneMode - indicates the new scene type
     * @param {Property.<SceneMode>} oldSceneMode - indicates the previous scene type
     * @override @protected
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
          assert && assert( false, 'Unrecognized scene' );
      }
    },

    /**
     * Called when the user selected a new item type (i.e. "apples", "carrots", "red candy")
     * @param {Property.<SceneMode>} sceneMode - indicates the scene type
     * @param {Property.<ItemData>} fruitItemData - the item data for the selected fruit item
     * @param {Property.<ItemData>} produceItemData - the item data for the selected produce item
     * @param {Property.<ItemData>} candyItemData - the item data for the selected candy item
     * @protected
     */
    itemSelectionChanged: function( sceneMode, fruitItemData, produceItemData, candyItemData ) {
      var self = this;

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
          assert && assert( false, 'Unrecognized scene' );
      }

      this.model.addChallengeItemsToNumberline();

      // This fixes an issue with items hanging in space when the item type selection changes. (see. issue #21, #18)
      this.itemsLayer.getChildren().forEach( function( child ) {
        self.endUpdateItem( child );
      } );
    }

  } ); // inherit

} ); // define

