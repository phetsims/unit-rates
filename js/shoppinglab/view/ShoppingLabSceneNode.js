// Copyright 2017, University of Colorado Boulder

//TODO ShoppingSceneNode and ShoppingLabSceneNode have much in common
/**
 * View components that are specific to a scene in the 'Shopping Lab' screen.
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
  var ScaleNode = require( 'UNIT_RATES/shopping/view/ScaleNode' );
  var ShelfNode = require( 'UNIT_RATES/shopping/view/ShelfNode' );
  var RateAccordionBox = require( 'UNIT_RATES/common/view/RateAccordionBox' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );

  /**
   * @param {ShoppingScene} shoppingScene
   * @param {Bounds2} layoutBounds
   * @param {KeypadLayer} keypadLayer
   * @param {ShoppingViewProperties} viewProperties
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingLabSceneNode( shoppingScene, layoutBounds, keypadLayer, viewProperties, options ) {

    options = options || {};

    // Double number line
    var doubleNumberLineAccordionBox = new DoubleNumberLineAccordionBox( shoppingScene.doubleNumberLine, shoppingScene.markerEditor, keypadLayer, {
      axisViewLength: 816, // determined empirically, to take up the full width of the screen
      expandedProperty: viewProperties.doubleNumberLineExpandedProperty,                  
      left: layoutBounds.minX + URConstants.SCREEN_X_MARGIN,
      top: layoutBounds.minY + URConstants.SCREEN_Y_MARGIN
    } );

    // Rate accordion box
    var rateAccordionBox = new RateAccordionBox( shoppingScene.rate, {
      numeratorRange: URConstants.COST_RANGE,
      denominatorRange: URConstants.QUANTITY_RANGE,
      numeratorUnits: shoppingScene.numeratorOptions.axisLabel,  // matches the axis of the double number line
      numeratorPickerColor: shoppingScene.numeratorOptions.pickerColor,
      denominatorUnits: shoppingScene.denominatorOptions.axisLabel,  // matches the axis of the double number line
      denominatorPickerColor: shoppingScene.denominatorOptions.pickerColor,
      expandedProperty: viewProperties.rateExpandedProperty,
      left: doubleNumberLineAccordionBox.left,
      bottom: layoutBounds.bottom - 100
    } );

    // shelf
    var shelfNode = new ShelfNode( shoppingScene.shelf );

    // scale
    var scaleNode = new ScaleNode( shoppingScene.scale, {
      costExpandedProperty: viewProperties.scaleCostExpandedProperty,
      extraCostDecimalVisible: true,
      quantityIsDisplayed: shoppingScene.scaleQuantityIsDisplayed
    } );

    // button that resets the shelf to its initial state
    var resetShelfButton = new ResetButton( {
      listener: function() {
        //TODO implement resetShelfButton listener, https://github.com/phetsims/unit-rates/issues/156
      },
      baseColor: URColors.resetShelfButton,
      touchAreaDilation: 5,
      scale: 0.65,
      right: scaleNode.left,
      top: scaleNode.bottom + 20
    } );

    // Disable the button when the shelf and scale are in their initial state.
    shoppingScene.scale.quantityProperty.link( function( quantity ) {
      //TODO disable resetShelfButton, https://github.com/phetsims/unit-rates/issues/156
    } );

    // bags
    var bagsParent = new Node();
    shoppingScene.bags.forEach( function( bag ) {
      bagsParent.addChild( new BagNode( bag, shoppingScene.shelf, shoppingScene.scale ) );
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ doubleNumberLineAccordionBox, rateAccordionBox, scaleNode, shelfNode, resetShelfButton, bagsParent ];

    Node.call( this, options );

    // @private
    this.disposeShoppingLabSceneNode = function() {
      doubleNumberLineAccordionBox.dispose();
      scaleNode.dispose();
      shelfNode.dispose();
      resetShelfButton.dispose();
      bagsParent.getChildren().forEach( function( bagNode ) {
        assert && assert( bagNode instanceof BagNode );
        bagNode.dispose();
      } );
    };
  }

  unitRates.register( 'ShoppingLabSceneNode', ShoppingLabSceneNode );

  return inherit( Node, ShoppingLabSceneNode, {

    // @public
    dispose: function() {
      this.disposeShoppingLabSceneNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
