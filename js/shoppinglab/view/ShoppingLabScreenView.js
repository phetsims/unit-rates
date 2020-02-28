// Copyright 2016-2020, University of Colorado Boulder

/**
 * View for the 'Shopping Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import ShoppingScreenView from '../../shopping/view/ShoppingScreenView.js';
import unitRates from '../../unitRates.js';
import ShoppingLabCategoryNode from './ShoppingLabCategoryNode.js';

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

inherit( ShoppingScreenView, ShoppingLabScreenView );
export default ShoppingLabScreenView;