// Copyright 2017-2023, University of Colorado Boulder

/**
 * The vegetable scene in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import unitRates from '../../unitRates.js';
import ShoppingScene from './ShoppingScene.js';

export default class VegetableScene extends ShoppingScene {

  /**
   * @param {Object} itemData - data structure that describes a type of vegetable, see ShoppingItemData
   * @param {Object} [options]
   */
  constructor( itemData, options ) {
    super( itemData, options );
  }
}

unitRates.register( 'VegetableScene', VegetableScene );