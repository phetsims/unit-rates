// Copyright 2016-2017, University of Colorado Boulder

/**
 * View components that are specific to a scene in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BagNode = require( 'UNIT_RATES/shopping/view/BagNode' );
  var DoubleNumberLineAccordionBox = require( 'UNIT_RATES/common/view/DoubleNumberLineAccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  var RowOfMovablesNode = require( 'UNIT_RATES/shopping/view/RowOfMovablesNode' );
  var ScaleNode = require( 'UNIT_RATES/shopping/view/ScaleNode' );
  var ShelfNode = require( 'UNIT_RATES/shopping/view/ShelfNode' );
  var ShoppingItemNode = require( 'UNIT_RATES/shopping/view/ShoppingItemNode' );
  var ShoppingQuestionsAccordionBox = require( 'UNIT_RATES/shopping/view/ShoppingQuestionsAccordionBox' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

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

    // Double number line, dispose required
    var doubleNumberLineAccordionBox = new DoubleNumberLineAccordionBox( shoppingScene.doubleNumberLine, shoppingScene.markerEditor, keypadLayer, {
      axisViewLength: URConstants.SHOPPING_AXIS_LENGTH,
      expandedProperty: viewProperties.doubleNumberLineExpandedProperty,
      left: layoutBounds.minX + URConstants.SCREEN_X_MARGIN,
      top: layoutBounds.minY + URConstants.SCREEN_Y_MARGIN
    } );

    // Questions, dispose required
    var questionsAccordionBox = new ShoppingQuestionsAccordionBox( shoppingScene, keypadLayer, {
      expandedProperty: viewProperties.questionsExpandedProperty,
      right: layoutBounds.right - URConstants.SCREEN_X_MARGIN,
      top: doubleNumberLineAccordionBox.bottom + 10
    } );

    // shelf, dispose required
    var shelfNode = new ShelfNode( shoppingScene.shelf );

    // scale, dispose required
    var scaleNode = new ScaleNode( shoppingScene.scale, {
      costExpandedProperty: viewProperties.scaleCostExpandedProperty,
      extraCostDecimalVisible: false,
      quantityIsDisplayed: shoppingScene.scaleQuantityIsDisplayed
    } );

    // button that resets the shelf to its initial state, dispose required
    var resetShelfButton = new ResetButton( {
      listener: function() {
        //TODO implement resetShelfButton listener, https://github.com/phetsims/unit-rates/issues/156
      },
      baseColor: URColors.resetShelfButton,
      scale: 0.65,
      touchAreaDilation: 5,
      right: scaleNode.left,
      top: scaleNode.bottom + 20
    } );

    // Disable the button when the shelf and scale are in their initial state.
    var quantityObserver = function( quantity ) {
      //TODO disable resetShelfButton, https://github.com/phetsims/unit-rates/issues/156
    };
    shoppingScene.scale.quantityProperty.link( quantityObserver ); // unlink in dispose

    // layers for bags and items
    var dragLayer = new Node(); // all Nodes are in this layer while being dragged
    var bagLayer = new Node();  // the row of bags
    var frontItemLayer = new Node(); // the front row of items
    var backItemLayer = new Node(); // the back row of items

    // bags and items, dispose required
    var bagsOpen = false;
    shoppingScene.bags.forEach( function( bag ) {

      // create the bag's Node, put it in the bag layer
      bagLayer.addChild( new BagNode( bag, shoppingScene.shelf, shoppingScene.scale, bagLayer, dragLayer ) );

      // optional items in the bag
      if ( bag.items ) {
        bagsOpen = true;
        bag.items.forEach( function( item ) {

          // create the item's Node, adds itself to the proper layer
          // eslint-disable-next-line no-unused-vars
          var itemNode = new ShoppingItemNode( item, shoppingScene.shelf, shoppingScene.scale,
            frontItemLayer, backItemLayer, dragLayer );
        } );
      }
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [
      doubleNumberLineAccordionBox, questionsAccordionBox,
      scaleNode, shelfNode, resetShelfButton,
      bagLayer, backItemLayer, frontItemLayer, dragLayer
    ];

    Node.call( this, options );

    if ( URQueryParameters.showCells ) {

      // cells for bags
      this.addChild( new RowOfMovablesNode( shoppingScene.shelf.bagRow, { stroke: 'green' } ) );
      this.addChild( new RowOfMovablesNode( shoppingScene.scale.bagRow, { stroke: 'green' } ) );

      // cells for items
      if ( bagsOpen ) {
        this.addChild( new RowOfMovablesNode( shoppingScene.shelf.backItemRow, { stroke: 'blue' } ) );
        this.addChild( new RowOfMovablesNode( shoppingScene.shelf.frontItemRow, { stroke: 'blue' } ) );
        this.addChild( new RowOfMovablesNode( shoppingScene.scale.backItemRow, { stroke: 'blue' } ) );
        this.addChild( new RowOfMovablesNode( shoppingScene.scale.frontItemRow, { stroke: 'blue' } ) );
      }
    }

    // @private
    this.disposeShoppingSceneNode = function() {

      shoppingScene.scale.quantityProperty.unlink( quantityObserver );

      doubleNumberLineAccordionBox.dispose();
      questionsAccordionBox.dispose();
      shelfNode.dispose();
      scaleNode.dispose();
      resetShelfButton.dispose();

      bagLayer.getChildren().forEach( function( node ) {
        assert && assert( node instanceof BagNode );
        node.dispose();
      } );

      frontItemLayer.getChildren().forEach( function( node ) {
        assert && assert( node instanceof ShoppingItemNode );
        node.dispose();
      } );

      backItemLayer.getChildren().forEach( function( node ) {
        assert && assert( node instanceof ShoppingItemNode );
        node.dispose();
      } );
    };
  }

  unitRates.register( 'ShoppingSceneNode', ShoppingSceneNode );

  return inherit( Node, ShoppingSceneNode, {

    // @public
    dispose: function() {
      this.disposeShoppingSceneNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
