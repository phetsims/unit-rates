// Copyright 2016, University of Colorado Boulder

/**
 * Utility functions that are specific to this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc,)
 */
define( function( require ) {
  'use strict';

  // common modules
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  var URUtil = {

    /**
     * Formats a number, using nearest-neighbor rounding.
     * @param {string} format - the format, which must contain a '{0}' placeholder for the value
     * @param {number} value - the number
     * @param {number} maxDecimals - the maximum number of decimal places
     * @param {boolean} trimZeros - whether to trim trailing zeros from the decimal places
     * @returns {string}
     */
    formatNumber: function( format, value, maxDecimals, trimZeros ) {
      //TODO this assertion fails with stringTest
      // assert && assert( format.indexOf( '{0}' ) !== -1, 'missing {0} in format: ' + format );
      return StringUtils.format( format, URUtil.numberToString( value, maxDecimals, trimZeros ) );
    },

    /**
     * Converts a number to a string, using nearest-neighbor rounding.
     * @param {number} value - the number
     * @param {number} maxDecimals - the maximum number of decimal places
     * @param {boolean} trimZeros - whether to trim trailing zeros from the decimal places
     * @returns {string}
     */
    numberToString: function( value, maxDecimals, trimZeros ) {
      if ( trimZeros ) {
        return Util.toFixedNumber( value, maxDecimals ).toString();
      }
      else {
        return Util.toFixed( value, maxDecimals );
      }
    }
  };

  unitRates.register( 'URUtil', URUtil );

  return URUtil;
} );
