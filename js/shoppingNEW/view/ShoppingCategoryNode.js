// Copyright 2016, University of Colorado Boulder

/**
 * View for a category of items in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ShoppingItemComboBox = require( 'UNIT_RATES/shoppingNEW/view/ShoppingItemComboBox' );
  var ShoppingItemNode = require( 'UNIT_RATES/shoppingNEW/view/ShoppingItemNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingCategory} category
   * @param {Property.<ShoppingCategory>} categoryProperty
   * @param {Bounds2} layoutBounds
   * @param {Node} keypadLayer
   * @param {ShoppingViewProperties} viewProperties
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingCategoryNode( category, categoryProperty, layoutBounds, keypadLayer, viewProperties, options ) {

    var self = this;

    Node.call( this );

    // parent for stuff that's specific to shopping item type, to maintain rendering order
    var shoppingItemNode = null; // created below
    var shoppingItemParent = new Node();
    this.addChild( shoppingItemParent );

    // Item combo box
    var comboBox = new ShoppingItemComboBox( category.shoppingItems, category.shoppingItemProperty, this, {
      left: layoutBounds.left + 15,
      bottom: layoutBounds.bottom - 15
    } );
    this.addChild( comboBox );

    this.mutate( options );

    // Show this category when it's selected.
    categoryProperty.link( function( newCategory ) {
      self.visible = ( newCategory === category );
    } );

    category.shoppingItemProperty.link( function( shoppingItem ) {

      if ( shoppingItemNode ) {
        shoppingItemParent.removeChild( shoppingItemNode );
        shoppingItemNode.dispose();
      }

      shoppingItemNode = new ShoppingItemNode( shoppingItem, layoutBounds, keypadLayer, viewProperties );
      shoppingItemParent.addChild( shoppingItemNode );
    } );
  }

  unitRates.register( 'ShoppingCategoryNode', ShoppingCategoryNode );

  return inherit( Node, ShoppingCategoryNode );
} );
