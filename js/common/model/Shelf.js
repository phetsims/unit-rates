// Copyright 2017, University of Colorado Boulder

/**
 * Model of the shelf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  function Shelf() {
    //TODO
  }

  unitRates.register( 'Shelf', Shelf );

  return inherit( Object, Shelf, {

    // @public
    reset: function() {
      //TODO
    }
  });
} );