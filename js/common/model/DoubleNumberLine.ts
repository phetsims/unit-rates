// Copyright 2016-2023, University of Colorado Boulder

/**
 * Model for the double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import unitRates from '../../unitRates.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Marker from './Marker.js';

// Which of the axes has a fix (immutable) range
const FixedAxisValues = [ 'numerator', 'denominator' ] as const;
type FixedAxis = ( typeof FixedAxisValues )[number];

export type AxisOptions = {
  axisLabel: string; // label for the axis
  maxDecimals?: number; // {number} maximum number of decimal places, integer >= 0
  trimZeros?: boolean; // whether to trim trailing zeros from decimal places
};

const DEFAULT_AXIS_OPTIONS = {
  axisLabel: '', // {string} label for the axis
  maxDecimals: 1, // {number} maximum number of decimal places
  trimZeros: false // {boolean} whether to trim trailing zeros from decimal places
};

type SelfOptions = {
  fixedAxis?: FixedAxis; // which of the axes has a fixed (immutable) range
  fixedAxisRange?: Range; // range of the fixed axis
  numeratorOptions?: AxisOptions; // options specific to the rate's numerator
  denominatorOptions?: AxisOptions; // options specific to the rate's denominator
  isMajorMarker?: ( numerator: number, denominator: number ) => boolean; // determines whether a marker is major
};

type DoubleNumberLineOptions = SelfOptions;

export default class DoubleNumberLine {

  public readonly unitRateProperty: NumberProperty;
  public readonly fixedAxis: FixedAxis; // which of the axes has a fixed range, see FIXED_AXIS_VALUES
  public readonly numeratorOptions: AxisOptions; // options for the numerator (top) number line
  public readonly denominatorOptions: AxisOptions; // options for the denominator (bottom) number line
  public readonly isMajorMarker: ( numerator: number, denominator: number ) => boolean; // determines whether a marker is major
  private readonly numeratorRangeProperty: TReadOnlyProperty<Range>;
  private readonly denominatorRangeProperty: TReadOnlyProperty<Range>;

  // NOTE: markers must be added/removed via addMarker/removeMarker
  public readonly markers: ObservableArray<Marker>;

  // Marker that can be removed by pressing the undo button. A single level of undo is supported.
  public readonly undoMarkerProperty: Property<Marker | null>;

  public constructor( unitRateProperty: NumberProperty, providedOptions?: DoubleNumberLineOptions ) {

    const options = optionize<DoubleNumberLineOptions, StrictOmit<SelfOptions, 'numeratorOptions' | 'denominatorOptions'>>()( {

      // SelfOptions
      fixedAxis: 'denominator',
      fixedAxisRange: new Range( 0, 10 ),
      isMajorMarker: ( numerator: number, denominator: number ) => true
    }, providedOptions );

    this.unitRateProperty = unitRateProperty;
    this.fixedAxis = options.fixedAxis;
    this.numeratorOptions = combineOptions<AxisOptions>( {}, DEFAULT_AXIS_OPTIONS, options.numeratorOptions );
    this.denominatorOptions = combineOptions<AxisOptions>( {}, DEFAULT_AXIS_OPTIONS, options.denominatorOptions );
    this.isMajorMarker = options.isMajorMarker;

    this.markers = createObservableArray();
    this.undoMarkerProperty = new Property<Marker | null>( null );

    if ( options.fixedAxis === 'numerator' ) {

      // numerator range is immutable
      this.numeratorRangeProperty = new Property( options.fixedAxisRange );
      this.numeratorRangeProperty.lazyLink( range => {  // unlink not needed, exists for sim lifetime
        throw new Error( 'numeratorRangeProperty should not change' );
      } );

      // denominator range is mutable, dispose not needed, exists for sim lifetime
      this.denominatorRangeProperty = new DerivedProperty( [ this.numeratorRangeProperty, unitRateProperty ],
        ( numeratorRange, unitRate ) => {
          return new Range( numeratorRange.min / unitRate, numeratorRange.max / unitRate );
        } );

      // when the denominator range changes, adjust the denominator of all markers,
      // unlink not needed, exists for sim lifetime
      this.denominatorRangeProperty.link( denominatorRange => {
        this.markers.forEach( marker => {
          marker.denominatorProperty.value = marker.numeratorProperty.value / unitRateProperty.value;
        } );
      } );
    }
    else {

      // denominator range is immutable
      this.denominatorRangeProperty = new Property( options.fixedAxisRange );
      this.denominatorRangeProperty.lazyLink( range => { // unlink not needed, exists for sim lifetime
        throw new Error( 'denominatorRangeProperty should not change' );
      } );

      // numerator range is mutable, dispose not needed, exists for sim lifetime
      this.numeratorRangeProperty = new DerivedProperty( [ this.denominatorRangeProperty, unitRateProperty ],
        ( denominatorRange, unitRate ) => {
          return new Range( denominatorRange.min * unitRate, denominatorRange.max * unitRate );
        } );

      // when the numerator range changes, adjust the numerator of all markers
      // unlink not needed, exists for sim lifetime
      this.numeratorRangeProperty.link( numeratorRange => {
        this.markers.forEach( marker => {
          marker.numeratorProperty.value = marker.denominatorProperty.value * unitRateProperty.value;
        } );
      } );
    }
  }

  public reset(): void {
    this.markers.reset();
    this.undoMarkerProperty.reset();
  }

  /**
   * Maps a rate's numerator from model to view coordinate frame.
   * @param numerator - numerator in model coordinate frame
   * @param viewMax - numerator's maximum in view coordinate frame
   */
  public modelToViewNumerator( numerator: number, viewMax: number ): number {
    return Utils.linear(
      this.numeratorRangeProperty.value.min, this.numeratorRangeProperty.value.max,
      0, viewMax,
      numerator );
  }

  /**
   * Maps a rate's denominator from model to view coordinate frame.
   * @param denominator - denominator in model coordinate frame
   * @param viewMax - denominator's maximum in view coordinate frame
   */
  public modelToViewDenominator( denominator: number, viewMax: number ): number {
    return Utils.linear(
      this.denominatorRangeProperty.value.min, this.denominatorRangeProperty.value.max,
      0, viewMax,
      denominator );
  }

  /**
   * Gets the maximum value that fits on the numerator (top) axis.
   */
  public getMaxNumerator(): number {
    return this.numeratorRangeProperty.value.max;
  }

  /**
   * Gets the maximum value that fits on the denominator (bottom) axis.
   */
  public getMaxDenominator(): number {
    return this.denominatorRangeProperty.value.max;
  }

  /**
   * This is a request to add a marker, subject to rules about uniqueness and marker precedence.
   * The rules are complicated to describe, so please consult the implementation.
   * Calling this function may result in a lower precedence marker being deleted as a side effect.
   * @param marker
   * @returns true if the marker was added, false if the request was ignored
   */
  public addMarker( marker: Marker ): boolean {

    assert && assert( !this.markers.includes( marker ), `attempt to add marker again: ${marker}` );

    let wasAdded = false; //{boolean} state to determine whether the marker was added or not

    // look for a marker that conflicts with this one (has same numerator or denominator)
    const conflictingMarker = this.getConflictingMarker( marker );

    if ( !conflictingMarker ) {

      // if there is no marker that conflicts with this one, then simply add the marker
      this.markers.add( marker );
      wasAdded = true;
    }
    else if ( conflictingMarker.precedenceOf( marker ) >= 0 ) {

      // Replace with higher or same precedence marker.
      // Need to replace same precedence marker so that undo marker is properly set.
      this.removeMarker( conflictingMarker );
      if ( this.undoMarkerProperty.value === conflictingMarker ) {
        this.undoMarkerProperty.value = null;
      }
      this.markers.add( marker );
      wasAdded = true;
    }
    else {

      // ignore lower precedence marker
      phet.log && phet.log( `ignoring lower precedence marker: ${marker.toString()}` );
    }

    return wasAdded;
  }

  /**
   * Removes a marker.
   */
  public removeMarker( marker: Marker ): void {
    assert && assert( this.markers.includes( marker ), `attempt to remove an unknown marker: ${marker}` );
    this.markers.remove( marker );
  }

  /**
   * Gets a marker that conflicts with the specified marker.
   * Two markers conflict if they have the same numerator or denominator, which is possible due to rounding errors.
   * @param marker
   * @returns null if there is no conflicting
   */
  private getConflictingMarker( marker: Marker ): Marker | null {
    let conflictingMarker = null;
    for ( let i = 0; i < this.markers.length && !conflictingMarker; i++ ) {
      if ( marker.conflictsWith( this.markers[ i ] ) ) {
        conflictingMarker = this.markers[ i ];
      }
    }
    return conflictingMarker;
  }

  /**
   * Does this marker fall within the range of the axes?
   */
  public markerIsInRange( marker: Marker ): boolean {
    return ( this.numeratorRangeProperty.value.contains( marker.numeratorProperty.value ) &&
             this.denominatorRangeProperty.value.contains( marker.denominatorProperty.value ) );
  }

  /**
   * Undoes (removes) the undo marker. If there is no undo marker, this is a no-op.
   */
  public undo(): void {
    const undoMarker = this.undoMarkerProperty.value;
    if ( undoMarker ) {
      assert && assert( this.markers.includes( undoMarker ), `unexpected undoMarker: ${undoMarker}` );
      this.undoMarkerProperty.value = null;
      this.removeMarker( undoMarker );
    }
  }

  /**
   * Erases all markers that are erasable.
   */
  public erase(): void {

    this.undoMarkerProperty.reset();

    // remove all markers that are erasable
    this.markers.forEach( marker => {
      if ( marker.erasable ) {
        this.removeMarker( marker );
      }
    } );
  }
}

unitRates.register( 'DoubleNumberLine', DoubleNumberLine );