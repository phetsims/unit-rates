// Copyright 2016, University of Colorado Boulder

/**
 * The main shopping screen This is derived from URShoppingScreenView and adds the item combo box and challenge panel
 * to it.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  
  // sim modules
  var OLDChallengesNode = require( 'UNIT_RATES/old/shopping/view/OLDChallengesNode' );
  var OLDItemComboBox = require( 'UNIT_RATES/old/shopping/view/OLDItemComboBox' );
  var OLDURConstants = require( 'UNIT_RATES/old/common/OLDURConstants' );
  var OLDURShoppingScreenView = require( 'UNIT_RATES/old/common/shopping/view/OLDURShoppingScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  
  /**
   * @param {OLDShoppingModel} model
   * @constructor
   */
  function OLDShoppingScreenView( model ) {
    OLDURShoppingScreenView.call( this, model, false, this.onNumberLineEraseCallback.bind( this ) );

    //TODO use a better method of notifying the view
    model.onChallengeCallback = this.onChallengeCallback.bind( this );
  }

  unitRates.register( 'OLDShoppingScreenView', OLDShoppingScreenView );

  return inherit( OLDURShoppingScreenView, OLDShoppingScreenView, {

    /**
     * Called from constructor to give subclass a chance to add UI elements at a specific point in the constructor
     *
     * @protected
     */
    addSubclassScreenNodes: function() {
      var self = this;

      // challenges
      var onChallengePopulate = function() {
        self.model.addChallengeItemsToNumberLine();   // add new (i.e. correct unit rate)
        self.numberLineNode.populate();
      };
      var challengeWidth = this.layoutBounds.maxX - ( this.numberLineNode.right + OLDURConstants.PANEL_SPACING + OLDURConstants.SCREEN_HORIZONTAL_MARGIN );
      this.challengesNode = new OLDChallengesNode( this.model.challenges, this.keypad, challengeWidth, onChallengePopulate, {
        left: this.numberLineNode.right + OLDURConstants.PANEL_SPACING,
        top: this.layoutBounds.top + OLDURConstants.SCREEN_VERTICAL_MARGIN
      } );
      this.addChild( this.challengesNode );

      // @private an item combo box for each scene
      this.comboBoxes = [];
      this.model.scenes.forEach( function( scene ) {
        self.comboBoxes.push( new OLDItemComboBox( scene.itemDataArray, scene.itemDataProperty, self ) );
      } );
      this.addChild( new Node( {
        children: this.comboBoxes,
        left: this.layoutBounds.left + OLDURConstants.SCREEN_HORIZONTAL_MARGIN,
        bottom: this.layoutBounds.bottom - OLDURConstants.SCREEN_VERTICAL_MARGIN
      } ) );
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
      OLDURShoppingScreenView.prototype.resetAll.call( this );
      this.challengesNode.reset();
    },

    /**
     * Call when the user selected a new scene
     *
     * @param {Property.<string>} scene
     * @protected
     * @override
     */
    sceneChanged: function( scene ) {

      OLDURShoppingScreenView.prototype.sceneChanged.call( this, scene );

      //TODO temporary hack to make the proper combo box visible
      this.comboBoxes.forEach( function( comboBox ) {
        comboBox.visible = false;
      } );
      this.comboBoxes[ this.model.scenes.indexOf( scene ) ].visible = true;
    },

    /**
     * Called when the selected item changes.
     *
     * @param {ItemData} itemData
     * @protected
     * @override
     */
    itemDataChanged: function( itemData ) {
      OLDURShoppingScreenView.prototype.itemDataChanged.call( this, itemData );
      this.model.addChallengeItemsToNumberLine();
    }
  } );
} );

