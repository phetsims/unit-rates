// Copyright 2016, University of Colorado Boulder

/**
 * The 'edit' button, used to open a keypad in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function EditButton( options ) {

    options = _.extend( {
      baseColor: 'yellow'
    }, options );

    assert && assert( !options.content, 'decoration not supported' );
    options.content = new FontAwesomeNode( 'pencil_square_o' );

    RectangularPushButton.call( this, options );
  }

  unitRates.register( 'EditButton', EditButton );

  return inherit( RectangularPushButton, EditButton );
} );
