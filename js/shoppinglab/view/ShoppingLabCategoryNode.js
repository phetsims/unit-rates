// Copyright 2017, University of Colorado Boulder

/**
 * View components that are specific to a category in the 'Shopping Lab' screen.
 * Since the Shopping Lab only has 1 scene per category, this is simply a parent node that controls visibility of that scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ShoppingLabSceneNode = require( 'UNIT_RATES/shoppinglab/view/ShoppingLabSceneNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

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

    var self = this;

    Node.call( this );

    // parent for stuff that's specific to a scene, to maintain rendering order
    assert && assert( category.shoppingScenes.length === 1, 'Shopping Lab screen supports 1 scene per category' );
    var shoppingSceneNode = new ShoppingLabSceneNode( category.shoppingScenes[ 0 ], layoutBounds, keypadLayer, viewProperties );
    this.addChild( shoppingSceneNode );

    this.mutate( options );

    // Show this category when it's selected.
    var categoryObserver = function( newCategory ) {
      self.visible = ( newCategory === category );
    };
    categoryProperty.link( categoryObserver ); // unlink in dispose

    // @private
    this.diposeShoppingLabCategoryNode = function() {
      categoryProperty.unlink( categoryObserver );
      shoppingSceneNode.dispose();
    };

    // @private used by prototype functions
    this.shoppingSceneNode = shoppingSceneNode;
  }

  unitRates.register( 'ShoppingLabCategoryNode', ShoppingLabCategoryNode );

  return inherit( Node, ShoppingLabCategoryNode, {

    // @public
    dispose: function() {
      this.diposeShoppingLabCategoryNode();
      Node.prototype.dispose.call( this );
    },

    // @public cancels drags that are in progress, see https://github.com/phetsims/unit-rates/issues/168
    cancelDrags: function() {
      this.shoppingSceneNode.cancelDrags();
    }
  } );
} );
