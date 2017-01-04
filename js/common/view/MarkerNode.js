// Copyright 2016-2017, University of Colorado Boulder

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
   * @param {Marker} marker
   * @param {Object} [options]
   * @constructor
   */
  function MarkerNode( marker, options ) {

    options = _.extend( {

      // VBox options
      spacing: 2,
      align: 'center',

      // MarkerNode options
      color: 'black',
      font: new URFont( 12 ),
      lineLength: 75,
      lineWidth: 1,
      numerationOptions: null, // {*} options specific to the rate's numerator, see below
      denominatorOptions: null // {*} options specific to the rate's denominator, see below

    }, options );

    // @public (read-only)
    this.marker = marker;

    var numeratorOptions = _.extend( {
      maxDecimals: 2, // {number} maximum number of decimal places
      trimZeros: false // {boolean} whether to trim trailing zeros in the decimal places
    }, options.numeratorOptions );

    var denominatorOptions = _.extend( {
      maxDecimals: 2, // {number} maximum number of decimal places
      trimZeros: false // {boolean} whether to trim trailing zeros in the decimal places
    }, options.denominatorOptions );

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
    var numeratorString = URUtil.numberToString( marker.numerator, numeratorOptions.maxDecimals, numeratorOptions.trimZeros );
    var numeratorNode = new Text( numeratorString, textOptions );

    // denominator
    var denominatorString = URUtil.numberToString( marker.denominator, denominatorOptions.maxDecimals, denominatorOptions.trimZeros );
    var denominatorNode = new Text( denominatorString, textOptions );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ numeratorNode, lineNode, denominatorNode ];

    VBox.call( this, options );
  }

  unitRates.register( 'MarkerNode', MarkerNode );

  return inherit( VBox, MarkerNode );
} );
