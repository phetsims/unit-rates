// Copyright 2016, University of Colorado Boulder

/**
 * Question of the form 'Cost of {N} pounds?', e.g. 'Cost of 1.3 pounds?'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var costOfNPoundsString = 'cost of {0} pounds?'; //TODO i18n

  /**
   * @param {number} pounds
   * @param {number} costPerPound
   * @constructor
   */
  function CostOfNPoundsQuestion( pounds, costPerPound ) {

    assert && assert( pounds > 0, 'invalid pounds: ' + pounds );
    assert && assert( costPerPound > 0, 'invalid costPerPound: ' + costPerPound );

    // @public (read-only)
    this.questionString = StringUtils.format( costOfNPoundsString, pounds );
    this.answer = pounds * costPerPound; // @public (read-only)
  }

  unitRates.register( 'CostOfNPoundsQuestion', CostOfNPoundsQuestion );

  return inherit( Object, CostOfNPoundsQuestion );
} );
