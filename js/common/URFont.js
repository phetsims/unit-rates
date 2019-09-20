// Copyright 2016-2019, University of Colorado Boulder

/**
 * Font used throughout this simulation.
 * Allows us to quickly change font properties for the entire simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {number|*} options font size or font options
   * @constructor
   */
  function URFont( options ) {

    // convenience for specifying font size only, e.g. new URFont(24)
    if ( typeof options === 'number' ) {
      options = { size: options };
    }

    // font attributes, as specified in the design document
    options = _.extend( {
      family: 'Arial'
    }, options );

    PhetFont.call( this, options );
  }

  unitRates.register( 'URFont', URFont );

  return inherit( PhetFont, URFont );
} );
