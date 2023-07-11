// Copyright 2017-2023, University of Colorado Boulder

/**
 * Button used to start and stop a race in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StopSignNode from '../../../../scenery-phet/js/StopSignNode.js';
import { Image, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import BooleanRoundToggleButton, { BooleanRoundToggleButtonOptions } from '../../../../sun/js/buttons/BooleanRoundToggleButton.js';
import goButtonIcon_png from '../../../images/goButtonIcon_png.js';
import unitRates from '../../unitRates.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type StartStopButtonOptions = SelfOptions & NodeTranslationOptions;

export default class StartStopButton extends BooleanRoundToggleButton {

  public constructor( runningProperty: BooleanProperty, providedOptions?: StartStopButtonOptions ) {

    const options = optionize<StartStopButtonOptions, SelfOptions, BooleanRoundToggleButtonOptions>()( {

      // BooleanRoundToggleButtonOptions
      radius: 45,
      xMargin: 8,
      yMargin: 8
    }, providedOptions );

    const goIcon = new Image( goButtonIcon_png, { scale: 0.5 } );
    const stopIcon = new StopSignNode( { fillRadius: 25 } );

    super( runningProperty, stopIcon, goIcon, options );

    // adjust button color based on runningProperty
    // unlink not needed, exists for sim lifetime
    runningProperty.link( running => {
      this.baseColor = ( running ? '#6D6E70' : '#85d4a6' );
    } );
  }
}

unitRates.register( 'StartStopButton', StartStopButton );