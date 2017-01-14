// Copyright 2017, University of Colorado Boulder

/**
 * View of the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var scaleImage = require( 'image!UNIT_RATES/scale.png' );

  /**
   * @param {Scale} scale
   * @param {Object} [options]
   * @constructor
   */
  function ScaleNode( scale, options ) {

    var scaleImageNode = new Image( scaleImage );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ scaleImageNode ];

    Node.call( this, options );
  }

  unitRates.register( 'ScaleNode', ScaleNode );

  return inherit( Node, ScaleNode );
} );
