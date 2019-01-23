// Copyright 2016-2019, University of Colorado Boulder

/**
 * Combo box for selecting a scene in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URFont = require( 'UNIT_RATES/common/URFont' );

  class ShoppingSceneComboBox extends ComboBox {
    /**
     * @param {ShoppingScene[]} shoppingScenes
     * @param {Property.<ShoppingScene>} shoppingSceneProperty - the selected scene
     * @param {Node} parentNode - the parent node of the combo box
     * @param {Object} [options]
     * @constructor
     */
    constructor( shoppingScenes, shoppingSceneProperty, parentNode, options ) {

      assert && assert( shoppingScenes && shoppingScenes.length > 0, 'at least 1 ShoppingScene is required' );

      options = _.extend( {

        // ShoppingSceneComboBox options
        iconSize: new Dimension2( 30, 30 ), // {Dimension2} size of the icons in the combo box

        // ComboBox options
        listPosition: 'above',
        cornerRadius: 5,
        xMargin: 10,
        yMargin: 10

      }, options );

      // {ComboBoxItem[]}
      const items = shoppingScenes.map( shoppingScene => createItem( shoppingScene, options.iconSize ) );

      super( items, shoppingSceneProperty, parentNode, options );
    }
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
    const imageNode = new Image( shoppingScene.itemImage );
    if ( imageNode.width > iconSize.width || imageNode.height > iconSize.height ) {
      const scale = Math.min( iconSize.width / imageNode.width, iconSize.height / imageNode.height );
      imageNode.setScaleMagnitude( scale );
    }

    // Create uniform icon size by centering the image on a transparent rectangle
    const iconNode = new Node( {
      children: [
        imageNode,
        new Rectangle( 0, 0, iconSize.width, iconSize.height, { center: imageNode.center } )
      ]
    } );

    // Use the plural name to label the item
    const labelNode = new Text( shoppingScene.pluralName, {
      font: new URFont( 18 ),
      maxWidth: 140,
      children: [ new HStrut( 140 ) ] // makes labels for all items the same width
    } );

    // icon to the left of label
    const itemNode = new HBox( {
      align: 'center',
      spacing: 10,
      children: [ iconNode, labelNode ]
    } );

    return new ComboBoxItem( itemNode, shoppingScene );
  }

  return ShoppingSceneComboBox;
} );
