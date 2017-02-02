// Copyright 2017, University of Colorado Boulder

/**
 * The 'Racing Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // sim modules
  var RacingLabModel = require( 'UNIT_RATES/racinglab/model/RacingLabModel' );
  var RacingLabScreenView = require( 'UNIT_RATES/racinglab/view/RacingLabScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/racing_lab_screen_icon.png' );

  // strings
  var screenRacingLabString = require( 'string!UNIT_RATES/screen.racingLab' );

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
