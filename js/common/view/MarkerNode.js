// Copyright 2016-2020, University of Colorado Boulder

/**
 * Marker on the double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import unitRates from '../../unitRates.js';
import URConstants from '../URConstants.js';
import URFont from '../URFont.js';
import URUtils from '../URUtils.js';

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

  options = merge( {
    ySpacing: 1,
    font: new URFont( 12 ),
    lineLength: URConstants.MAJOR_MARKER_LENGTH,
    lineWidth: 1,
    numeratorOptions: null, // {*} options specific to the rate's numerator, see below
    denominatorOptions: null // {*} options specific to the rate's denominator, see below
  }, options );

  // @public (read-only)
  this.marker = marker;

  const numeratorOptions = merge( {}, SHARED_OPTIONS, options.numeratorOptions );

  const denominatorOptions = merge( {}, SHARED_OPTIONS, options.denominatorOptions );

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

export default inherit( Node, MarkerNode, {

  // @public
  dispose: function() {
    this.disposeMarkerNode();
    Node.prototype.dispose.call( this );
  }
} );