// Copyright 2016-2017, University of Colorado Boulder

/**
 * The fruit scene in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var ShoppingScene = require( 'UNIT_RATES/shopping/model/ShoppingScene' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} itemData - data structure that describes a type of vegetable, see ShoppingItemData
   * @constructor
   */
  function FruitScene( itemData ) {
    ShoppingScene.call( this, itemData, {

      // Fruit bags open when placed on the scale
      bagsOpen: true
    } );
  }

  unitRates.register( 'FruitScene', FruitScene );

  return inherit( ShoppingScene, FruitScene );
} );
