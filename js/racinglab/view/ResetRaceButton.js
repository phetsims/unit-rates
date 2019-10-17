// Copyright 2017-2019, University of Colorado Boulder

/**
 * Button that resets a race in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  const resetRaceButton = require( 'image!UNIT_RATES/reset_race_button.png' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ResetRaceButton( options ) {
    RectangularPushButton.call( this, merge( {
      content: new Image( resetRaceButton, { scale: 0.5 } ),
      xMargin: 12,
      yMargin: 8
    }, options ) );
  }

  unitRates.register( 'ResetRaceButton', ResetRaceButton );

  return inherit( RectangularPushButton, ResetRaceButton );
} );
