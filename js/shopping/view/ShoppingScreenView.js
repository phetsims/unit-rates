// Copyright 2016-2019, University of Colorado Boulder

/**
 * View for the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const KeypadLayer = require( 'UNIT_RATES/common/view/KeypadLayer' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const ShoppingCategoryNode = require( 'UNIT_RATES/shopping/view/ShoppingCategoryNode' );
  const ShoppingCategoryRadioButtons = require( 'UNIT_RATES/shopping/view/ShoppingCategoryRadioButtons' );
  const ShoppingViewProperties = require( 'UNIT_RATES/shopping/view/ShoppingViewProperties' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URConstants = require( 'UNIT_RATES/common/URConstants' );

  /**
   * @param {ShoppingModel} model
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingScreenView( model, options ) {

    const self = this;

    options = _.extend( {

      /**
       * Creates a Node for a category.
       * @param {ShoppingCategory} category
       * @param {Property.<ShoppingCategory>} categoryProperty
       * @param {Bounds2} layoutBounds
       * @param {KeypadLayer} keypadLayer
       * @param {ShoppingViewProperties} viewProperties
       * @returns {Node}
       */
      createCategoryNode: function( category, categoryProperty, layoutBounds, keypadLayer, viewProperties ) {
        return new ShoppingCategoryNode( category, categoryProperty, layoutBounds, keypadLayer, viewProperties );
      }
    }, options );

    ScreenView.call( this, options );

    // Properties that are specific to the view
    const viewProperties = new ShoppingViewProperties();

    // parent for everything expect the keypad
    const playAreaLayer = new Node();
    this.addChild( playAreaLayer );

    // separate layer for model keypad
    const keypadLayer = new KeypadLayer();
    this.addChild( keypadLayer );

    // create the view for each category
    const categoryNodes = [];
    model.categories.forEach( function( category ) {
      const categoryNode = options.createCategoryNode( category, model.categoryProperty, self.layoutBounds, keypadLayer, viewProperties );
      categoryNodes.push( categoryNode );
      playAreaLayer.addChild( categoryNode );
    } );

    // Category radio buttons
    const categoryRadioButtons = new ShoppingCategoryRadioButtons( model.categories, model.categoryProperty, {
      left: this.layoutBounds.left + URConstants.SCREEN_X_MARGIN,
      bottom: this.layoutBounds.bottom - ( 2 * URConstants.SCREEN_Y_MARGIN )
    } );
    playAreaLayer.addChild( categoryRadioButtons );

    // Reset All button
    const resetAllButton = new ResetAllButton( {
      listener: function() {
        self.interruptSubtreeInput();
        model.reset();
        viewProperties.reset();
      },
      right: this.layoutBounds.maxX - URConstants.SCREEN_X_MARGIN,
      bottom: this.layoutBounds.maxY - URConstants.SCREEN_Y_MARGIN
    } );
    playAreaLayer.addChild( resetAllButton );
  }

  unitRates.register( 'ShoppingScreenView', ShoppingScreenView );

  return inherit( ScreenView, ShoppingScreenView );
} );

