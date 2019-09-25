// Copyright 2017-2019, University of Colorado Boulder

/**
 * View components that are specific to a category in the 'Shopping Lab' screen.
 * Since the Shopping Lab only has 1 scene per category, this is simply a parent node that controls visibility of that scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ShoppingLabSceneNode = require( 'UNIT_RATES/shoppinglab/view/ShoppingLabSceneNode' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingCategory} category
   * @param {Property.<ShoppingCategory>} categoryProperty
   * @param {Bounds2} layoutBounds
   * @param {KeypadLayer} keypadLayer
   * @param {ShoppingViewProperties} viewProperties
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingLabCategoryNode( category, categoryProperty, layoutBounds, keypadLayer, viewProperties, options ) {

    const self = this;

    Node.call( this );

    // parent for stuff that's specific to a scene, to maintain rendering order
    assert && assert( category.shoppingScenes.length === 1, 'Shopping Lab screen supports 1 scene per category' );
    const shoppingSceneNode = new ShoppingLabSceneNode( category.shoppingScenes[ 0 ], layoutBounds, keypadLayer, viewProperties );
    this.addChild( shoppingSceneNode );

    this.mutate( options );

    // Show this category when it's selected.
    const categoryObserver = function( newCategory ) {
      self.visible = ( newCategory === category );
    };
    categoryProperty.link( categoryObserver ); // unlink in dispose

    // @private
    this.disposeShoppingLabCategoryNode = function() {
      categoryProperty.unlink( categoryObserver );
      shoppingSceneNode.dispose();
    };
  }

  unitRates.register( 'ShoppingLabCategoryNode', ShoppingLabCategoryNode );

  return inherit( Node, ShoppingLabCategoryNode, {

    // @public
    dispose: function() {
      this.disposeShoppingLabCategoryNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
