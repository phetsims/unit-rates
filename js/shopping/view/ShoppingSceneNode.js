// Copyright 2016-2017, University of Colorado Boulder

/**
 * View components that are specific to a scene in the 'Shopping' screen.
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
  var ResetShelfButton = require( 'UNIT_RATES/shopping/view/ResetShelfButton' );
  var ScaleNode = require( 'UNIT_RATES/shopping/view/ScaleNode' );
  var ShelfNode = require( 'UNIT_RATES/shopping/view/ShelfNode' );
  var ShoppingQuestionsAccordionBox = require( 'UNIT_RATES/shopping/view/ShoppingQuestionsAccordionBox' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingScene} shoppingScene
   * @param {Bounds2} layoutBounds
   * @param {KeypadLayer} keypadLayer
   * @param {ShoppingViewProperties} viewProperties
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingSceneNode( shoppingScene, layoutBounds, keypadLayer, viewProperties, options ) {

    options = options || {};

    // Double number line
    var doubleNumberLineAccordionBox = new DoubleNumberLineAccordionBox( shoppingScene.doubleNumberLine, shoppingScene.markerEditor, keypadLayer, {
      expandedProperty: viewProperties.doubleNumberLineExpandedProperty,
      left: layoutBounds.minX + 15,
      top: layoutBounds.minY + 15
    } );

    // Questions
    var questionsAccordionBox = new ShoppingQuestionsAccordionBox( shoppingScene, keypadLayer, {
      expandedProperty: viewProperties.questionsExpandedProperty,
      right: layoutBounds.right - 15,
      top: doubleNumberLineAccordionBox.top
    } );

    // shelf
    var shelfNode = new ShelfNode( shoppingScene.shelf );

    // scale
    var scaleNode = new ScaleNode( shoppingScene.scale );

    // button that resets the shelf to its initial state
    var resetShelfButton = new ResetShelfButton( shoppingScene, {
      right: scaleNode.left - 15,
      bottom: scaleNode.bottom
    } );

    // Disable the button when the shelf and scale are in their initial state.
    shoppingScene.scale.quantityProperty.link( function( quantity ) {
      //TODO https://github.com/phetsims/unit-rates/issues/86
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ doubleNumberLineAccordionBox, questionsAccordionBox, scaleNode, shelfNode, resetShelfButton ];

    Node.call( this, options );

    // @private
    this.disposeShoppingSceneNode = function() {
      doubleNumberLineAccordionBox.dispose();
      questionsAccordionBox.dispose();
    };
  }

  unitRates.register( 'ShoppingSceneNode', ShoppingSceneNode );

  return inherit( Node, ShoppingSceneNode, {

    // @public
    dispose: function() {
      Node.prototype.dispose && Node.prototype.dispose.call( this );
      this.disposeShoppingSceneNode();
    }
  } );
} );
