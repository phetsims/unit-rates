// Copyright 2017-2019, University of Colorado Boulder

/**
 * View of the shelf, shows the front and top faces.
 * Origin is at the center of the top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URColors = require( 'UNIT_RATES/common/URColors' );

  /**
   * @param {Shelf} shelf
   * @constructor
   */
  function ShelfNode( shelf ) {

    // shelf.width is the width at the midpoint of the shelf's top face, compute the foreground and background widths
    const foregroundWidth = shelf.width + shelf.perspectiveXOffset;
    const backgroundWidth = shelf.width - shelf.perspectiveXOffset;

    // draw top face clockwise, starting at front-left corner, in pseudo-3D using parallel perspective
    const shelfShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( shelf.perspectiveXOffset, -shelf.depth )
      .lineTo( shelf.perspectiveXOffset + backgroundWidth, -shelf.depth )
      .lineTo( foregroundWidth, 0 );

    // add front face
    shelfShape.rect( 0, 0, shelf.width + shelf.perspectiveXOffset, shelf.height );

    // origin at center of top face
    const shelfNode = new Path( shelfShape, {
      fill: URColors.shelf,
      stroke: 'black',
      lineJoin: 'round',
      x: -foregroundWidth / 2,
      y: shelf.depth / 2
    } );

    // This type does not propagate options to the supertype because the model determines location.
    Node.call( this, {
      children: [ shelfNode ]
    } );

    // red dot at origin
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
      this.addChild( new Line( -shelf.width / 2, 0, shelf.width / 2, 0, { stroke: 'red' } ) );
    }

    // move to model location
    this.translation = shelf.location;
  }

  unitRates.register( 'ShelfNode', ShelfNode );

  return inherit( Node, ShelfNode );
} );
