// Copyright 2016, University of Colorado Boulder

/**
 * View for the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShoppingCategoryRadioButtons = require( 'UNIT_RATES/shoppingNEW/view/ShoppingCategoryRadioButtons' );
  var ShoppingCategoryNode = require( 'UNIT_RATES/shoppingNEW/view/ShoppingCategoryNode' );
  var ShoppingViewProperties = require( 'UNIT_RATES/shoppingNEW/view/ShoppingViewProperties' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingModelNEW} model
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingScreenViewNEW( model, options ) {

    var self = this;

    ScreenView.call( this, options );

    var viewProperties = new ShoppingViewProperties();

    //TODO create on demand to reduce startup time?
    // create the view for each category
    model.categories.forEach( function( category ) {
      self.addChild( new ShoppingCategoryNode( category, model.categoryProperty, self.layoutBounds, viewProperties ) );
    } );

    // Category radio buttons
    var categoryRadioButtons = new ShoppingCategoryRadioButtons( model.categories, model.categoryProperty, {
      right: this.layoutBounds.maxX - 15,
      bottom: this.layoutBounds.maxY - 80
    } );
    this.addChild( categoryRadioButtons );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        viewProperties.reset();
      },
      right: this.layoutBounds.maxX - 15,
      bottom: this.layoutBounds.maxY - 15
    } );
    this.addChild( resetAllButton );
  }

  unitRates.register( 'ShoppingScreenViewNEW', ShoppingScreenViewNEW );

  return inherit( ScreenView, ShoppingScreenViewNEW );
} );

