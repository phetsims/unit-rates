// Copyright 2016, University of Colorado Boulder

/**
 * The 'Racing Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // sim modules
  var OLDRacingLabModel = require( 'UNIT_RATES/old/racingLab/model/OLDRacingLabModel' );
  var OLDRacingLabScreenView = require( 'UNIT_RATES/old/racingLab/view/OLDRacingLabScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/racing_lab_screen_icon.png' );

  // strings
  var screenRacingLabString = require( 'string!UNIT_RATES/screen.racingLab' );

  /**
   * @param {Object} options
   * @constructor
   */
  function OLDRacingLabScreen( options ) {

    options = _.extend( {
      name: screenRacingLabString,
      backgroundColorProperty: new Property( Color.toColor( 'rgb( 233, 242, 254 )' ) ),
      homeScreenIcon: new Image( screenIcon )
    }, options );

    Screen.call( this,
      function() { return new OLDRacingLabModel(); },
      function( model ) { return new OLDRacingLabScreenView( model ); },
      options
    );
  }

  unitRates.register( 'OLDRacingLabScreen', OLDRacingLabScreen );

  return inherit( Screen, OLDRacingLabScreen );
} );
