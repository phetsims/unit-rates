// Copyright 2017-2019, University of Colorado Boulder

/**
 * Button that resets a race in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var resetRaceButton = require( 'image!UNIT_RATES/reset_race_button.png' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ResetRaceButton( options ) {
    RectangularPushButton.call( this, _.extend( {
      content: new Image( resetRaceButton, { scale: 0.5 } ),
      xMargin: 12,
      yMargin: 8
    }, options ) );
  }

  unitRates.register( 'ResetRaceButton', ResetRaceButton );

  return inherit( RectangularPushButton, ResetRaceButton );
} );
