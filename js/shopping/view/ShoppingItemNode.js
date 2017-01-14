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
  var ClearScaleButton = require( 'UNIT_RATES/common/view/ClearScaleButton' );
  var DoubleNumberLineAccordionBox = require( 'UNIT_RATES/common/view/DoubleNumberLineAccordionBox' );
  var ScaleNode = require( 'UNIT_RATES/common/view/ScaleNode' );
  var ShelfNode = require( 'UNIT_RATES/common/view/ShelfNode' );
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

    options = options || {};

    // Double number line
    var doubleNumberLineAccordionBox = new DoubleNumberLineAccordionBox( shoppingItem.doubleNumberLine, shoppingItem.markerEditor, keypadLayer, {
      expandedProperty: viewProperties.doubleNumberLineExpandedProperty,
      left: layoutBounds.minX + 15,
      top: layoutBounds.minY + 15
    } );

    // Questions
    var questionsAccordionBox = new ShoppingQuestionsAccordionBox( shoppingItem, keypadLayer, {
      expandedProperty: viewProperties.questionsExpandedProperty,
      right: layoutBounds.right - 15,
      top: doubleNumberLineAccordionBox.top
    } );

    // shelf
    var shelfNode = new ShelfNode( shoppingItem.shelf, {
      centerX: layoutBounds.left + ( 0.5 * layoutBounds.width ),
      bottom: layoutBounds.bottom - 15
    } );

    // scale
    var scaleNode = new ScaleNode( shoppingItem.scale, {
      centerX: shelfNode.centerX,
      bottom: shelfNode.top - 75
    } );

    // button that clears the scale
    var clearScaleButton = new ClearScaleButton( shoppingItem.scale, {
      right: scaleNode.left - 15,
      bottom: scaleNode.bottom
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ doubleNumberLineAccordionBox, questionsAccordionBox, scaleNode, shelfNode, clearScaleButton ];

    Node.call( this, options );

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
