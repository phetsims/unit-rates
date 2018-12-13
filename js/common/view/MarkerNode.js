// Copyright 2016-2018, University of Colorado Boulder

/**
 * Marker on the double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URUtils = require( 'UNIT_RATES/common/URUtils' );

  // constants
  var SHARED_OPTIONS = {
    maxDecimals: 2, // {number} maximum number of decimal places
    trimZeros: false // {boolean} whether to trim trailing zeros in the decimal places
  };

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
      numeratorOptions: null, // {*} options specific to the rate's numerator, see below
      denominatorOptions: null // {*} options specific to the rate's denominator, see below
    }, options );

    // @public (read-only)
    this.marker = marker;

    var numeratorOptions = _.extend( {}, SHARED_OPTIONS, options.numeratorOptions );

    var denominatorOptions = _.extend( {}, SHARED_OPTIONS, options.denominatorOptions );

    // vertical line
    var lineNode = new Line( 0, 0, 0, options.lineLength, {
      lineWidth: options.lineWidth
    } );

    // numerator
    var numeratorNode = new Text( '', { font: options.font } );
    var numeratorObserver = function( numerator ) {
      assert && assert( ( typeof numerator === 'number' ) && !isNaN( numerator ), 'invalid numerator: ' + numerator );
      numeratorNode.text = URUtils.numberToString( marker.numeratorProperty.value, numeratorOptions.maxDecimals, numeratorOptions.trimZeros );
      numeratorNode.centerX = lineNode.centerX;
      numeratorNode.bottom = lineNode.top - options.ySpacing;
    };
    marker.numeratorProperty.link( numeratorObserver ); // unlink in dispose

    // denominator
    var denominatorNode = new Text( '', { font: options.font } );
    var denominatorObserver = function( denominator ) {
      assert && assert( ( typeof denominator === 'number' ) && !isNaN( denominator ), 'invalid denominator: ' + denominator );
      denominatorNode.text = URUtils.numberToString( marker.denominatorProperty.value, denominatorOptions.maxDecimals, denominatorOptions.trimZeros );
      denominatorNode.centerX = lineNode.centerX;
      denominatorNode.top = lineNode.bottom + options.ySpacing;
    };
    marker.denominatorProperty.link( denominatorObserver ); // unlink in dispose

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
      marker.denominatorProperty.unlink( denominatorObserver );
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
