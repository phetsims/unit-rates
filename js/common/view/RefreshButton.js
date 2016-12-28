// Copyright 2016, University of Colorado Boulder

/**
 * The 'refresh' button, used to open a keypad in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RefreshButton( options ) {

    options = _.extend( {
      baseColor: '#f2f2f2'
    }, options );

    assert && assert( !options.content, 'decoration not supported' );
    options.content = new FontAwesomeNode( 'refresh', { scale: 0.5 } );

    RectangularPushButton.call( this, options );
  }

  unitRates.register( 'RefreshButton', RefreshButton );

  return inherit( RectangularPushButton, RefreshButton );
} );
