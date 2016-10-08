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
        items.push( createItem( ItemData.APPLES ) );
        items.push( createItem( ItemData.LEMONS ) );
        items.push( createItem( ItemData.ORANGES ) );
        items.push( createItem( ItemData.PEARS ) );
        break;

      case SceneMode.PRODUCE:
        items.push( createItem( ItemData.CARROTS ) );
        items.push( createItem( ItemData.CUCUMBERS ) );
        items.push( createItem( ItemData.POTATOES ) );
        items.push( createItem( ItemData.TOMATOES ) );
        break;

      case SceneMode.CANDY:
        items.push( createItem( ItemData.PURPLE_CANDY ) );
        items.push( createItem( ItemData.RED_CANDY ) );
        items.push( createItem( ItemData.GREEN_CANDY ) );
        items.push( createItem( ItemData.BLUE_CANDY ) );
        break;

      default:
        throw new Error( 'invalid sceneMode: ' + sceneMode );
    }
    assert && assert( items.length > 0 );

    ComboBox.call( this, items, itemDataProperty, parentNode, options );
  }

  unitRates.register( 'ItemComboBox', ItemComboBox );

  /**
   * Creates an item for the combo box.
   *
   * @param {ItemData} itemData
   * @returns {{node: Node, value: *}}
   */
  function createItem( itemData ) {

    //TODO because candies don't have pluralName, this is wonky
    var labelString = itemData.pluralName ?  itemData.pluralName : itemData.singularName;

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
