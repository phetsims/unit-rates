// Copyright 2017-2020, University of Colorado Boulder

/**
 * Button that resets a race in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import resetRaceButton from '../../../images/reset_race_button_png.js';
import unitRates from '../../unitRates.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function ResetRaceButton( options ) {
  RectangularPushButton.call( this, merge( {
    content: new Image( resetRaceButton, { scale: 0.5 } ),
    xMargin: 12,
    yMargin: 8
  }, options ) );
}

unitRates.register( 'ResetRaceButton', ResetRaceButton );

inherit( RectangularPushButton, ResetRaceButton );
export default ResetRaceButton;