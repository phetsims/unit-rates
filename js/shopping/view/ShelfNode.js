// Copyright 2017-2020, University of Colorado Boulder

/**
 * View of the shelf, shows the front and top faces.
 * Origin is at the center of the top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import URColors from '../../common/URColors.js';
import unitRates from '../../unitRates.js';

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

  // This type does not propagate options to the supertype because the model determines position.
  Node.call( this, {
    children: [ shelfNode ]
  } );

  // red dot at origin
  if ( phet.chipper.queryParameters.dev ) {
    this.addChild( new Circle( 2, { fill: 'red' } ) );
    this.addChild( new Line( -shelf.width / 2, 0, shelf.width / 2, 0, { stroke: 'red' } ) );
  }

  // move to model position
  this.translation = shelf.position;
}

unitRates.register( 'ShelfNode', ShelfNode );

inherit( Node, ShelfNode );
export default ShelfNode;