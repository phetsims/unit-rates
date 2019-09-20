// Copyright 2016-2019, University of Colorado Boulder

/**
 * The 'Racing Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const RacingLabModel = require( 'UNIT_RATES/racinglab/model/RacingLabModel' );
  const RacingLabScreenView = require( 'UNIT_RATES/racinglab/view/RacingLabScreenView' );
  const Screen = require( 'JOIST/Screen' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URColors = require( 'UNIT_RATES/common/URColors' );

  // images
  const screenIcon = require( 'image!UNIT_RATES/racing_lab_screen_icon.png' );

  // strings
  const screenRacingLabString = require( 'string!UNIT_RATES/screen.racingLab' );

  /**
   * @param {Object} options
   * @constructor
   */
  function RacingLabScreen( options ) {

    options = _.extend( {
      name: screenRacingLabString,
      backgroundColorProperty: new Property( URColors.racingLabScreenBackground ),
      homeScreenIcon: new Image( screenIcon )
    }, options );

    Screen.call( this,
      function() { return new RacingLabModel(); },
      function( model ) { return new RacingLabScreenView( model ); },
      options
    );
  }

  unitRates.register( 'RacingLabScreen', RacingLabScreen );

  return inherit( Screen, RacingLabScreen );
} );
