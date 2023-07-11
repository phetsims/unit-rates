// Copyright 2017-2023, University of Colorado Boulder

/**
 * Displays the value of some generic Property.
 * Client specifies how the value is converted to a string via options.valueToString.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, TextOptions } from '../../../../scenery/js/imports.js';
import unitRates from '../../unitRates.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = {
  valueToString?: ( value: number ) => string;
};

type ValueNodeOptions = SelfOptions & PickOptional<TextOptions, 'font'>;

export default class ValueNode extends Text {

  private readonly disposeValueNode: () => void;

  public constructor( valueProperty: TReadOnlyProperty<number>, providedOptions?: ValueNodeOptions ) {

    const options = optionize<ValueNodeOptions, SelfOptions, TextOptions>()( {

      // SelfOptions
      valueToString: ( value: number ) => `${value}`,

      // TextOptions
      font: new PhetFont( 20 )
    }, providedOptions );

    super( '' ); // string will be filled in by valueObserver

    // update value display
    const valueObserver = ( value: number ) => {
      this.string = options.valueToString( value );
    };
    valueProperty.link( valueObserver ); // unlink in dispose

    this.disposeValueNode = () => {
      valueProperty.unlink( valueObserver );
    };

    this.mutate( options );
  }

  public override dispose(): void {
    this.disposeValueNode();
    super.dispose();
  }
}

unitRates.register( 'ValueNode', ValueNode );