// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Racing Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import screenIcon from '../../images/racing_lab_screen_icon_png.js';
import URColors from '../common/URColors.js';
import unitRates from '../unitRates.js';
import unitRatesStrings from '../unitRatesStrings.js';
import RacingLabModel from './model/RacingLabModel.js';
import RacingLabScreenView from './view/RacingLabScreenView.js';

// strings
const screenRacingLabString = unitRatesStrings.screen.racingLab;

class RacingLabScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      name: screenRacingLabString,
      backgroundColorProperty: new Property( URColors.racingLabScreenBackground ),
      homeScreenIcon: new ScreenIcon( new Image( screenIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    }, options );

    super(
      () => new RacingLabModel(),
      model => new RacingLabScreenView( model ),
      options
    );
  }
}

unitRates.register( 'RacingLabScreen', RacingLabScreen );

export default RacingLabScreen;