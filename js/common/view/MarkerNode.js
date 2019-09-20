// Copyright 2016-2019, University of Colorado Boulder

/**
 * Marker on the double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Text = require( 'SCENERY/nodes/Text' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URConstants = require( 'UNIT_RATES/common/URConstants' );
  const URFont = require( 'UNIT_RATES/common/URFont' );
  const URUtils = require( 'UNIT_RATES/common/URUtils' );

  // constants
  const SHARED_OPTIONS = {
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

    const numeratorOptions = _.extend( {}, SHARED_OPTIONS, options.numeratorOptions );

    const denominatorOptions = _.extend( {}, SHARED_OPTIONS, options.denominatorOptions );

    // vertical line
    const lineNode = new Line( 0, 0, 0, options.lineLength, {
      lineWidth: options.lineWidth
    } );

    // numerator
    const numeratorNode = new Text( '', { font: options.font } );
    const numeratorObserver = function( numerator ) {
      assert && assert( ( typeof numerator === 'number' ) && !isNaN( numerator ), 'invalid numerator: ' + numerator );
      numeratorNode.text = URUtils.numberToString( marker.numeratorProperty.value, numeratorOptions.maxDecimals, numeratorOptions.trimZeros );
      numeratorNode.centerX = lineNode.centerX;
      numeratorNode.bottom = lineNode.top - options.ySpacing;
    };
    marker.numeratorProperty.link( numeratorObserver ); // unlink in dispose

    // denominator
    const denominatorNode = new Text( '', { font: options.font } );
    const denominatorObserver = function( denominator ) {
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
    const colorObserver = function( color ) {
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
