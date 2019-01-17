// Copyright 2016-2017, University of Colorado Boulder

/**
 * Combo box for selecting a scene in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
  var ComboBoxItem = require( 'SUN/ComboBoxItem' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  /**
   * @param {ShoppingScene[]} shoppingScenes
   * @param {Property.<ShoppingScene>} shoppingSceneProperty - the selected scene
   * @param {Node} parentNode - the parent node of the combo box
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingSceneComboBox( shoppingScenes, shoppingSceneProperty, parentNode, options ) {

    assert && assert( shoppingScenes && shoppingScenes.length > 0, 'at least 1 ShoppingScene is required' );

    options = _.extend( {

      // ShoppingSceneComboBox options
      iconSize: new Dimension2( 30, 30 ), // {Dimension2} size of the icons in the combo box

      // ComboBox options
      listPosition: 'above',
      cornerRadius: 5,
      xMargin: 10,
      yMargin: 10,
      maxWidth: 220

    }, options );

    // describe items in the combo box
    var contentArray = [];
    shoppingScenes.forEach( function( shoppingScenes ) {
      contentArray.push( createItem( shoppingScenes, options.iconSize ) );
    } );

    ComboBox.call( this, contentArray, shoppingSceneProperty, parentNode, options );
  }

  unitRates.register( 'ShoppingSceneComboBox', ShoppingSceneComboBox );

  /**
   * Creates an item for the combo box.
   *
   * @param {ShoppingScene} shoppingScene
   * @param {Dimension2} iconSize
   * @returns {ComboBoxItem}
   */
  function createItem( shoppingScene, iconSize ) {

    // Scale the image down if it's larger than iconSize
    var imageNode = new Image( shoppingScene.itemImage );
    if ( imageNode.width > iconSize.width || imageNode.height > iconSize.height ) {
      var scale = Math.min( iconSize.width / imageNode.width, iconSize.height / imageNode.height );
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
    var labelNode = new Text( shoppingScene.pluralName, {
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

    return new ComboBoxItem( itemNode, shoppingScene );
  }

  return inherit( ComboBox, ShoppingSceneComboBox );
} );
