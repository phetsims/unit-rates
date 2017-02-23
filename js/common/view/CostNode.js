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

      var maxDecimalPlaces = 10; // the number of decimal places that we'll keep in cost

      assert && assert( cost >= 0, 'negative cost not supported: ' + cost );
      assert && assert( options.decimalPlaces < maxDecimalPlaces,
        'decimalPlaces must be < maxDecimalPlaces: ' + options.decimalPlaces );

      // First truncate to maxDecimalPlaces, in an attempt to remove floating point error.
      // For example, Javascript computes 3 * 0.4 as 1.2000000000000002.
      // This determines whether the cost has relevant non-zero decimal places,
      // and therefore whether the extra decimal place should be visible.
      var powerOfTen = Math.pow( 10, maxDecimalPlaces );
      var costTruncated = Math.floor( cost * powerOfTen ) / powerOfTen;
      extraDecimalNode.visible = ( URUtil.decimalPlaces( costTruncated ) >= options.decimalPlaces );

      // Now truncate to the number of decimal places that we're interested in.
      // This determines the cost value that is displayed.
      powerOfTen = Math.pow( 10, options.decimalPlaces );
      costTruncated = Math.floor( cost * powerOfTen ) / powerOfTen;
      
      // convert to string, then pick it apart
      var costString = costToString( costTruncated );
      primaryNode.text = costString.substring( 0, costString.length - 1 );
      extraDecimalNode.text = costString.substring( costString.length - 1, costString.length );
      extraDecimalNode.left = primaryNode.right + 1;
      extraDecimalNode.y = primaryNode.y;


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
