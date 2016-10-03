// Copyright 2016, University of Colorado Boulder

/**
 * This object is collection of constants that configure common shopping properties.
 * If you change something here, it will change everywhere in the shopping simulations
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
    DEFAULT_CORRECT_PROMPT_COLOR: 'rgba(0,0,225,1)',    // Challenge question color
    UNIT_RATE_CORRECT_PROMPT_COLOR: 'rgba(0,192,0,1)'     // Challenge Unit Rate question color

    //----------------------------------------------------------------------------
    // Models
    //----------------------------------------------------------------------------


  };

  unitRates.register( 'ShoppingConstants', ShoppingConstants );

  return ShoppingConstants;

} );
