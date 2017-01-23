// Copyright 2017, University of Colorado Boulder

//TODO this is untested brainstorming code
/**
 * 
 * Items on the shelf and scale are stacked in a pyramid shape, like this:
 *
 *       X
 *      X X
 *     X X X
 *    X X X X
 *   X X X X X
 *   
 * This type manages where items are in the pyramid, which 'cells' are occupied vs free,
 * which cell is closest to a specified point, etc.  
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  
  function PyramidLayout( options ) {

    options = _.extend( {
      centerX: 0, // {number} x coordinate of the center of the pyramid's base
      numberOfBags: 4,
      bagWidth: 70,
      itemsPerBag: 4,
      itemSize: new Dimension2( 60, 60 ),
      bagSpacing: 8 // {number} horizontal space between bags
    }, options );
  }
  
  unitRates.register( 'PyramidLayout', PyramidLayout );

  return inherit( Object, PyramidLayout, {
    //TODO prototype functions
  } );
} );
