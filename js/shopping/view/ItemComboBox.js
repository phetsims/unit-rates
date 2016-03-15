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
  var SceneMode = require( 'UNIT_RATES/shopping/enum/SceneMode' );
  var ItemType = require( 'UNIT_RATES/shopping/enum/ItemType' );
  var ItemNodeFactory = require( 'UNIT_RATES/shopping/view/ItemNodeFactory' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ComboBox = require( 'SUN/ComboBox' );

  // constants
  var ICON_SIZE = 10;
  var FONT = new PhetFont( 18 );

  /**
   *
   * @param {Property.<ItemType>} itemModeProperty
   * @param {Node}
   * @param {Object} [options]
   * @constructor
   */
  function ItemComboBox( model, sceneMode, itemModeProperty, parentNode, options ) {

    options = _.extend( {
      listPosition: 'above',
      buttonCornerRadius: 5,
      listCornerRadius: 5,
      itemYMargin: 0,
      itemXMargin: 3,
      maxWidth: 250
    }, options );

    // populate based on which scene
    var items  = [];
    switch( sceneMode ) {
      case SceneMode.FRUIT:
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.APPLES, ItemNodeFactory.createApple( ICON_SIZE ) ), ItemType.APPLES )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.LEMONS, ItemNodeFactory.createLemon( ICON_SIZE ) ), ItemType.LEMONS )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.ORANGES, ItemNodeFactory.createOrange( ICON_SIZE ) ), ItemType.ORANGES )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.PEARS, ItemNodeFactory.createPear( ICON_SIZE ) ), ItemType.PEARS )
        );
        break;
      case SceneMode.PRODUCE:
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.CARROTS, ItemNodeFactory.createCarrot( ICON_SIZE ) ), ItemType.CARROTS )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.CUCUMBERS, ItemNodeFactory.createCucumber( ICON_SIZE ) ), ItemType.CUCUMBERS )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.POTATOES, ItemNodeFactory.createPotatoe( ICON_SIZE ) ), ItemType.POTATOES )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.TOMATOES, ItemNodeFactory.createTomatoe( ICON_SIZE ) ), ItemType.TOMATOES )
        );
        break;
      case SceneMode.CANDY:
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.RED_CANDY, ItemNodeFactory.createRedCandy( ICON_SIZE ) ), ItemType.RED_CANDY )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.YELLOW_CANDY, ItemNodeFactory.createYellowCandy( ICON_SIZE ) ), ItemType.YELLOW_CANDY )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.GREEN_CANDY, ItemNodeFactory.createGreenCandy( ICON_SIZE ) ), ItemType.GREEN_CANDY )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( ItemType.BLUE_CANDY, ItemNodeFactory.createBlueCandy( ICON_SIZE ) ), ItemType.BLUE_CANDY )
        );
        break;
      default:
    }

    assert && assert( items.length > 0, 'Item list is empty' );

    ComboBox.call( this, items, itemModeProperty, parentNode, options );
  }

  unitRates.register( 'ItemComboBox', ItemComboBox );

  return inherit( ComboBox, ItemComboBox, {

    /**
     * @param {SceneMode} itemNode
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
          console.log( 'FIXME' );
      }

    },

    /**
     * @param {string} titleString
     * @param {Node} itemNode
     * @returns {HBox}
     */
    createItemRow: function( itemString, itemNode ) {

      var itemText = new Text( itemString, { font: FONT, maxWidth: 200 } );
      var hStrut = new HStrut( 175 - itemText.width - itemNode.width ); // FIXME: how to justify entries?

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
