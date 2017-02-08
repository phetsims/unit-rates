// Copyright 2017, University of Colorado Boulder

//TODO flesh out this placeholder
/**
 * Timer in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RaceTimerNode( options ) {

    options = _.extend( {
      cornerRadius: 4,
      stroke: 'black',
      fill: 'white'
    }, options );

    Rectangle.call( this, 0, 0, 100, 20, options );
  }

  unitRates.register( 'RaceTimerNode', RaceTimerNode );

  return inherit( Rectangle, RaceTimerNode );
} );
