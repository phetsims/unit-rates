// Copyright 2016-2017, University of Colorado Boulder

/**
 * View for the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var KeypadLayer = require( 'UNIT_RATES/common/view/KeypadLayer' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShoppingCategoryRadioButtons = require( 'UNIT_RATES/shopping/view/ShoppingCategoryRadioButtons' );
  var ShoppingCategoryNode = require( 'UNIT_RATES/shopping/view/ShoppingCategoryNode' );
  var ShoppingViewProperties = require( 'UNIT_RATES/shopping/view/ShoppingViewProperties' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );

  /**
   * @param {ShoppingModel} model
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingScreenView( model, options ) {

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

    var self = this;

    ScreenView.call( this, options );

    // Properties that are specific to the view
    var viewProperties = new ShoppingViewProperties();

    // parent for everything expect the keypad
    var playAreaLayer = new Node();
    this.addChild( playAreaLayer );

    // separate layer for model keypad
    var keypadLayer = new KeypadLayer();
    this.addChild( keypadLayer );

    // create the view for each category
    model.categories.forEach( function( category ) {
      var node = options.createCategoryNode( category, model.categoryProperty, self.layoutBounds, keypadLayer, viewProperties );
      playAreaLayer.addChild( node );
    } );

    // Category radio buttons
    var categoryRadioButtons = new ShoppingCategoryRadioButtons( model.categories, model.categoryProperty, {
      left: this.layoutBounds.left + URConstants.SCREEN_X_MARGIN,
      bottom: this.layoutBounds.bottom - URConstants.SCREEN_Y_MARGIN
    } );
    playAreaLayer.addChild( categoryRadioButtons );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
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

