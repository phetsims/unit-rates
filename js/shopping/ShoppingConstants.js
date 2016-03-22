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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var ShoppingConstants = {

    //----------------------------------------------------------------------------
    // Views
    //----------------------------------------------------------------------------
    PANEL_TITLE_FONT: new PhetFont( 14 ),

    ITEM_SIZE:  18

    //----------------------------------------------------------------------------
    // Models
    //----------------------------------------------------------------------------

  };

  unitRates.register( 'ShoppingConstants', ShoppingConstants );

  return ShoppingConstants;

} );
