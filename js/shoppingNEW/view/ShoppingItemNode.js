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
   * @param {Bounds2} layoutBounds
   * @param {Node} keypadLayer
   * @param {ShoppingViewProperties} viewProperties
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItemNode( shoppingItem, layoutBounds, keypadLayer, viewProperties, options ) {

    Node.call( this );

    var doubleNumberLineAccordionBox = new DoubleNumberLineAccordionBox( shoppingItem, {
      expandedProperty: viewProperties.doubleNumberLineExpandedProperty,
      left: layoutBounds.minX + 15,
      top: layoutBounds.minY + 15
    } );
    this.addChild( doubleNumberLineAccordionBox );

    var questionsAccordionBox = new ShoppingQuestionsAccordionBox( shoppingItem, keypadLayer, {
      expandedProperty: viewProperties.questionsExpandedProperty,
      left: doubleNumberLineAccordionBox.right + 10,
      top: doubleNumberLineAccordionBox.top
    } );
    this.addChild( questionsAccordionBox );

    this.mutate( options );

    // @private
    this.disposeShoppingItemNode = function() {
      doubleNumberLineAccordionBox.dispose();
      questionsAccordionBox.dispose();
    };
  }

  unitRates.register( 'ShoppingItemNode', ShoppingItemNode );

  return inherit( Node, ShoppingItemNode, {

    // @public
    dispose: function() {
      console.log( 'ShoppingItemNode.dispose' );//XXX
      this.disposeShoppingItemNode();
    }
  } );
} );
