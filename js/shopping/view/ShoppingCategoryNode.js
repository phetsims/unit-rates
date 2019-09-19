// Copyright 2016-2019, University of Colorado Boulder

/**
 * View components that are specific to a category in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ShoppingSceneComboBox = require( 'UNIT_RATES/shopping/view/ShoppingSceneComboBox' );
  const ShoppingSceneNode = require( 'UNIT_RATES/shopping/view/ShoppingSceneNode' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URConstants = require( 'UNIT_RATES/common/URConstants' );

  /**
   * @param {ShoppingCategory} category
   * @param {Property.<ShoppingCategory>} categoryProperty
   * @param {Bounds2} layoutBounds
   * @param {KeypadLayer} keypadLayer
   * @param {ShoppingViewProperties} viewProperties
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingCategoryNode( category, categoryProperty, layoutBounds, keypadLayer, viewProperties, options ) {

    var self = this;

    Node.call( this );

    // parent for stuff that's specific to a scene, to maintain rendering order
    var shoppingSceneNode = null; // created below
    var shoppingSceneParent = new Node();
    this.addChild( shoppingSceneParent );

    // combo box, for selecting a scene, dispose required
    var comboBox = new ShoppingSceneComboBox( category.shoppingScenes, category.shoppingSceneProperty, this, {
      left: layoutBounds.left + URConstants.SCREEN_X_MARGIN,
      bottom: layoutBounds.bottom - 80
    } );
    this.addChild( comboBox );

    this.mutate( options );

    // Show this category when it's selected.
    var categoryObserver = function( newCategory ) {
      self.visible = ( newCategory === category );
    };
    categoryProperty.link( categoryObserver ); // unlink in dispose

    // When the selected scene changes, replace the UI elements that are item-specific
    var shoppingSceneObserver = function( shoppingScene ) {

      // remove the old scene
      if ( shoppingSceneNode ) {
        shoppingSceneNode.interruptSubtreeInput(); // cancel drags that are in progress
        shoppingSceneParent.removeChild( shoppingSceneNode );
        shoppingSceneNode.dispose();
      }

      // add the new scene
      shoppingSceneNode = new ShoppingSceneNode( shoppingScene, layoutBounds, keypadLayer, viewProperties );
      shoppingSceneParent.addChild( shoppingSceneNode );
    };
    category.shoppingSceneProperty.link( shoppingSceneObserver ); // unlink in dispose

    // @private
    this.disposeShoppingCategoryNode = function() {
      comboBox.dispose();
      categoryProperty.unlink( categoryObserver );
      category.shoppingSceneProperty.unlink( shoppingSceneObserver );
      shoppingSceneNode.dispose();
    };
  }

  unitRates.register( 'ShoppingCategoryNode', ShoppingCategoryNode );

  return inherit( Node, ShoppingCategoryNode, {

    // @public
    dispose: function() {
      this.disposeShoppingCategoryNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
