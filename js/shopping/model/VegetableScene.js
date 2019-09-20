// Copyright 2017-2019, University of Colorado Boulder

/**
 * The vegetable scene in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  const ShoppingScene = require( 'UNIT_RATES/shopping/model/ShoppingScene' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

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

  return inherit( ShoppingScene, VegetableScene );
} );
