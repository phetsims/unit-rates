// Copyright 2017-2019, University of Colorado Boulder

/**
 * The fruit scene in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  const ShoppingScene = require( 'UNIT_RATES/shopping/model/ShoppingScene' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

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

  return inherit( ShoppingScene, FruitScene );
} );
