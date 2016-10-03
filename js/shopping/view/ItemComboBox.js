// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var SceneMode = require( 'UNIT_RATES/common/shopping/enum/SceneMode' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var Item = require( 'UNIT_RATES/common/shopping/model/Item' );
  var ItemNodeFactory = require( 'UNIT_RATES/common/shopping/view/ItemNodeFactory' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ComboBox = require( 'SUN/ComboBox' );

  // strings
  var applesCapString = require( 'string!UNIT_RATES/applesCap' );
  var lemonsCapString = require( 'string!UNIT_RATES/lemonsCap' );
  var orangesCapString = require( 'string!UNIT_RATES/orangesCap' );
  var pearsCapString = require( 'string!UNIT_RATES/pearsCap' );
  var carrotsCapString = require( 'string!UNIT_RATES/carrotsCap' );
  var cucumbersCapString = require( 'string!UNIT_RATES/cucumbersCap' );
  var potatoesCapString = require( 'string!UNIT_RATES/potatoesCap' );
  var tomatoesCapString = require( 'string!UNIT_RATES/tomatoesCap' );
  var blueCandyString = require( 'string!UNIT_RATES/blueCandy' );
  var greenCandyString = require( 'string!UNIT_RATES/greenCandy' );
  var purpleCandyString = require( 'string!UNIT_RATES/purpleCandy' );
  var redCandyString = require( 'string!UNIT_RATES/redCandy' );

  // constants
  var FONT = new PhetFont( 18 );

  /**
   *
   * @param {SceneMode} sceneMode - ( SceneMode.FRUIT | SceneMode.PRODUCE | SceneMode.CANDY )
   * @param {Property.<ItemData>} itemDataProperty - the currently selected item
   * @param {Node} parentNode - the parent node of the combo box
   * @param {Object} [options]
   * @constructor
   */
  function ItemComboBox( sceneMode, itemDataProperty, parentNode, options ) {

    options = _.extend( {
      listPosition: 'above',
      buttonCornerRadius: 5,
      listCornerRadius: 5,
      itemYMargin: 0,
      itemXMargin: 3,
      maxWidth: 200
    }, options );

    // populate the menu based on which scene
    var items = [];
    switch( sceneMode ) {
      case SceneMode.FRUIT:
        items.push( ComboBox.createItem(
          this.createItemRow( applesCapString, ItemNodeFactory.createItemNode( new Item( ItemData.APPLES.type, 1 ) ) ),
          ItemData.APPLES ) );
        items.push( ComboBox.createItem(
          this.createItemRow( lemonsCapString, ItemNodeFactory.createItemNode( new Item( ItemData.LEMONS.type, 1 ) ) ),
          ItemData.LEMONS ) );
        items.push( ComboBox.createItem(
          this.createItemRow( orangesCapString, ItemNodeFactory.createItemNode( new Item( ItemData.ORANGES.type, 1 ) ) ),
          ItemData.ORANGES ) );
        items.push( ComboBox.createItem(
          this.createItemRow( pearsCapString, ItemNodeFactory.createItemNode( new Item( ItemData.PEARS.type, 1 ) ) ),
          ItemData.PEARS ) );
        break;
      case SceneMode.PRODUCE:
        items.push( ComboBox.createItem(
          this.createItemRow( carrotsCapString, ItemNodeFactory.createItemNode( new Item( ItemData.CARROTS.type, 1 ) ) ),
          ItemData.CARROTS ) );
        items.push( ComboBox.createItem(
          this.createItemRow( cucumbersCapString, ItemNodeFactory.createItemNode( new Item( ItemData.CUCUMBERS.type, 1 ) ) ),
          ItemData.CUCUMBERS ) );
        items.push( ComboBox.createItem(
          this.createItemRow( potatoesCapString, ItemNodeFactory.createItemNode( new Item( ItemData.POTATOES.type, 1 ) ) ),
          ItemData.POTATOES ) );
        items.push( ComboBox.createItem(
          this.createItemRow( tomatoesCapString, ItemNodeFactory.createItemNode( new Item( ItemData.TOMATOES.type, 1 ) ) ),
          ItemData.TOMATOES ) );
        break;
      case SceneMode.CANDY:
        items.push( ComboBox.createItem(
          this.createItemRow( purpleCandyString, ItemNodeFactory.createItemNode( new Item( ItemData.PURPLE_CANDY.type, 1 ),
            { imageScale: 0.035 } ) ), ItemData.PURPLE_CANDY ) );
        items.push( ComboBox.createItem(
          this.createItemRow( redCandyString, ItemNodeFactory.createItemNode( new Item( ItemData.RED_CANDY.type, 1 ),
            { imageScale: 0.035 } ) ), ItemData.RED_CANDY ) );
        items.push( ComboBox.createItem(
          this.createItemRow( greenCandyString, ItemNodeFactory.createItemNode( new Item( ItemData.GREEN_CANDY.type, 1 ),
            { imageScale: 0.035 } ) ), ItemData.GREEN_CANDY ) );
        items.push( ComboBox.createItem(
          this.createItemRow( blueCandyString, ItemNodeFactory.createItemNode( new Item( ItemData.BLUE_CANDY.type, 1 ),
            { imageScale: 0.035 } ) ), ItemData.BLUE_CANDY ) );
        break;
      default:
        assert && assert( false, 'Combo box using unrecognized type' );
    }

    assert && assert( items.length > 0, 'Item list is empty' );

    ComboBox.call( this, items, itemDataProperty, parentNode, options );
  }

  unitRates.register( 'ItemComboBox', ItemComboBox );

  return inherit( ComboBox, ItemComboBox, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Selects the current scene
     * @param {SceneMode} sceneMode - ( SceneMode.FRUIT | SceneMode.PRODUCE | SceneMode.CANDY )
     */
    setSceneMode: function( sceneMode ) {
      switch( sceneMode ) {
        case SceneMode.FRUIT:
          console.log( 'Scene fruit' );
          break;
        case SceneMode.PRODUCE:
          console.log( 'Scene produce' );
          break;
        case SceneMode.CANDY:
          console.log( 'Scene candy' );
          break;
        default:
          assert && assert( false, 'Combo box using unrecognized scene' );
      }

    },

    /**
     * Creates one row or entry in the menu consisting of an icon and a label
     * @param {string} itemString - the item name
     * @param {Node} itemNode - the item icon
     * @returns {HBox}
     */
    createItemRow: function( itemString, itemNode ) {

      var itemText = new Text( itemString, { font: FONT, maxWidth: 140 } );
      var hStrut = new HStrut( 175 - itemText.width - itemNode.width );

      // container for one row in the legend
      return new HBox( {
        spacing: 0,
        top: 0,
        right: 0,
        align: 'center',
        children: [ itemText, hStrut, itemNode ]
      } );
    }

  } ); // inherit

} ); // define
