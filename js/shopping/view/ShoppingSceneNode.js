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
  var ClearScaleButton = require( 'UNIT_RATES/common/view/ClearScaleButton' );
  var DoubleNumberLineAccordionBox = require( 'UNIT_RATES/common/view/DoubleNumberLineAccordionBox' );
  var ScaleNode = require( 'UNIT_RATES/common/view/ScaleNode' );
  var ShelfNode = require( 'UNIT_RATES/common/view/ShelfNode' );
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

    // button that clears the scale
    var clearScaleButton = new ClearScaleButton( shoppingScene.scale, {
      right: scaleNode.left - 15,
      bottom: scaleNode.bottom
    } );

    // Disable the button when there's nothing on the scale.
    shoppingScene.scale.quantityProperty.link( function( quantity ) {
      clearScaleButton.enabled = ( quantity > 0 );
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ doubleNumberLineAccordionBox, questionsAccordionBox, scaleNode, shelfNode, clearScaleButton ];

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
