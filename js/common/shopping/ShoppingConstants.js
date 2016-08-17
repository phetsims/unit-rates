// Copyright 2002-2016, University of Colorado Boulder

/**
 * This object is collection of constants that configure common shopping properties.
 * If you change something here, it will change everywhere* in the shopping simulation.
 *
 * @author Dave Schmitz (Schmitzware)
 */
 define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
 var ShoppingConstants = {

    //----------------------------------------------------------------------------
    // Screens
    //----------------------------------------------------------------------------
    SCREEN_HORIZONTAL_MARGIN: 15, // screen top/bottom margin for panels (i.e numberline/challenges/shelf)
    SCREEN_VERTICAL_MARGIN:   20, // screen left/right panel margin
    SCREEN_PANEL_SPACING:     12, // space between major panels (i.e. numberline/challenges/keypad)

    //----------------------------------------------------------------------------
    // Views
    //----------------------------------------------------------------------------
    DEFAULT_CORRECT_PROMPT_COLOR:   'rgba(0,0,225,1)',
    UNIT_RATE_CORRECT_PROMPT_COLOR: 'rgba(0,192,0,1)',

    //----------------------------------------------------------------------------
    // Models
    //----------------------------------------------------------------------------
    MAX_ITEMS:              16

  };

  unitRates.register( 'ShoppingConstants', ShoppingConstants );

  return ShoppingConstants;

} );
