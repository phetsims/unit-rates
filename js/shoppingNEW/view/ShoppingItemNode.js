// Copyright 2016, University of Colorado Boulder

/**
 * View for a ShoppingItem and its related components (including a shelf, scale, double number line and challenges).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Property.<ShoppingItem>} shoppingItemProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItemNode( shoppingItem, shoppingItemProperty, layoutBounds, options ) {

    var self = this;

    Node.call( this );

    //TODO temporary
    var nameNode = new Text( shoppingItem.pluralName || shoppingItem.singularName, {
      font: new URFont( 24 ),
      center: layoutBounds.center
    } );
    this.addChild( nameNode );

    this.mutate( options );

    // Show this item when it's selected.
    shoppingItemProperty.link( function( newShoppingItem ) {
      self.visible = ( newShoppingItem === shoppingItem );
    } );
  }

  unitRates.register( 'ShoppingItemNode', ShoppingItemNode );

  return inherit( Node, ShoppingItemNode );
} );
