// Copyright 2016, University of Colorado Boulder

/**
 * View for a ShoppingItem and its related components (including a shelf, scale, double number line and challenges).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DoubleNumberLineAccordionBox = require( 'UNIT_RATES/shoppingNEW/view/DoubleNumberLineAccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ShoppingQuestionsAccordionBox = require( 'UNIT_RATES/shoppingNEW/view/ShoppingQuestionsAccordionBox' );
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

    var doubleNumberLineAccordionBox = new DoubleNumberLineAccordionBox( shoppingItem, {
      expandedProperty: viewProperties.doubleNumberLineExpandedProperty,
      left: layoutBounds.minX + 15,
      top: layoutBounds.minY + 15
    } );
    this.addChild( doubleNumberLineAccordionBox );

    var questionsAccordionBox = new ShoppingQuestionsAccordionBox( shoppingItem, {
      expandedProperty: viewProperties.challengesExpandedProperty,
      left: doubleNumberLineAccordionBox.right + 20,
      top: doubleNumberLineAccordionBox.top
    } );
    this.addChild( questionsAccordionBox );

    this.mutate( options );

    // Show this item when it's selected.
    shoppingItemProperty.link( function( newShoppingItem ) {
      self.visible = ( newShoppingItem === shoppingItem );
    } );
  }

  unitRates.register( 'ShoppingItemNode', ShoppingItemNode );

  return inherit( Node, ShoppingItemNode );
} );
