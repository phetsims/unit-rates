// Copyright 2017, University of Colorado Boulder

//TODO should the model include units?
/**
 * Model of a rate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Util = require( 'DOT/Util' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

  /**
   * @param {number} numerator - the rate's numerator, must be an integer
   * @param {number} denominator - the rate's denominator, must be an integer
   * @constructor
   */
  function Rate( numerator, denominator ) {

    assert && assert( Util.isInteger( numerator ), 'numerator must be an integer: ' + numerator );
    assert && assert( Util.isInteger( denominator ), 'denominator must be an integer: ' + denominator );

    var self = this;

    // @public
    this.numeratorProperty = new Property( numerator );
    this.denominatorProperty = new Property( denominator );

    // @public (read-only)
    this.unitRateProperty = new Property( numerator / denominator );

    // unmultilink not needed
    Property.multilink( [ this.numeratorProperty, this.denominatorProperty ],
      function( numerator, denominator ) {
        assert && assert( Util.isInteger( numerator ), 'numerator must be an integer: ' + numerator );
        assert && assert( Util.isInteger( denominator ), 'denominator must be an integer: ' + denominator );
        self.unitRateProperty.value = numerator / denominator;
      }
    );
  }

  unitRates.register( 'Rate', Rate );

  return inherit( Object, Rate, {

    // @public
    reset: function() {
      this.numeratorProperty.reset();
      this.denominatorProperty.reset();
    },

    // @public
    toString: function() {
      return this.numeratorProperty.value + '/' + this.denominatorProperty.value;
    },

    // @public
    equals: function( object ) {
      return ( object instanceof Rate ) &&
             ( object.numeratorProperty.value === this.numeratorProperty.value) &&
             ( object.denominatorProperty.value === this.denominatorProperty.value);
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
      var denominator = Math.pow( 10, URUtil.decimalPlaces( unitRate ) );
      var fraction = new Fraction( unitRate * denominator, denominator );
      fraction.reduce();
      
      // use closest integer values
      return new Rate( Util.toFixedNumber( fraction.numerator, 0 ), Util.toFixedNumber( fraction.denominator, 0 ) );
    }
  } );
} );
