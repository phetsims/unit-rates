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
