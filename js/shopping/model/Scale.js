// Copyright 2017, University of Colorado Boulder

/**
 * Model of the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BagContainer = require( 'UNIT_RATES/shopping/model/BagContainer' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Property.<number>} unitRateProperty
   * @param {Object} [options]
   * @constructor
   */
  function Scale( unitRateProperty, options ) {

    options = _.extend( {

      // BagContainer options
      location: new Vector2( 0, 0 ), // {Vector2} location of the center of the scale's top surface
      numberOfBags: 4, // {number} maximum number of bags on the scale
      bagWidth: 70 // {number} width of each bag
    }, options );

    var self = this;

    // @public (read-only) width of the top surface of the scale, specific to scale.png
    this.topWidth = 300;

    BagContainer.call( this, options );

    // @public dispose required
    this.costProperty = new DerivedProperty( [ this.quantityProperty, unitRateProperty ],
      function( quantity, unitRate ) {
        return quantity * unitRate;
      } );

    // @private
    this.disposeScale = function() {
      self.costProperty.dispose();
    };
  }

  unitRates.register( 'Scale', Scale );

  return inherit( BagContainer, Scale, {

    // @public
    dispose: function() {
     this.disposeScale();
    }
  } );
} );
