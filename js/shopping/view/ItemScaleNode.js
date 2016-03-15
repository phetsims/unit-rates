// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // constants
  var BACK_DEPTH = 20;
  var BACK_OFFSET = 0.15;
  var SHELF_SIZE = new Dimension2( 240, 50 );

  /**
   * FIXME: Draw or image?w
   *
   * @param {Object} [options]
   * @constructor
   */
  function ItemScaleNode( model, options ) {

    options = options || {};

    // front & top face
    var scaleNode = new Path( new Shape()
      .moveTo( 0, 0 )                                                  // Top face
      .lineTo( SHELF_SIZE.width, 0)
      .lineTo( ( 1 - BACK_OFFSET ) * SHELF_SIZE.width, -BACK_DEPTH )
      .lineTo( BACK_OFFSET * SHELF_SIZE.width, -BACK_DEPTH )
      .lineTo( 0, 0 )                                                  // Front face
      .lineTo( 0, SHELF_SIZE.height )
      .lineTo( SHELF_SIZE.width, SHELF_SIZE.height)
      .lineTo( SHELF_SIZE.width, 0), {
      fill: 'rgb(85,106,115)',
      stroke: 'black',
      lineWidth: 1
    } );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ scaleNode ];

    Node.call( this, options );
  }

  unitRates.register( 'ItemScaleNode', ItemScaleNode );

  return inherit( Node, ItemScaleNode );

} ); // define

