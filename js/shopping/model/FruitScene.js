// Copyright 2017, University of Colorado Boulder

/**
 * The fruit scene in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ShoppingScene = require( 'UNIT_RATES/shopping/model/ShoppingScene' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} itemData - data structure that describes a type of vegetable, see ShoppingItemData
   * @param {Object} [options]
   * @constructor
   */
  function FruitScene( itemData, options ) {

    options = _.extend( {

      // Fruit bags open when placed on the scale
      bagsOpen: true
    }, options );

    ShoppingScene.call( this, itemData, options );
  }

  unitRates.register( 'FruitScene', FruitScene );

  return inherit( ShoppingScene, FruitScene );
} );
