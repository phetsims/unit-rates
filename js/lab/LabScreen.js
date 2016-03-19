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
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var labString = require( 'string!UNIT_RATES/Lab' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/Lab-screen-icon.png' );

  /**
   * @constructor
   */
  function LabScreen() {

    Screen.call( this,
      labString,
      new Image( screenIcon ),
      function() { return new LabModel(); },
      function( model ) { return new LabScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  unitRates.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );
