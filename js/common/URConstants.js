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
    // Views
    //----------------------------------------------------------------------------
    PANEL_TITLE_FONT: new PhetFont( 14 )

    //----------------------------------------------------------------------------
    // Models
    //----------------------------------------------------------------------------

  };

  unitRates.register( 'URConstants', URConstants );

  return URConstants;

} );
