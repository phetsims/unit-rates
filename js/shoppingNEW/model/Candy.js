// Copyright 2016, University of Colorado Boulder

/**
 * A candy item in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ShoppingItem = require( 'UNIT_RATES/shoppingNEW/model/ShoppingItem' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var poundString = require( 'string!UNIT_RATES/pound' );
  var poundsString = require( 'string!UNIT_RATES/pounds' );

  /**
   * @param {Object} itemData - data structure that describes a type of candy, see for example Candy.PURPLE_CANDY
   * @constructor
   */
  function Candy( itemData ) {
    ShoppingItem.call( this, itemData, {

      // Candy questions use 'pound' and 'pounds' for the units, e.g. 'Cost of 2.2 pounds?'
      questionSingularUnits: poundString,
      questionPluralUnits: poundsString,

      // All Candy questions have the same form, i.e. 'Cost of N pounds?'
      uniformQuestions: true
    } );
  }

  unitRates.register( 'Candy', Candy );

  return inherit( ShoppingItem, Candy );
} );
