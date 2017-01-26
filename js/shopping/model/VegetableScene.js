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
   * @param {Object} [options]
   * @constructor
   */
  function VegetableScene( itemData, options ) {
    ShoppingScene.call( this, itemData, options );
  }

  unitRates.register( 'VegetableScene', VegetableScene );

  return inherit( ShoppingScene, VegetableScene );
} );
