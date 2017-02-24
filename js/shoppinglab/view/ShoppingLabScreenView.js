// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Shopping Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ShoppingLabCategoryNode = require( 'UNIT_RATES/shoppinglab/view/ShoppingLabCategoryNode' );
  var ShoppingScreenView = require( 'UNIT_RATES/shopping/view/ShoppingScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingLabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingLabScreenView( model, options ) {

    options = _.extend( {

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

