// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LabModel = require( 'UNIT_RATES/lab/model/LabModel' );
  var LabScreenView = require( 'UNIT_RATES/lab/view/LabScreenView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var labString = require( 'string!UNIT_RATES/lab' );

  /**
   * @constructor
   */
  function LabScreen() {

    var icon = new Rectangle( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, {
      fill: 'yellow'
    } );

    Screen.call( this, labString, icon,
      function() { return new LabModel(); },
      function( model ) { return new LabScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  unitRates.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );