// Copyright 2017, University of Colorado Boulder

/**
 * Used for debugging purposes to see the cells in each RowOfMovable instance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {RowOfMovables} rowOfMovables
   * @param {Object} [options]
   * @constructor
   */
  function RowOfMovablesNode( rowOfMovables, options ) {

    options = _.extend( {
      stroke: 'black'
    }, options );

    var shape = new Shape();
    var cellWidth = rowOfMovables.cellSize.width;
    var cellHeight = rowOfMovables.cellSize.height;

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