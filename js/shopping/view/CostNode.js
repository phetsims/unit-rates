// Copyright 2017-2019, University of Colorado Boulder

/**
 * Displays cost with an optional 3rd decimal place.
 * The specifications from https://github.com/phetsims/unit-rates/issues/44 are:
 *
 * - Third decimal is gray
 * - If cost has fewer than 3 decimals, then 3rd decimal is not displayed
 * - If 3rd decimal is not displayed, it still takes up space, so that cost value doesn't shift around
 * - Cost is truncated (not rounded) to 3 decimals (e.g. $1.2349 becomes $1.234)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Text = require( 'SCENERY/nodes/Text' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URFont = require( 'UNIT_RATES/common/URFont' );
  const URUtils = require( 'UNIT_RATES/common/URUtils' );
  const Util = require( 'DOT/Util' );

  // strings
  const dollarSignString = require( 'string!UNIT_RATES/dollarSign' );

  /**
   * @param {Property.<number>} costProperty
   * @param {Object} [options]
   * @constructor
   */
  function CostNode( costProperty, options ) {

    options = _.extend( {
      extraDecimalVisible: false, // {boolean} is the extra decimal place visible?
      font: new URFont( 20 ), // {Font} font for all parts of the value
      extraDecimalColor: 'gray' // {Color|string} color of the extra decimal place
    }, options );

    Node.call( this );

    // dollar sign (or other currency symbol)
    // always to the left of the value on the scale, see https://github.com/phetsims/unit-rates/issues/176
    var dollarSignNode = new Text( dollarSignString, {
      font: options.font
    } );
    this.addChild( dollarSignNode );

    // the primary part of the value, without the extra decimal place
    var primaryNode = new Text( '', {
      font: options.font
    } );
    this.addChild( primaryNode );

    // the extra decimal place
    var extraDecimalNode = new Text( '', {
      font: options.font,
      fill: options.extraDecimalColor
    } );
    if ( options.extraDecimalVisible ) {
      this.addChild( extraDecimalNode );
    }

    // When cost changes, update the displayed value
    var costObserver = function( cost ) {

      assert && assert( cost >= 0, 'negative cost not supported: ' + cost );

      var visibleDecimalPlaces = 3;

      // First round to a large number of decimal places, in an attempt to identify floating point error.
      // For example, Javascript computes 3 * 0.4 as 1.2000000000000002.
      // This determines whether the cost has relevant non-zero decimal places,
      // and therefore whether the extra decimal place should be visible.
      // See https://github.com/phetsims/unit-rates/issues/202
      var costRounded = Util.toFixedNumber( cost, 10 );
      extraDecimalNode.visible = ( URUtils.decimalPlaces( costRounded ) >= visibleDecimalPlaces );

      if ( options.extraDecimalVisible && extraDecimalNode.visible ) {

        // Truncate to the number of decimal places that we're interested in.
        // This determines the cost value that is displayed.
        var powerOfTen = Math.pow( 10, visibleDecimalPlaces );
        var costTruncated = Math.floor( cost * powerOfTen ) / powerOfTen;

        // convert to string, then pick it apart
        var costString = URUtils.numberToString( costTruncated, visibleDecimalPlaces, false /* trimZeros */ );
        primaryNode.text = costString.substring( 0, costString.length - 1 );
        extraDecimalNode.text = costString.substring( costString.length - 1, costString.length );
      }
      else {
        primaryNode.text = URUtils.numberToString( cost, 2, false /* trimZeros */ );
        extraDecimalNode.text = '0'; // will be invisible, but needs a valid digit for layout purposes
      }

      // adjust layout
      primaryNode.left = dollarSignNode.right + 1;
      primaryNode.y = dollarSignNode.y;
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