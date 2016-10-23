// Copyright 2016, University of Colorado Boulder

/**
 * The 'Racing Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RacingLabModel = require( 'UNIT_RATES/racingLab/model/RacingLabModel' );
  var RacingLabScreenView = require( 'UNIT_RATES/racingLab/view/RacingLabScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var screenRacingLabString = require( 'string!UNIT_RATES/screen.racingLab' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/racing_lab_screen_icon.png' );

  /**
   * @constructor
   */
  function RacingLabScreen() {

    var options = {
      name: screenRacingLabString,
      backgroundColor: 'rgb( 233, 242, 254 )',
      homeScreenIcon: new Image( screenIcon )
    };

    Screen.call( this,
      function() { return new RacingLabModel(); },
      function( model ) { return new RacingLabScreenView( model ); },
      options
    );
  }

  unitRates.register( 'RacingLabScreen', RacingLabScreen );

  return inherit( Screen, RacingLabScreen );
} );
