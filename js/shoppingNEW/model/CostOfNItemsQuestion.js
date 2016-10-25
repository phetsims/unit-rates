// Copyright 2016, University of Colorado Boulder

/**
 * Question of the form 'Cost of {N} {ItemName}?', e.g. 'Cost of 15 Apples?'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Util = require( 'DOT/Util' );

  // strings
  var costOfNItemsString = 'cost of {0} {1}?'; //TODO i18n

  /**
   * @param {number} numberOfItems
   * @param {number} costPerItem
   * @param {string} singularItemName
   * @param {string} pluralItemName
   * @constructor
   */
  function CostOfNItemsQuestion( numberOfItems, costPerItem, singularItemName, pluralItemName ) {
    
    assert && assert( numberOfItems > 0 && Util.isInteger( numberOfItems ), 'invalid numberOfItems: ' + numberOfItems );
    assert && assert( costPerItem > 0, 'invalid costPerItem: ' + costPerItem );

    // @public (read-only)
    this.questionString = StringUtils.format( costOfNItemsString, numberOfItems, numberOfItems === 1 ? singularItemName : pluralItemName );
    this.answer = numberOfItems * costPerItem;
  }

  unitRates.register( 'CostOfNItemsQuestion', CostOfNItemsQuestion );

  return inherit( Object, CostOfNItemsQuestion );
} );
