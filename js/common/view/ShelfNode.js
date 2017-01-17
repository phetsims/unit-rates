// Copyright 2017, University of Colorado Boulder

/**
 * View of the shelf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Shelf} shelf
   * @param {Object} [options]
   * @constructor
   */
  function ShelfNode( shelf, options ) {

    options = _.extend( {
      size: { width: 356, height: 17, depth: 20 },
      perspectiveXOffset: 25,
      fill: 'rgb( 174, 129, 91 )',
      stroke: 'black'
    }, options );

    // front face
    var frontNode = new Rectangle( 0, 0, options.size.width, options.size.height, {
      fill: options.fill,
      stroke: options.stroke
    } );

    // top face
    var topShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( options.perspectiveXOffset, -options.size.depth )
      .lineTo( options.size.width - options.perspectiveXOffset, -options.size.depth )
      .lineTo( options.size.width, 0 )
      .close();
    var topNode = new Path( topShape, {
      fill: options.fill,
      stroke: options.stroke
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ frontNode, topNode ];

    Node.call( this, options );
  }

  unitRates.register( 'ShelfNode', ShelfNode );

  return inherit( Node, ShelfNode );
} );
