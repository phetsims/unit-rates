// Copyright 2017, University of Colorado Boulder

/**
 * Model for the marker editor.
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

    this.numeratorProperty.link( function( numerator ) { // no unlink required
      if ( numerator !== null ) {

        // compute the corresponding denominator
        var denominator = Util.toFixedNumber( numerator / unitRateProperty.value, options.denominatorMaxDecimals );

        // clear the denominator if it doesn't match the numerator
        if ( denominator !== self.denominatorProperty.value ) {
          self.denominatorProperty.value = null;
        }
      }
    } );

    this.denominatorProperty.link( function( denominator ) { // no unlink required
      if ( denominator !== null ) {

        // compute the corresponding numerator
        var numerator = Util.toFixedNumber( denominator * unitRateProperty.value, options.numeratorMaxDecimals );

        // clear the numerator if it doesn't match the denominator
        if ( numerator !== self.numeratorProperty.value ) {
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
    }
  } );
} );
