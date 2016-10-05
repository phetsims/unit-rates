// Copyright 2016, University of Colorado Boulder

/**
 * TODO document, https://github.com/phetsims/unit-rates/issues/64
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
  var applesString = require( 'string!UNIT_RATES/apples' );
  var lemonsString = require( 'string!UNIT_RATES/lemons' );
  var orangesString = require( 'string!UNIT_RATES/oranges' );
  var pearsString = require( 'string!UNIT_RATES/pears' );
  var carrotsString = require( 'string!UNIT_RATES/carrots' );
  var cucumbersString = require( 'string!UNIT_RATES/cucumbers' );
  var potatoesString = require( 'string!UNIT_RATES/potatoes' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );
  var blueCandyString = require( 'string!UNIT_RATES/blueCandy' );
  var greenCandyString = require( 'string!UNIT_RATES/greenCandy' );
  var purpleCandyString = require( 'string!UNIT_RATES/purpleCandy' );
  var redCandyString = require( 'string!UNIT_RATES/redCandy' );

  /**
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
        items.push( createItem( applesString, ItemData.APPLES ) );
        items.push( createItem( lemonsString, ItemData.LEMONS ) );
        items.push( createItem( orangesString, ItemData.ORANGES ) );
        items.push( createItem( pearsString, ItemData.PEARS ) );
        break;

      case SceneMode.PRODUCE:
        items.push( createItem( carrotsString, ItemData.CARROTS ) );
        items.push( createItem( cucumbersString, ItemData.CUCUMBERS ) );
        items.push( createItem( potatoesString, ItemData.POTATOES ) );
        items.push( createItem( tomatoesString, ItemData.TOMATOES ) );
        break;

      case SceneMode.CANDY:
        items.push( createItem( purpleCandyString, ItemData.PURPLE_CANDY ) );
        items.push( createItem( redCandyString, ItemData.RED_CANDY ) );
        items.push( createItem( greenCandyString, ItemData.GREEN_CANDY ) );
        items.push( createItem( blueCandyString, ItemData.BLUE_CANDY ) );
        break;

      default:
        assert && assert( false, 'Combo box using unrecognized type' );
    }

    assert && assert( items.length > 0, 'Item list is empty' );

    ComboBox.call( this, items, itemDataProperty, parentNode, options );
  }

  unitRates.register( 'ItemComboBox', ItemComboBox );

  /**
   * Creates an item for the combo box.
   *
   * @param {string} labelString
   * @param {ItemData} itemData
   * @returns {{node: Node, value: *}}
   */
  function createItem( labelString, itemData ) {

    var itemText = new Text( labelString, {
      font: new PhetFont( 18 ),
      maxWidth: 140
    } );
    var itemIcon = ItemNodeFactory.createItemNode( new Item( itemData.type, 1 ) );
    var hStrut = new HStrut( 175 - itemText.width - itemIcon.width );  //TODO magic constant 175

    var itemNode = new HBox( {
      spacing: 0,
      top: 0,
      right: 0,
      align: 'center',
      children: [ itemText, hStrut, itemIcon ]
    } );

    return ComboBox.createItem( itemNode, itemData );
  }

  return inherit( ComboBox, ItemComboBox );

} );
