// Copyright 2017, University of Colorado Boulder

/**
 * View of the shelf, shows the front and top faces.
 * Origin is at the center of the top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Shelf} shelf
   * @param {Object} [options]
   * @constructor
   */
  function ShelfNode( shelf, options ) {

    options = _.extend( {
      fill: 'rgb( 174, 129, 91 )',
      stroke: 'black',
      lineWidth: 1
    }, options );

    // top face, drawn in pseudo-3D using parallel perspective, origin at center
    var topShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( shelf.perspectiveXOffset, -shelf.depth )
      .lineTo( shelf.width - shelf.perspectiveXOffset, -shelf.depth )
      .lineTo( shelf.width, 0 )
      .close();
    var topNode = new Path( topShape, {
      fill: options.fill,
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      lineJoin: 'round',
      center: new Vector2( 0, 0 )
    } );

    // front face
    var frontNode = new Rectangle( 0, 0, shelf.width, shelf.height, {
      fill: options.fill,
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      left: topNode.left,
      top: topNode.bottom - ( options.lineWidth / 2 )
    } );

    // Do not propagate options to supertype, positioning is based on model
    assert && assert( !options.children, 'decoration not supported' );
    Node.call( this, {
      children: [ frontNode, topNode ]
    } );

    // red dot at origin
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
    }

    this.center = shelf.location;
  }

  unitRates.register( 'ShelfNode', ShelfNode );

  return inherit( Node, ShelfNode );
} );
