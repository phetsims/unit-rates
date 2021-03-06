// Copyright 2017-2020, University of Colorado Boulder

/**
 * Button that resets a race in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import resetRaceButton from '../../../images/reset_race_button_png.js';
import unitRates from '../../unitRates.js';

class ResetRaceButton extends RectangularPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    super( merge( {
      content: new Image( resetRaceButton, { scale: 0.5 } ),
      xMargin: 12,
      yMargin: 8
    }, options ) );
  }
}

unitRates.register( 'ResetRaceButton', ResetRaceButton );

export default ResetRaceButton;