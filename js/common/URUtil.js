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

      // stringTest indiscriminately replaces all strings, with no regard to formatting placeholders.
      if ( !phet.chipper.queryParameters.stringTest ) {
        assert && assert( format.indexOf( '{0}' ) !== -1, 'missing {0} in format: ' + format );
      }
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
    },

    /**
     * Gets the number of decimal places in a number.
     * http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
     * @param {number} num
     * @returns {number}
     */
    decimalPlaces: function( num ) {
      assert && assert( typeof num === 'number', 'invalid argument type' );
      var match = ('' + num).match( /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/ );
      if ( !match ) { return 0; }
      return Math.max( 0,
        // Number of digits right of decimal point.
        (match[ 1 ] ? match[ 1 ].length : 0)
        // Adjust for scientific notation.
        - (match[ 2 ] ? +match[ 2 ] : 0) );
    }
  };

  unitRates.register( 'URUtil', URUtil );

  return URUtil;
} );
