// Copyright 2017-2020, University of Colorado Boulder

/**
 * Used for debugging purposes to see the cells in each RowOfMovable instance.
 * See URQueryParameters.showCells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {RowOfMovables} rowOfMovables
   * @param {Object} [options]
   * @constructor
   */
  function RowOfMovablesNode( rowOfMovables, options ) {

    options = merge( {
      stroke: 'black'
    }, options );

    const cellWidth = rowOfMovables.cellSize.width;
    const cellHeight = rowOfMovables.cellSize.height;

    // add a rectangle for each cell
    const shape = new Shape();
    rowOfMovables.getCells().forEach( function( cell ) {
      const x = cell.position.x - ( cellWidth / 2 );
      const y = cell.position.y - cellHeight;
      shape.rect( x, y, cellWidth, cellHeight );
    } );

    Path.call( this, shape, options );
  }

  unitRates.register( 'RowOfMovablesNode', RowOfMovablesNode );

  return inherit( Path, RowOfMovablesNode );
} );