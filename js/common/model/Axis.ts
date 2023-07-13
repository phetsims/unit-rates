// Copyright 2023, University of Colorado Boulder

/**
 * Axis is a data structure that describes one axis (one number line) of a double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import unitRates from '../../unitRates.js';
import optionize from '../../../../phet-core/js/optionize.js';
import SunConstants from '../../../../sun/js/SunConstants.js';

type SelfOptions = {
  units?: string; // units for the axis, used to label the axis
  maxDigits?: number; // maximum number of digits on the keypad, integer > 0
  maxDecimals?: number; // maximum number of decimal places, integer >= 0
  valueFormat?: string; // pattern used to display value for the axis
  trimZeros?: boolean; // whether to trim trailing zeros from decimal places
};

export type AxisOptions = SelfOptions;

export default class Axis {

  // See SelfOptions for documentation
  public readonly units: string;
  public readonly maxDigits: number;
  public readonly maxDecimals: number;
  public readonly valueFormat: string;
  public readonly trimZeros: boolean;

  public constructor( providedOptions?: AxisOptions ) {

    const options = optionize<AxisOptions, SelfOptions>()( {

      // SelfOptions
      units: '',
      maxDigits: 4,
      maxDecimals: 2,
      trimZeros: false,
      valueFormat: SunConstants.VALUE_NUMBERED_PLACEHOLDER
    }, providedOptions );

    assert && assert( Number.isInteger( options.maxDigits ) && options.maxDigits > 0 );
    assert && assert( Number.isInteger( options.maxDecimals ) && options.maxDecimals >= 0 );

    this.units = options.units;
    this.maxDigits = options.maxDigits;
    this.maxDecimals = options.maxDecimals;
    this.valueFormat = options.valueFormat;
    this.trimZeros = options.trimZeros;
  }
}

unitRates.register( 'Axis', Axis );