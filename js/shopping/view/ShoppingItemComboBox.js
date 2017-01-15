// Copyright 2016-2017, University of Colorado Boulder

/**
 * Combo box for selecting a ShoppingItem.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

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

    // Scale the image down if it's larger than iconSize
    var imageNode = new Image( shoppingItem.itemImage );
    if ( imageNode.width > iconSize.width || imageNode.height > iconSize.height ) {
      var scale = Math.min(  iconSize.width / imageNode.width, iconSize.height / imageNode.height );
      imageNode.setScaleMagnitude( scale );
    }

    // Create uniform icon size by centering the image on a transparent rectangle
    var iconNode = new Node( {
      children: [
        imageNode,
        new Rectangle( 0, 0, iconSize.width, iconSize.height, { center: imageNode.center } )
      ]
    } );

    // Use the plural name to label the item
    var labelNode = new Text( shoppingItem.pluralName, {
      font: new URFont( 18 ),
      maxWidth: 140,
      children: [ new HStrut( 140 ) ] // makes labels for all items the same width
    } );

    // icon to the left of label
    var itemNode = new HBox( {
      align: 'center',
      spacing: 10,
      children: [ iconNode, labelNode ]
    } );

    return ComboBox.createItem( itemNode, shoppingItem );
  }

  return inherit( ComboBox, ShoppingItemComboBox );
} );
