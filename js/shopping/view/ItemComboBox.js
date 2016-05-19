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
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var ItemNodeFactory = require( 'UNIT_RATES/shopping/view/ItemNodeFactory' );
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
  var redCandyString = require( 'string!UNIT_RATES/RedCandy' );
  var yellowCandyString = require( 'string!UNIT_RATES/YellowCandy' );
  var greenCandyString = require( 'string!UNIT_RATES/GreenCandy' );
  var blueCandyString = require( 'string!UNIT_RATES/BlueCandy' );

  // constants
  var ICON_SIZE = 20;
  var FONT = new PhetFont( 18 );

  /**
   *
   * @param {Property.<ItemData>} itemDataProperty
   * @param {Node}
   * @param {Object} [options]
   * @constructor
   */
  function ItemComboBox( model, sceneMode, itemDataProperty, parentNode, options ) {

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
          this.createItemRow( applesCapString, ItemNodeFactory.createApple( ICON_SIZE ) ), ItemData.APPLES )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( lemonsCapString, ItemNodeFactory.createLemon( ICON_SIZE ) ), ItemData.LEMONS )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( orangesCapString, ItemNodeFactory.createOrange( ICON_SIZE ) ), ItemData.ORANGES )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( pearsCapString, ItemNodeFactory.createPear( ICON_SIZE ) ), ItemData.PEARS )
        );
        break;
      case SceneMode.PRODUCE:
        items.push( ComboBox.createItem(
          this.createItemRow( carrotsCapString, ItemNodeFactory.createCarrot( ICON_SIZE ) ), ItemData.CARROTS )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( cucumbersCapString, ItemNodeFactory.createCucumber( ICON_SIZE ) ), ItemData.CUCUMBERS )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( potatoesCapString, ItemNodeFactory.createPotato( ICON_SIZE ) ), ItemData.POTATOES )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( tomatoesCapString, ItemNodeFactory.createTomato( ICON_SIZE ) ), ItemData.TOMATOES )
        );
        break;
      case SceneMode.CANDY:
        items.push( ComboBox.createItem(
          this.createItemRow( redCandyString, ItemNodeFactory.createRedCandy( ICON_SIZE ) ), ItemData.RED_CANDY )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( yellowCandyString, ItemNodeFactory.createYellowCandy( ICON_SIZE ) ), ItemData.YELLOW_CANDY )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( greenCandyString, ItemNodeFactory.createGreenCandy( ICON_SIZE ) ), ItemData.GREEN_CANDY )
        );
        items.push( ComboBox.createItem(
          this.createItemRow( blueCandyString, ItemNodeFactory.createBlueCandy( ICON_SIZE ) ), ItemData.BLUE_CANDY )
        );
        break;
      default:
        assert && assert( true, 'Combo box using unrecognized type' );
    }

    assert && assert( items.length > 0, 'Item list is empty' );

    ComboBox.call( this, items, itemDataProperty, parentNode, options );
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
        assert && assert( true, 'Combo box using unrecognized scene' );
      }

    },

    /**
     * @param {string} titleString
     * @param {Node} itemNode
     * @returns {HBox}
     */
    createItemRow: function( itemString, itemNode ) {

      var itemText = new Text( itemString, { font: FONT, maxWidth: 150 } );
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
