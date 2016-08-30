// Copyright 2002-2016, University of Colorado Boulder

/**
 * This object is collection of constants that configure global properties.
 * If you change something here, it will change *everywhere* in this simulation.
 *
 * @author Dave Schmitz (Schmitzware)
 */
 define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var URConstants = {

    //----------------------------------------------------------------------------
    // Screens
    //----------------------------------------------------------------------------
    SCREEN_HORIZONTAL_MARGIN: 15, // screen top/bottom margin for panels (i.e numberline/challenges/shelf)
    SCREEN_VERTICAL_MARGIN:   20, // screen left/right panel margin
    SCREEN_PANEL_SPACING:     12, // space between major panels (i.e. numberline/challenges/keypad)

    //----------------------------------------------------------------------------
    // Views
    //----------------------------------------------------------------------------
    PANEL_TITLE_FONT: new PhetFont( 14 ),   // Font use on all major panels (i.e. accordian boxes)

    DEFAULT_BUTTON_COLOR:   '#f2f2f2',      // Common default button color
    EDIT_BUTTON_COLOR:      'yellow'        // base color for all edit buttons

    //----------------------------------------------------------------------------
    // Models
    //----------------------------------------------------------------------------

  };

  unitRates.register( 'URConstants', URConstants );

  return URConstants;

} );
