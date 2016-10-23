// Copyright 2016, University of Colorado Boulder

/**
 * Combo box for selecting shopping items
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Item = require( 'UNIT_RATES/common/shopping/model/Item' );
  var ItemNodeFactory = require( 'UNIT_RATES/common/shopping/view/ItemNodeFactory' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  /**
   * @param {ItemData[]} itemDataArray
   * @param {Property.<ItemData>} itemDataProperty - the currently selected item
   * @param {Node} parentNode - the parent node of the combo box
   * @param {Object} [options]
   * @constructor
   */
  function ItemComboBox( itemDataArray, itemDataProperty, parentNode, options ) {

    options = _.extend( {

      // ItemComboBox options
      iconSize: new Dimension2( 30, 30 ),

      // ComboBox options
      listPosition: 'above',
      buttonCornerRadius: 5,
      listCornerRadius: 5,
      itemXMargin: 0,
      itemYMargin: 5,
      maxWidth: 220

    }, options );

    // describe items in the combo box
    var contentArray = [];
    itemDataArray.forEach( function( itemDatum ) {
      contentArray.push( createItem( itemDatum, options.iconSize ) );
    } );

    ComboBox.call( this, contentArray, itemDataProperty, parentNode, options );
  }

  unitRates.register( 'ItemComboBox', ItemComboBox );

  /**
   * Creates an item for the combo box.
   *
   * @param {ItemData} itemData
   * @param {Dimension2} iconSize
   * @returns {{node: Node, value: *}}
   */
  function createItem( itemData, iconSize ) {

    //TODO because candies don't have pluralName, this is wonky
    var labelString = itemData.pluralName ?  itemData.pluralName : itemData.singularName;

    var itemText = new Text( labelString, {
      font: new PhetFont( 18 ),
      maxWidth: 140
    } );

    var iconNode = ItemNodeFactory.createItemNode( new Item( itemData.type, 1 ) );
    if ( iconNode.width > iconSize.width || iconNode.height > iconSize.height ) {
      var scale = Math.min(  iconSize.width / iconNode.width, iconSize.height / iconNode.height );
      iconNode.setScaleMagnitude( scale );
    }

    var itemIcon = new Node( {
      children: [
        iconNode,
        new HStrut( iconSize.width, { center: iconNode.center } ),
        new VStrut( iconSize.height, { center: iconNode.center } )
      ]
    } );

    var itemNode = new HBox( {
      spacing: 10,
      top: 0,
      right: 0,
      align: 'center',
      children: [ itemIcon, itemText ]
    } );

    return ComboBox.createItem( itemNode, itemData );
  }

  return inherit( ComboBox, ItemComboBox );

} );
