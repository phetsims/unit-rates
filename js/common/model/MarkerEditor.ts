// Copyright 2017-2023, University of Colorado Boulder

/**
 * Model for the marker editor.
 * The rate created by the marker editor is used as the basis for creating markers on the double number line.
 * Position of the marker editor is handled by the view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import unitRates from '../../unitRates.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {
  numeratorMaxDecimals?: number; // maximum decimal places in the numerator, integer >= 0
  denominatorMaxDecimals?: number; // maximum decimal places in the denominator, integer >= 0
};

type MarkerEditorOptions = SelfOptions;

export default class MarkerEditor {

  public readonly unitRateProperty: TReadOnlyProperty<number>;
  public readonly numeratorProperty: Property<number | null>; // the numerator in the editor, null if no numerator
  public readonly denominatorProperty: Property<number | null>; // the denominator in the editor, null if no denominator
  private readonly denominatorMaxDecimals: number;

  public constructor( unitRateProperty: TReadOnlyProperty<number>, providedOptions?: MarkerEditorOptions ) {

    const options = optionize<MarkerEditorOptions, SelfOptions>()( {

      // SelfOptions
      numeratorMaxDecimals: 2,
      denominatorMaxDecimals: 2
    }, providedOptions );

    assert && assert( Number.isInteger( options.numeratorMaxDecimals ) && options.numeratorMaxDecimals >= 0 );
    assert && assert( Number.isInteger( options.denominatorMaxDecimals ) && options.denominatorMaxDecimals >= 0 );

    this.unitRateProperty = unitRateProperty;

    this.numeratorProperty = new Property<number | null>( null, {
      reentrant: true // see https://github.com/phetsims/unit-rates/issues/216
    } );

    this.denominatorProperty = new Property<number | null>( null, {
      reentrant: true // see https://github.com/phetsims/unit-rates/issues/216
    } );

    this.denominatorMaxDecimals = options.denominatorMaxDecimals;

    // if a numerator is entered that can't be computed from the existing denominator, then clear the denominator
    this.numeratorProperty.link( numerator => { // no unlink required
      if ( numerator !== null && this.denominatorProperty.value !== null ) {
        const correctNumerator = Utils.toFixedNumber( this.denominatorProperty.value * unitRateProperty.value, options.numeratorMaxDecimals );
        if ( numerator !== correctNumerator ) {
          this.denominatorProperty.value = null;
        }
      }
    } );

    // if a denominator is entered that can't be computed from the existing numerator, then clear the numerator
    this.denominatorProperty.link( denominator => { // no unlink required
      if ( denominator !== null && this.numeratorProperty.value !== null ) {
        const correctDenominator = Utils.toFixedNumber( this.numeratorProperty.value / unitRateProperty.value, options.denominatorMaxDecimals );
        if ( denominator !== correctDenominator ) {
          this.numeratorProperty.value = null;
        }
      }
    } );

    // if the unit rate changes, reset the editor, which effectively cancels any edit that is in progress
    // unlink not needed, exists for sim lifetime
    unitRateProperty.lazyLink( () => {
      this.reset();
    } );
  }

  public reset(): void {
    this.numeratorProperty.reset();
    this.denominatorProperty.reset();
  }

  /**
   * The marker editor is 'empty' when both the numerator and denominator are null.
   */
  public isEmpty(): boolean {
    return ( this.numeratorProperty.value === null && this.denominatorProperty.value === null );
  }
}

unitRates.register( 'MarkerEditor', MarkerEditor );