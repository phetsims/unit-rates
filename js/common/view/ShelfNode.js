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
  var Shape = require( 'KITE/Shape' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );

  /**
   * @param {Shelf} shelf
   * @constructor
   */
  function ShelfNode( shelf ) {

    // draw top face clockwise, starting at front-left corner, in pseudo-3D using parallel perspective
    var shelfShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( shelf.perspectiveXOffset, -shelf.depth )
      .lineTo( shelf.width - shelf.perspectiveXOffset, -shelf.depth )
      .lineTo( shelf.width, 0 );

    // add front face
    shelfShape.rect( 0, 0, shelf.width, shelf.height );

    // origin at center of top face
    var shelfNode = new Path( shelfShape, {
      fill: URColors.shelf,
      stroke: 'black',
      lineJoin: 'round',
      centerX: 0,
      y: shelf.depth / 2
    } );

    // This type does not propagate options to the supertype because the model determines location.
    Node.call( this, {
      children: [ shelfNode ]
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
