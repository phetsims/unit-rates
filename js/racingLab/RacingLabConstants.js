// Copyright 2002-2016, University of Colorado Boulder

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
    TRACK_NUMBER_LINE_OFFSET:   55,
    TRACK_NUMBER_LINE_WIDTH:    670,

    //----------------------------------------------------------------------------
    // Models
    //----------------------------------------------------------------------------
    SIM_DT_SCALE:             1.75

  };

  unitRates.register( 'RacingLabConstants', RacingLabConstants );

  return RacingLabConstants;

} );
