// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model of a rate.
 *
 * A ratio is a comparison of two numbers.
 * The two numbers are called terms, herein referred to as numerator and denominator.
 * A rate is a ratio where the measurements are in different units.
 * A unit rate is a rate where the denominator is 1.
 *
 * Note that the model does not include units. This sim has multiple ways of displaying units that are
 * semantically equivalent (e.g. pound, pounds, lbs), so units are the responsibility of the client.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import unitRates from '../../unitRates.js';
import URUtils from '../URUtils.js';

/**
 * @param {number} numerator - the rate's numerator, must be an integer
 * @param {number} denominator - the rate's denominator, must be an integer
 * @constructor
 */
function Rate( numerator, denominator ) {

  assert && assert( Utils.isInteger( numerator ), 'numerator must be an integer: ' + numerator );
  assert && assert( Utils.isInteger( denominator ), 'denominator must be an integer: ' + denominator );

  // @public
  this.numeratorProperty = new NumberProperty( numerator );
  this.denominatorProperty = new NumberProperty( denominator );

  // @public (read-only) dispose not needed
  this.unitRateProperty = new DerivedProperty( [ this.numeratorProperty, this.denominatorProperty ],
    function( numerator, denominator ) {
      return numerator / denominator;
    } );
}

unitRates.register( 'Rate', Rate );

export default inherit( Object, Rate, {

  // @public
  reset: function() {
    this.numeratorProperty.reset();
    this.denominatorProperty.reset();
  },

  /**
   * String representation. For debugging and logging only. Do not rely on the format of this!
   * @returns {string}
   * @public
   */
  toString: function() {
    return this.numeratorProperty.value + '/' + this.denominatorProperty.value;
  }
}, {

  /**
   * Creates a Rate using a unit rate.
   * The Rate returned is the closest rate that can be represented with integers.
   * @param {number} unitRate
   * @returns {Rate}
   * @public
   * @static
   */
  withUnitRate: function( unitRate ) {

    // compute corresponding numerator and denominator
    const denominator = Math.pow( 10, URUtils.decimalPlaces( unitRate ) );
    const fraction = new Fraction( unitRate * denominator, denominator );
    fraction.reduce();

    // use closest integer values
    return new Rate( Utils.toFixedNumber( fraction.numerator, 0 ), Utils.toFixedNumber( fraction.denominator, 0 ) );
  }
} );