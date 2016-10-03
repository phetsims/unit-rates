// Copyright 2016, University of Colorado Boulder

/**
 * This object is collection of constants that configure common racing properties.
 * If you change something here, it will change everywhere* in the racing lab simulation.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  var RacingLabConstants = {

    //----------------------------------------------------------------------------
    // Views
    //----------------------------------------------------------------------------
    TRACK_NUMBER_LINE_OFFSET: 55,     // the offset of the start of X=0 (aka. the space for the edit marker)
    TRACK_NUMBER_LINE_WIDTH: 670,

    //----------------------------------------------------------------------------
    // Models
    //----------------------------------------------------------------------------
    RACING_DT_SCALE: 1.75   // the scale factor used to slow down the sim.

  };

  unitRates.register( 'RacingLabConstants', RacingLabConstants );

  return RacingLabConstants;

} );
