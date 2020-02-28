// Copyright 2016-2020, University of Colorado Boulder

/**
 * Font used throughout this simulation.
 * Allows us to quickly change font properties for the entire simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import unitRates from '../unitRates.js';

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
  options = merge( {
    family: 'Arial'
  }, options );

  PhetFont.call( this, options );
}

unitRates.register( 'URFont', URFont );

inherit( PhetFont, URFont );
export default URFont;