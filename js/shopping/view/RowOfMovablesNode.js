// Copyright 2017, University of Colorado Boulder

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
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {RowOfMovables} rowOfMovables
   * @param {Object} [options]
   * @constructor
   */
  function RowOfMovablesNode( rowOfMovables, options ) {

    options = _.extend( {
      stroke: 'black'
    }, options );

    var cellWidth = rowOfMovables.cellSize.width;
    var cellHeight = rowOfMovables.cellSize.height;

    // add a rectangle for each cell
    var shape = new Shape();
    rowOfMovables.getCells().forEach( function( cell ) {
      var x = cell.location.x - ( cellWidth / 2 );
      var y = cell.location.y - cellHeight;
      shape.rect( x, y, cellWidth, cellHeight );
    } );

    Path.call( this, shape, options );
  }

  unitRates.register( 'RowOfMovablesNode', RowOfMovablesNode );

  return inherit( Path, RowOfMovablesNode );
} );