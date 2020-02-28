// Copyright 2017-2020, University of Colorado Boulder

/**
 * The vegetable scene in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import unitRates from '../../unitRates.js';
import ShoppingItemData from './ShoppingItemData.js';
import ShoppingScene from './ShoppingScene.js';

/**
 * @param {Object} itemData - data structure that describes a type of vegetable, see ShoppingItemData
 * @param {Object} [options]
 * @constructor
 */
function VegetableScene( itemData, options ) {
  assert && assert( _.includes( _.values( ShoppingItemData.Vegetable ), itemData ), 'itemData is not a vegetable' );
  ShoppingScene.call( this, itemData, options );
}

unitRates.register( 'VegetableScene', VegetableScene );

inherit( ShoppingScene, VegetableScene );
export default VegetableScene;