// Copyright 2016, University of Colorado Boulder

/**
 * Combo box for selecting a ShoppingItem.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );

  /**
   * @param {ShoppingItem[]} shoppingItems
   * @param {Property.<ShoppingItem>} shoppingItemProperty - the currently selected shopping item
   * @param {Node} parentNode - the parent node of the combo box
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItemComboBox( shoppingItems, shoppingItemProperty, parentNode, options ) {

    assert && assert( shoppingItems && shoppingItems.length > 0, 'at least 1 ShoppingItem is required' );

    options = _.extend( {

      // ShoppingItemComboBox options
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
    shoppingItems.forEach( function( shoppingItems ) {
      contentArray.push( createItem( shoppingItems, options.iconSize ) );
    } );

    ComboBox.call( this, contentArray, shoppingItemProperty, parentNode, options );
  }

  unitRates.register( 'ShoppingItemComboBox', ShoppingItemComboBox );

  /**
   * Creates an item for the combo box.
   *
   * @param {ShoppingItem} shoppingItem
   * @param {Dimension2} iconSize
   * @returns {{node: Node, value: *}}
   */
  function createItem( shoppingItem, iconSize ) {

    // Prefer the plural name, if there is one.
    var labelString = shoppingItem.pluralName ?  shoppingItem.pluralName : shoppingItem.singularName;

    var labelNode = new Text( labelString, {
      font: new PhetFont( 18 ),
      maxWidth: 140
    } );

    var imageNode = new Image( shoppingItem.itemImage );
    if ( imageNode.width > iconSize.width || imageNode.height > iconSize.height ) {
      var scale = Math.min(  iconSize.width / imageNode.width, iconSize.height / imageNode.height );
      imageNode.setScaleMagnitude( scale );
    }

    var iconNode = new Node( {
      children: [
        imageNode,
        new HStrut( iconSize.width, { center: imageNode.center } ),
        new VStrut( iconSize.height, { center: imageNode.center } )
      ]
    } );

    var itemNode = new HBox( {
      spacing: 10,
      top: 0,
      right: 0,
      align: 'center',
      children: [ iconNode, labelNode ]
    } );

    return ComboBox.createItem( itemNode, shoppingItem );
  }

  return inherit( ComboBox, ShoppingItemComboBox );
} );