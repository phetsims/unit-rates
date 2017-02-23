// Copyright 2017, University of Colorado Boulder

/**
 * Displays cost with an optional 3rd decimal place.
 * The specifications from https://github.com/phetsims/unit-rates/issues/44 are:
 *
 * - Third decimal is gray
 * - If cost has fewer than 3 decimals, then 3rd decimal is not displayed
 * - If 3rd decimal is not displayed, it still takes up space, so that cost value doesn't shift around
 * - Cost is truncated (not rounded) to 3 decimals (e.g. $1.2349 becomes $1.234)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );
  var Util = require( 'DOT/Util' );

  // strings
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );

  /**
   * @param {Property.<number>} costProperty
   * @param {Object} [options]
   * @constructor
   */
  function CostNode( costProperty, options ) {

    options = _.extend( {
      extraDecimalVisible: false,
      decimalPlaces: 3, // total decimal places, including the extra decimal place
      font: new URFont( 20 ),
      extraDecimalColor: 'gray'
    }, options );

    Node.call( this );

    // Format cost as a string, including the extra decimal place.
    // String embedding marks because we're going to be chopping up this string using substring.
    var costToString = function( cost ) {
      return StringUtils.stripEmbeddingMarks( URUtil.formatNumber( currencyValueString, cost, options.decimalPlaces, false /* trimZeros */ ) );
    };

    // the primary part of the value, without the extra decimal place
    var primaryNode = new Text( '', {
      font: options.font
    } );
    this.addChild( primaryNode );

    // extra decimal place
    var extraDecimalNode = new Text( '0', {
      font: options.font,
      fill: options.extraDecimalColor
    } );
    if ( options.extraDecimalVisible ) {
      this.addChild( extraDecimalNode );
    }

    var costObserver = function( cost ) {

      assert && assert( cost >= 0, 'negative cost not supported: ' + cost );

      // First truncate to 10 decimal places, in an attempt to remove floating point error.
      // For example, Javascript computes 3 * 0.4 as 1.2000000000000002.
      var powerOfTen = Math.pow( 10, 10 );
      var costTruncatedOnce = Math.floor( cost * powerOfTen ) / powerOfTen;

      // truncate again to the number of decimal places that we're interested in
      powerOfTen = Math.pow( 10, options.decimalPlaces );
      var costTruncatedTwice = Math.floor( costTruncatedOnce * powerOfTen ) / powerOfTen;
      
      // convert to string, then pick it apart
      var costString = costToString( costTruncatedTwice );
      primaryNode.text = costString.substring( 0, costString.length - 1 );
      extraDecimalNode.text = costString.substring( costString.length - 1, costString.length );
      extraDecimalNode.left = primaryNode.right + 1;
      extraDecimalNode.y = primaryNode.y;

      // Hide the extra decimal place if it's not significant
      extraDecimalNode.visible = ( URUtil.decimalPlaces( costTruncatedOnce ) >= options.decimalPlaces );
    };
    costProperty.link( costObserver ); // unlink in dispose

    // @private
    this.disposeCostNode = function() {
      costProperty.unlink( costObserver );
    };

    this.mutate( options );
  }

  unitRates.register( 'CostNode', CostNode );

  return inherit( Node, CostNode, {

    // @public
    dispose: function() {
      this.disposeCostNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );