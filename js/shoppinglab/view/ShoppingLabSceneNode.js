// Copyright 2017, University of Colorado Boulder

/**
 * View components that are specific to a scene in the 'Shopping Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );

  // sim modules
  var BagNode = require( 'UNIT_RATES/shopping/view/BagNode' );
  var DoubleNumberLineAccordionBox = require( 'UNIT_RATES/common/view/DoubleNumberLineAccordionBox' );
  var ScaleNode = require( 'UNIT_RATES/shopping/view/ScaleNode' );
  var ShelfNode = require( 'UNIT_RATES/shopping/view/ShelfNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );

  /**
   * @param {ShoppingScene} shoppingScene
   * @param {Bounds2} layoutBounds
   * @param {KeypadLayer} keypadLayer
   * @param {ShoppingViewProperties} viewProperties
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingLabSceneNode( shoppingScene, layoutBounds, keypadLayer, viewProperties, options ) {

    options = options || {};

    // Double number line
    var doubleNumberLineAccordionBox = new DoubleNumberLineAccordionBox( shoppingScene.doubleNumberLine, shoppingScene.markerEditor, keypadLayer, {
      expandedProperty: viewProperties.doubleNumberLineExpandedProperty,
      left: layoutBounds.minX + 15,
      top: layoutBounds.minY + 15
    } );

    // shelf
    var shelfNode = new ShelfNode( shoppingScene.shelf );

    // scale
    var scaleNode = new ScaleNode( shoppingScene.scale, viewProperties.scaleCostExpandedProperty, {
      costIsCollapsible: shoppingScene.scaleCostIsCollapsible,
      quantityIsDisplayed: shoppingScene.scaleQuantityIsDisplayed
    } );

    // button that resets the shelf to its initial state
    var resetShelfButton = new ResetButton( {
      listener: function() {
        //TODO implement resetShelfButton listener
      },
      baseColor: URColors.resetShelfButton,
      scale: 0.65,
      right: scaleNode.left,
      top: scaleNode.bottom + 20
    } );

    // Disable the button when the shelf and scale are in their initial state.
    shoppingScene.scale.quantityProperty.link( function( quantity ) {
      //TODO https://github.com/phetsims/unit-rates/issues/86
    } );

    // bags
    var bagsParent = new Node();
    shoppingScene.bags.forEach( function( bag ) {
      bagsParent.addChild( new BagNode( bag, shoppingScene.shelf, shoppingScene.scale ) );
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ doubleNumberLineAccordionBox, scaleNode, shelfNode, resetShelfButton, bagsParent ];

    Node.call( this, options );

    // @private
    this.disposeShoppingLabSceneNode = function() {
      doubleNumberLineAccordionBox.dispose();
      scaleNode.dispose();
      shelfNode.dispose();
      resetShelfButton.dispose();
      bagsParent.getChildren().forEach( function( bagNode ) {
        assert && assert( bagNode instanceof BagNode );
        bagNode.dispose();
      } );
    };
  }

  unitRates.register( 'ShoppingLabSceneNode', ShoppingLabSceneNode );

  return inherit( Node, ShoppingLabSceneNode, {

    // @public
    dispose: function() {
      Node.prototype.dispose && Node.prototype.dispose.call( this );
      this.disposeShoppingLabSceneNode();
    }
  } );
} );
