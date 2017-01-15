// Copyright 2017, University of Colorado Boulder

/**
 * View of the shelf.
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
  var shelfImage = require( 'image!UNIT_RATES/shelf.png' );

  /**
   * @param {Shelf} shelf
   * @param {Object} [options]
   * @constructor
   */
  function ShelfNode( shelf, options ) {

    var shelfImageNode = new Image( shelfImage, { scale: 0.5 } ); //TODO redo image file so that scale is not needed

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ shelfImageNode ];

    Node.call( this, options );
  }

  unitRates.register( 'ShelfNode', ShelfNode );

  return inherit( Node, ShelfNode );
} );
