// Copyright 2017, University of Colorado Boulder

/**
 * The vegetable scene in the Shopping screen.
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
  function VegetableScene( itemData ) {
    ShoppingScene.call( this, itemData, {
      bagsOpen: false // vegetable bags do not open when placed on the scale
    } );
  }

  unitRates.register( 'VegetableScene', VegetableScene );

  return inherit( ShoppingScene, VegetableScene );
} );
