// Copyright 2017-2019, University of Colorado Boulder

/**
 * The fruit scene in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import unitRates from '../../unitRates.js';
import ShoppingItemData from './ShoppingItemData.js';
import ShoppingScene from './ShoppingScene.js';

/**
 * @param {Object} itemData - data structure that describes a type of vegetable, see ShoppingItemData
 * @param {Object} [options]
 * @constructor
 */
function FruitScene( itemData, options ) {

  assert && assert( _.includes( _.values( ShoppingItemData.Fruit ), itemData ), 'itemData is not a fruit' );

  options = merge( {

    // Fruit bags open when placed on the scale
    bagsOpen: true
  }, options );

  ShoppingScene.call( this, itemData, options );
}

unitRates.register( 'FruitScene', FruitScene );

inherit( ShoppingScene, FruitScene );
export default FruitScene;