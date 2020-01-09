// Copyright 2017-2020, University of Colorado Boulder

/**
 * Model for the marker editor.
 * The rate created by the marker editor is used as the basis for creating markers on the double number line.
 * Position of the marker editor is handled by the view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Property = require( 'AXON/Property' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const Utils = require( 'DOT/Utils' );

  /**
   * @param {Property.<boolean>} unitRateProperty
   * @param {Object} [options]
   * @constructor
   */
  function MarkerEditor( unitRateProperty, options ) {

    const self = this;

    options = merge( {
      numeratorMaxDecimals: 2, // {number} maximum decimal places in the numerator
      denominatorMaxDecimals: 2 // {number} maximum decimal places in the denominator
    }, options );

    // @public
    this.numeratorProperty = new Property( null ); // {Property.<number|null>} the numerator in the editor
    this.denominatorProperty = new Property( null ); // {Property.<number|null>} the denominator in the editor

    // @public (read-only)
    this.unitRateProperty = unitRateProperty;

    // @private
    this.denominatorMaxDecimals = options.denominatorMaxDecimals;

    // if a numerator is entered that can't be computed from the existing denominator, then clear the denominator
    this.numeratorProperty.link( function( numerator ) { // no unlink required
      if ( numerator !== null && self.denominatorProperty.value !== null ) {
        const correctNumerator = Utils.toFixedNumber( self.denominatorProperty.value * unitRateProperty.value, options.numeratorMaxDecimals );
        if ( numerator !== correctNumerator ) {
          self.denominatorProperty.value = null;
        }
      }
    } );

    // if a denominator is entered that can't be computed from the existing numerator, then clear the numerator
    this.denominatorProperty.link( function( denominator ) { // no unlink required
      if ( denominator !== null && self.numeratorProperty.value !== null ) {
        const correctDenominator = Utils.toFixedNumber( self.numeratorProperty.value / unitRateProperty.value, options.denominatorMaxDecimals );
        if ( denominator !== correctDenominator ) {
          self.numeratorProperty.value = null;
        }
      }
    } );

    // if the unit rate changes, reset the editor, which effectively cancels any edit that is in progress
    // unlink not needed, exists for sim lifetime
    unitRateProperty.lazyLink( function() {
      self.reset();
    } );
  }

  unitRates.register( 'MarkerEditor', MarkerEditor );

  return inherit( Object, MarkerEditor, {

    // @public
    reset: function() {
      this.numeratorProperty.reset();
      this.denominatorProperty.reset();
    },

    /**
     * The marker editor is 'empty' when both the numerator and denominator are null.
     * @returns {boolean}
     * @public
     */
    isEmpty: function() {
      return ( this.numeratorProperty.value === null && this.denominatorProperty.value === null );
    }
  } );
} );
