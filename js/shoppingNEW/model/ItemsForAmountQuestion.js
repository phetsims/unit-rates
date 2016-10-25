// Copyright 2016, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Util = require( 'DOT/Util' );
  
  // string
  var itemsForAmountString = '{0} for ${1}?';

  /**
   * @param {number} costPerItem
   * @param {number} amount
   * @param {string} pluralItemName
   * @constructor
   */
  function ItemsForAmountQuestion( costPerItem, amount, pluralItemName ) {
    
    // @public (read-only)
    this.questionString = StringUtils.format( itemsForAmountString, pluralItemName, Util.toFixed( amount, 2 ) );
    this.answer = amount / costPerItem; // @public (read-only)
    assert && assert( Util.isInteger( this.answer ), 'fractional answers are not desired' );
  }
  
  unitRates.register( 'ItemsForAmountQuestion', ItemsForAmountQuestion );
  
  return inherit( Object, ItemsForAmountQuestion );
} );
