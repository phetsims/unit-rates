// Copyright 2016-2017, University of Colorado Boulder

/**
 * View components that are specific to a category of items (e.g. Fruit) in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  // sim modules
  var ShoppingItemComboBox = require( 'UNIT_RATES/shopping/view/ShoppingItemComboBox' );
  var ShoppingItemNode = require( 'UNIT_RATES/shopping/view/ShoppingItemNode' );
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
  function ShoppingCategoryNode( category, categoryProperty, layoutBounds, keypadLayer, viewProperties, options ) {

    var self = this;

    Node.call( this );

    // parent for stuff that's specific to shopping item type, to maintain rendering order
    var shoppingItemNode = null; // created below
    var shoppingItemParent = new Node();
    this.addChild( shoppingItemParent );

    // combo box, for selecting a ShoppingItem
    var comboBox = new ShoppingItemComboBox( category.shoppingItems, category.shoppingItemProperty, this, {
      left: layoutBounds.left + 15,
      bottom: layoutBounds.bottom - 15
    } );
    this.addChild( comboBox );

    this.mutate( options );

    // Show this category when it's selected.
    var categoryObserver = function( newCategory ) {
      self.visible = ( newCategory === category );
    };
    categoryProperty.link( categoryObserver ); // unlink in dispose

    // When the selected item changes, replace the UI elements that are item-specific
    var shoppingItemObserver = function( shoppingItem ) {

      if ( shoppingItemNode ) {
        shoppingItemParent.removeChild( shoppingItemNode );
        shoppingItemNode.dispose();
      }

      shoppingItemNode = new ShoppingItemNode( shoppingItem, layoutBounds, keypadLayer, viewProperties );
      shoppingItemParent.addChild( shoppingItemNode );
    };
    category.shoppingItemProperty.link( shoppingItemObserver ); // unlink in dispose

    this.diposeShoppingCategoryNode = function() {
      categoryProperty.unlink( categoryObserver );
      category.shoppingItemProperty.unlink( shoppingItemObserver );
    };
  }

  unitRates.register( 'ShoppingCategoryNode', ShoppingCategoryNode );

  return inherit( Node, ShoppingCategoryNode, {

    // @public
    dispose: function() {
      Node.prototype.dispose && Node.prototype.dispose.call( this );
      this.diposeShoppingCategoryNode();
    }
  } );
} );
