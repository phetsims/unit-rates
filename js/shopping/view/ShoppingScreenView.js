// Copyright 2016, University of Colorado Boulder

/**
 * The main shopping screen This is derived from URShoppingScreenView and adds the item combo box and challenge panel
 * to it.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengesNode = require( 'UNIT_RATES/shopping/view/ChallengesNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemData = require( 'UNIT_RATES/common/shopping/model/ItemData' );
  var ItemComboBox = require( 'UNIT_RATES/shopping/view/ItemComboBox' );
  var Property = require( 'AXON/Property' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URShoppingScreenView = require( 'UNIT_RATES/common/shopping/view/URShoppingScreenView' );

  /**
   * @param {ShoppingModel} model
   * @constructor
   */
  function ShoppingScreenView( model ) {

    model.onChallengeCallback = this.onChallengeCallback.bind( this );

    URShoppingScreenView.call( this, model, false, this.onNumberLineEraseCallback.bind( this ) );
  }

  unitRates.register( 'ShoppingScreenView', ShoppingScreenView );

  return inherit( URShoppingScreenView, ShoppingScreenView, {

    /**
     * Called from constructor to give subclass a chance to add UI elements at a specific point in the constructor
     *
     * @protected
     */
    addSubclassScreenNodes: function() {
      var self = this;

      this.fruitItemDataProperty = new Property( ItemData.APPLES );
      this.produceItemDataProperty = new Property( ItemData.CARROTS );
      this.candyItemDataProperty = new Property( ItemData.PURPLE_CANDY );

      // challenges
      var onChallengePopulate = function() {
        self.model.addChallengeItemsToNumberLine();   // add new (i.e. correct unit rate)
        self.numberLineNode.populate();
      };
      var challengeWidth = this.layoutBounds.maxX - ( this.numberLineNode.right + URConstants.PANEL_SPACING + URConstants.SCREEN_HORIZONTAL_MARGIN );
      this.challengesNode = new ChallengesNode( this.model.challenges, this.keypad, challengeWidth, onChallengePopulate, {
        left: this.numberLineNode.right + URConstants.PANEL_SPACING,
        top: this.layoutBounds.top + URConstants.SCREEN_VERTICAL_MARGIN
      } );
      this.addChild( this.challengesNode );

      // item selection - 1 combo box for each scene, hidden and shown based on sceneProperty
      var itemComboBoxOptions = {
        left: this.layoutBounds.left + URConstants.SCREEN_HORIZONTAL_MARGIN,
        bottom: this.layoutBounds.bottom - URConstants.SCREEN_VERTICAL_MARGIN
      };
      this.fruitItemsComboBox = new ItemComboBox( 'fruit', this.fruitItemDataProperty,
        this, itemComboBoxOptions );
      this.addChild( this.fruitItemsComboBox );

      this.produceItemsComboBox = new ItemComboBox( 'produce', this.produceItemDataProperty,
        this, itemComboBoxOptions );
      this.addChild( this.produceItemsComboBox );

      this.candyItemsComboBox = new ItemComboBox( 'candy', this.candyItemDataProperty,
        this, itemComboBoxOptions );
      this.addChild( this.candyItemsComboBox );

      // select the item based on scene & item selection - no dispose as this never goes away
      Property.multilink( [ this.sceneProperty, this.fruitItemDataProperty, this.produceItemDataProperty,
        this.candyItemDataProperty ], this.itemSelectionChanged.bind( this ) );
    },

    /**
     * TODO document, https://github.com/phetsims/unit-rates/issues/64
     *
     * @protected
     */
    onNumberLineEraseCallback: function() {
      this.model.addScaleItemsToNumberLine();
      this.model.addChallengeItemsToNumberLine();
      this.numberLineNode.populate();
    },

    /**
     * TODO document, https://github.com/phetsims/unit-rates/issues/64
     *
     * @protected
     */
    onChallengeCallback: function() {
      this.numberLineNode.removeAllMarkerNodes();
      this.numberLineNode.populate();
    },

    /**
     * Called when the user selects the sim reset button
     *
     * @override
     * @protected
     */
    resetAll: function() {

      this.fruitItemDataProperty.reset();
      this.produceItemDataProperty.reset();
      this.candyItemDataProperty.reset();

      URShoppingScreenView.prototype.resetAll.call( this );

      this.challengesNode.reset();
    },

    /**
     * Call when the user selected a new scene
     *
     * @param {Property.<string>} scene
     * @param {Property.<string>} oldScene
     * @override
     * @protected
     */
    sceneSelectionChanged: function( scene, oldScene ) {

      URShoppingScreenView.prototype.sceneSelectionChanged.call( this, scene, oldScene );

      // hide/show different combo boxes based on scene selection
      switch( scene ) {
        case 'fruit':
          this.fruitItemsComboBox.visible = true;
          this.produceItemsComboBox.visible = false;
          this.candyItemsComboBox.visible = false;
          break;
        case 'produce':
          this.fruitItemsComboBox.visible = false;
          this.produceItemsComboBox.visible = true;
          this.candyItemsComboBox.visible = false;
          break;
        case 'candy':
          this.fruitItemsComboBox.visible = false;
          this.produceItemsComboBox.visible = false;
          this.candyItemsComboBox.visible = true;
          break;
        default:
          throw new Error( 'invalid scene: ' + scene );
      }
    },

    /**
     * Called when the user selected a new item type (i.e. 'apples', 'carrots', 'red candy')
     *
     * @param {Property.<scene>} scene
     * @param {Property.<ItemData>} fruitItemData - the item data for the selected fruit item
     * @param {Property.<ItemData>} produceItemData - the item data for the selected produce item
     * @param {Property.<ItemData>} candyItemData - the item data for the selected candy item
     * @protected
     */
    itemSelectionChanged: function( scene, fruitItemData, produceItemData, candyItemData ) {

      this.hideKeypad();

      this.removeAllItems();

      switch( scene ) {
        case 'fruit':
          this.model.itemDataProperty.value = fruitItemData;
          break;
        case 'produce':
          this.model.itemDataProperty.value = produceItemData;
          break;
        case 'candy':
          this.model.itemDataProperty.value = candyItemData;
          break;
        default:
          throw new Error( 'invalid scene: ' + scene );
      }

      this.model.addChallengeItemsToNumberLine();
    }

  } ); // inherit

} ); // define

