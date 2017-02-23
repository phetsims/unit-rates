// Copyright 2017, University of Colorado Boulder

/**
 * Model for the marker editor.
 * Location of the editor is handled solely in the view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Property.<boolean>} unitRateProperty
   * @param {Object} [options]
   * @constructor
   */
  function MarkerEditor( unitRateProperty, options ) {

    options = _.extend( {
      numeratorMaxDecimals: 2, // {number} maximum decimal places in the numerator
      denominatorMaxDecimals: 2 // {number} maximum decimal places in the denominator
    }, options );

    var self = this;

    // @public
    this.numeratorProperty = new Property( null ); // {Property.<number|null>} the numerator in the editor
    this.denominatorProperty = new Property( null ); // {Property.<number|null>} the denominator in the editor
    this.unitRateProperty = unitRateProperty;

    // @private
    this.denominatorMaxDecimals = options.denominatorMaxDecimals;

    // if a numerator is entered that can't be computed from the existing denominator, then clear the denominator
    this.numeratorProperty.link( function( numerator ) { // no unlink required
      if ( numerator !== null && self.denominatorProperty.value !== null ) {
        var correctNumerator = Util.toFixedNumber( self.denominatorProperty.value * unitRateProperty.value, options.numeratorMaxDecimals );
        if ( numerator !== correctNumerator ) {
          self.denominatorProperty.value = null;
        }
      }
    } );

    // if a denominator is entered that can't be computed from the existing numerator, then clear the numerator
    this.denominatorProperty.link( function( denominator ) { // no unlink required
      if ( denominator !== null && self.numeratorProperty.value !== null ) {
        var correctDenominator = Util.toFixedNumber( self.numeratorProperty.value / unitRateProperty.value, options.denominatorMaxDecimals );
        if ( denominator !== correctDenominator ) {
          self.numeratorProperty.value = null;
        }
      }
    } );

    // if the unit rate changes, cancel any edit that is in progress
    var unitRateObserver = function() {
      self.reset();
    };
    unitRateProperty.lazyLink( unitRateObserver ); // unlink in dispose

    // @private
    this.disposeMarkerEditor = function() {
      unitRateProperty.unlink( unitRateObserver );
    };
  }

  unitRates.register( 'MarkerEditor', MarkerEditor );

  return inherit( Object, MarkerEditor, {

    // @public
    dispose: function() {
      this.disposeMarkerEditor();
    },

    // @public
    reset: function() {
      this.numeratorProperty.reset();
      this.denominatorProperty.reset();
    },

    /**
     * The marker editor is 'empty' when both the numerator and denominator are null.
     * @returns {boolean}
     */
    isEmpty: function() {
      return ( this.numeratorProperty.value === null && this.denominatorProperty.value === null );
    }
  } );
} );
