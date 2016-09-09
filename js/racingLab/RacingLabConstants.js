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
    MAX_TRACK_DISTANCE:         200,
    TRACK_INTERVAL_DISTANCE:    50,
    TRACK_START_FLAG_X:         60,

    //----------------------------------------------------------------------------
    // Models
    //----------------------------------------------------------------------------
    TIME_DT_FACTOR:             1.75

  };

  unitRates.register( 'RacingLabConstants', RacingLabConstants );

  return RacingLabConstants;

} );
