// Copyright 2016, University of Colorado Boulder

/**
 * A vegetable item in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  // sim modules
  var ShoppingItem = require( 'UNIT_RATES/shopping/model/ShoppingItem' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} itemData - data structure that describes a type of Vegetable, see for example Vegetable.CARROTS
   * @constructor
   */
  function Vegetable( itemData ) {
    ShoppingItem.call( this, itemData, {

      // Vegetables questions have 2 forms, e.g. 'Cost of 3 Carrots?' and 'Carrots for $3.00?'
      uniformQuestions: false,

      // Range of bottom axis
      bottomAxisRange: new Range( 0, 16 )
    } );
  }

  unitRates.register( 'Vegetable', Vegetable );

  return inherit( ShoppingItem, Vegetable );
} );
