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
  var ShoppingChallengesNode = require( 'UNIT_RATES/shoppingNEW/view/ShoppingChallengesNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Property.<ShoppingItem>} shoppingItemProperty
   * @param {Bounds2} layoutBounds
   * @param {ShoppingViewProperties} viewProperties
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItemNode( shoppingItem, shoppingItemProperty, layoutBounds, viewProperties, options ) {

    var self = this;

    Node.call( this );

    var challengesNode = new ShoppingChallengesNode( shoppingItem, {
      expandedProperty: viewProperties.challengesExpandedProperty,
      center: layoutBounds.center
    } );
    this.addChild( challengesNode );

    this.mutate( options );

    // Show this item when it's selected.
    shoppingItemProperty.link( function( newShoppingItem ) {
      self.visible = ( newShoppingItem === shoppingItem );
    } );
  }

  unitRates.register( 'ShoppingItemNode', ShoppingItemNode );

  return inherit( Node, ShoppingItemNode );
} );
