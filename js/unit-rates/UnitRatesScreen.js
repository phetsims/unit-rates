// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var UnitRatesModel = require( 'UNIT_RATES/unit-rates/model/UnitRatesModel' );
  var UnitRatesScreenView = require( 'UNIT_RATES/unit-rates/view/UnitRatesScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var unitRatesTitleString = require( 'string!UNIT_RATES/unit-rates.title' );

  /**
   * @constructor
   */
  function UnitRatesScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.
    var icon = null;

    Screen.call( this, unitRatesTitleString, icon,
      function() { return new UnitRatesModel(); },
      function( model ) { return new UnitRatesScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  unitRates.register( 'UnitRatesScreen', UnitRatesScreen );

  return inherit( Screen, UnitRatesScreen );
} );