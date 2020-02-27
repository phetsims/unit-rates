// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Racing Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import screenIcon from '../../images/racing_lab_screen_icon_png.js';
import URColors from '../common/URColors.js';
import unitRatesStrings from '../unit-rates-strings.js';
import unitRates from '../unitRates.js';
import RacingLabModel from './model/RacingLabModel.js';
import RacingLabScreenView from './view/RacingLabScreenView.js';

const screenRacingLabString = unitRatesStrings.screen.racingLab;

/**
 * @param {Object} [options]
 * @constructor
 */
function RacingLabScreen( options ) {

  options = merge( {
    name: screenRacingLabString,
    backgroundColorProperty: new Property( URColors.racingLabScreenBackground ),
    homeScreenIcon: new Image( screenIcon )
  }, options );

  Screen.call( this,
    function() { return new RacingLabModel(); },
    function( model ) { return new RacingLabScreenView( model ); },
    options
  );
}

unitRates.register( 'RacingLabScreen', RacingLabScreen );

inherit( Screen, RacingLabScreen );
export default RacingLabScreen;