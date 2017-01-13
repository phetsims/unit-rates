// Copyright 2016, University of Colorado Boulder

/**
 * View components that are specific to a type of item (e.g. Apples) in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  // sim modules
  var DoubleNumberLineAccordionBox = require( 'UNIT_RATES/common/view/DoubleNumberLineAccordionBox' );
  var ShoppingQuestionsAccordionBox = require( 'UNIT_RATES/shopping/view/ShoppingQuestionsAccordionBox' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Bounds2} layoutBounds
   * @param {KeypadLayer} keypadLayer
   * @param {ShoppingViewProperties} viewProperties
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItemNode( shoppingItem, layoutBounds, keypadLayer, viewProperties, options ) {

    Node.call( this );

    // Double number line
    var doubleNumberLineAccordionBox = new DoubleNumberLineAccordionBox( shoppingItem.doubleNumberLine, shoppingItem.markerEditor, keypadLayer, {
      expandedProperty: viewProperties.doubleNumberLineExpandedProperty,
      left: layoutBounds.minX + 15,
      top: layoutBounds.minY + 15
    } );
    this.addChild( doubleNumberLineAccordionBox );

    // Questions
    var questionsAccordionBox = new ShoppingQuestionsAccordionBox( shoppingItem, keypadLayer, {
      expandedProperty: viewProperties.questionsExpandedProperty,
      right: layoutBounds.right - 15,
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
      Node.prototype.dispose && Node.prototype.dispose.call( this );
      this.disposeShoppingItemNode();
    }
  } );
} );
