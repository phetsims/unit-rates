// Copyright 2016-2019, University of Colorado Boulder

/**
 * View for the 'Shopping Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const ShoppingLabCategoryNode = require( 'UNIT_RATES/shoppinglab/view/ShoppingLabCategoryNode' );
  const ShoppingScreenView = require( 'UNIT_RATES/shopping/view/ShoppingScreenView' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingLabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingLabScreenView( model, options ) {

    options = merge( {

      // Creates a Node for a category. See ShoppingScreenView options.createCategoryNode
      createCategoryNode: function( category, categoryProperty, layoutBounds, keypadLayer, viewProperties ) {
        return new ShoppingLabCategoryNode( category, categoryProperty, layoutBounds, keypadLayer, viewProperties );
      }
    }, options );

    ShoppingScreenView.call( this, model, options );
  }

  unitRates.register( 'ShoppingLabScreenView', ShoppingLabScreenView );

  return inherit( ShoppingScreenView, ShoppingLabScreenView );
} );

