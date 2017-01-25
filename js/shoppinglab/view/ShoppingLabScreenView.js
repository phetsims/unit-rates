// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Shopping Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // sim modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

  // common modules
  var KeypadLayer = require( 'UNIT_RATES/common/view/KeypadLayer' );
  var ShoppingCategoryRadioButtons = require( 'UNIT_RATES/shopping/view/ShoppingCategoryRadioButtons' );
  var ShoppingLabCategoryNode = require( 'UNIT_RATES/shoppinglab/view/ShoppingLabCategoryNode' );
  var ShoppingViewProperties = require( 'UNIT_RATES/shopping/view/ShoppingViewProperties' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingLabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingLabScreenView( model, options ) {

    var self = this;

    ScreenView.call( this, options );

    var viewProperties = new ShoppingViewProperties();

    var playAreaLayer = new Node();
    this.addChild( playAreaLayer );

    var keypadLayer = new KeypadLayer();
    this.addChild( keypadLayer );

    // create the view for each category
    model.categories.forEach( function( category ) {
      playAreaLayer.addChild( new ShoppingLabCategoryNode( category, model.categoryProperty, self.layoutBounds, keypadLayer, viewProperties ) );
    } );

    // Category radio buttons
    var categoryRadioButtons = new ShoppingCategoryRadioButtons( model.categories, model.categoryProperty, {
      left: this.layoutBounds.left + 15,
      bottom: this.layoutBounds.bottom - 15
    } );
    playAreaLayer.addChild( categoryRadioButtons );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        viewProperties.reset();
      },
      right: this.layoutBounds.maxX - 15,
      bottom: this.layoutBounds.maxY - 15
    } );
    playAreaLayer.addChild( resetAllButton );
  }

  unitRates.register( 'ShoppingLabScreenView', ShoppingLabScreenView );

  return inherit( ScreenView, ShoppingLabScreenView );
} );

