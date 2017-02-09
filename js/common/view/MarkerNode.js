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
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

  /**
   * @param {Marker} marker
   * @param {Object} [options]
   * @constructor
   */
  function MarkerNode( marker, options ) {

    options = _.extend( {
      ySpacing: 1,
      font: new URFont( 12 ),
      lineLength: URConstants.MAJOR_MARKER_LENGTH,
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
      lineWidth: options.lineWidth
    } );

    // numerator, which will be updated if the unit rate changes
    var numeratorNode = new Text( '', { font: options.font } );
    var numeratorObserver = function( numerator ) {
      assert && assert( ( typeof numerator === 'number') && !isNaN( numerator ), 'invalid numerator: ' + numerator );
      numeratorNode.text = URUtil.numberToString( marker.numeratorProperty.value, numeratorOptions.maxDecimals, numeratorOptions.trimZeros );
      numeratorNode.centerX = lineNode.centerX;
      numeratorNode.bottom = lineNode.top - options.ySpacing;
    };
    marker.numeratorProperty.link( numeratorObserver ); // unlink in dispose

    // denominator
    var denominatorString = URUtil.numberToString( marker.denominator, denominatorOptions.maxDecimals, denominatorOptions.trimZeros );
    var denominatorNode = new Text( denominatorString, {
      font: options.font,
      centerX: lineNode.centerX,
      top: lineNode.bottom + options.ySpacing
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ numeratorNode, lineNode, denominatorNode ];

    Node.call( this, options );

    // update the marker's color
    var colorObserver = function( color ) {
      lineNode.stroke = color;
      numeratorNode.fill = color;
      denominatorNode.fill = color;
    };
    marker.colorProperty.link( colorObserver ); // unlink in dispose

    // @private
    this.disposeMarkerNode = function() {
      marker.numeratorProperty.unlink( numeratorObserver );
      marker.colorProperty.unlink( colorObserver );
    };
  }

  unitRates.register( 'MarkerNode', MarkerNode );

  return inherit( Node, MarkerNode, {

    // @public
    dispose: function() {
      this.disposeMarkerNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
