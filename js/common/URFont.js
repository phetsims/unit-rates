// Copyright 2016-2020, University of Colorado Boulder

/**
 * Font used throughout this simulation.
 * Allows us to quickly change font properties for the entire simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../phet-core/js/merge.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import unitRates from '../unitRates.js';

class URFont extends PhetFont {

  /**
   * @param {number|*} options font size or font options
   */
  constructor( options ) {

    // convenience for specifying font size only, e.g. new URFont(24)
    if ( typeof options === 'number' ) {
      options = { size: options };
    }

    // font attributes, as specified in the design document
    options = merge( {
      family: 'Arial'
    }, options );

    super( options );
  }
}

unitRates.register( 'URFont', URFont );

export default URFont;