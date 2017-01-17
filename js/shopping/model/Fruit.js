// Copyright 2017, University of Colorado Boulder

/**
 * A fruit item in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var ShoppingItem = require( 'UNIT_RATES/shopping/model/ShoppingItem' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} itemData - data structure that describes a type of vegetable, see for example Fruit.APPLE
   * @constructor
   */
  function Fruit( itemData ) {
    ShoppingItem.call( this, itemData );
  }

  unitRates.register( 'Fruit', Fruit );

  return inherit( ShoppingItem, Fruit );
} );
