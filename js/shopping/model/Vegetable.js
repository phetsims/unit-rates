// Copyright 2017, University of Colorado Boulder

/**
 * A vegetable item in the Shopping screen.
 * Vegetable differs from other item types, as described by the ShoppingItem constructor options.
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
   * @param {Object} itemData - data structure that describes a type of vegetable, see for example Vegetable.CARROT
   * @constructor
   */
  function Vegetable( itemData ) {
    ShoppingItem.call( this, itemData, {
      bagsOpen: false // vegetable bags do not open when placed on the scale
    } );
  }

  unitRates.register( 'Vegetable', Vegetable );

  return inherit( ShoppingItem, Vegetable );
} );
