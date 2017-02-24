// Copyright 2017, University of Colorado Boulder

/**
 * Button that restarts a race in the 'Racing Lab' screen.
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
  var restartRaceButtonImage = require( 'image!UNIT_RATES/restart_race_button.png' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RestartRaceButton( options ) {
    RectangularPushButton.call( this, _.extend( {
      content: new Image( restartRaceButtonImage, { scale: 0.5 } ),
      xMargin: 12,
      yMargin: 8,
      touchAreaXDilation: 0,
      touchAreaYDilation: 0
    }, options ) );
  }

  unitRates.register( 'RestartRaceButton', RestartRaceButton );

  return inherit( RectangularPushButton, RestartRaceButton );
} );
