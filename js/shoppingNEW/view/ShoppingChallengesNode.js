// Copyright 2016, University of Colorado Boulder

/**
 * Displays challenges for a ShoppingItem.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );

  // constants
  var CHALLENGE_TEXT_OPTIONS = {
    font: new URFont( 18 )
  };

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingChallengesNode( shoppingItem, options ) {

    options = _.extend( {
      spacing: 25
    }, options );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [];

    //TODO temporary placeholder
    options.children.push( new Text( toCurrency( shoppingItem.unitRate ), CHALLENGE_TEXT_OPTIONS ) );
    shoppingItem.challenges[ 0 ].forEach( function( value ) {
      options.children.push( new Text( toCurrency( value ), CHALLENGE_TEXT_OPTIONS ) );
    } );

    VBox.call( this, options );
  }

  unitRates.register( 'ShoppingChallengesNode', ShoppingChallengesNode );

  /**
   * Converts a number to a currency string.
   * @param {number} value
   * @returns {*|string}
   */
  function toCurrency( value ) {
    return StringUtils.format( currencyValueString, Util.toFixed( value, 2 ) );
  }

  return inherit( VBox, ShoppingChallengesNode );
} );