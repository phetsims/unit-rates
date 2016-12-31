// Copyright 2016, University of Colorado Boulder

/**
 * Marker on the double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

  /**
   * @param {number} numerator
   * @param {number} denominator
   * @param {Object} [options]
   * @constructor
   */
  function MarkerNode( numerator, denominator, options ) {

    options = _.extend( {

      // VBox options
      spacing: 2,
      align: 'center',

      // numerator & denominator options
      color: 'black',
      font: new URFont( 14 ),
      lineLength: 55,
      lineWidth: 1,

      // numerator
      numeratorFormat: '{0}', // {string} format with '{0}' placeholder for value
      numeratorMaxDecimals: 2, // {number} maximum number of decimal places
      numeratorTrimZeros: false, // {boolean} whether to trim trailing zeros in the decimal places

      // denominator
      denominatorFormat: '{0}', // {string} format with '{0}' placeholder for value
      denominatorMaxDecimals: 2, // {number} maximum number of decimal places
      denominatorTrimZeros: false // {boolean} whether to trim trailing zeros in the decimal places

    }, options );

    // vertical line
    var lineNode = new Line( 0, 0, 0, options.lineLength, {
      stroke: options.color,
      lineWidth: options.lineWidth
    } );

    var textOptions = {
      font: options.font,
      fill: options.color
    };

    // numerator
    var numeratorString = URUtil.formatNumber( options.numeratorFormat, numerator, options.numeratorMaxDecimals, options.numeratorTrimZeros );
    var numeratorNode = new Text( numeratorString, textOptions );

    // denominator
    var denominatorString = URUtil.formatNumber( options.denominatorFormat, denominator, options.denominatorMaxDecimals, options.denominatorTrimZeros );
    var denominatorNode = new Text( denominatorString, textOptions );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ numeratorNode, lineNode, denominatorNode ];

    VBox.call( this, options );
  }

  unitRates.register( 'MarkerNode', MarkerNode );

  return inherit( VBox, MarkerNode );
} );
