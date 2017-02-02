// Copyright 2017, University of Colorado Boulder

/**
 * Model of a car in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var DoubleNumberLine = require( 'UNIT_RATES/common/model/DoubleNumberLine' );
  var MarkerEditor = require( 'UNIT_RATES/common/model/MarkerEditor' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Car( options ) {

    options = _.extend( {
      speed: 100 // {number} initial speed, in miles per hour
    }, options );

    // @public speed of this car, in miles per hour
    this.speedProperty = new Property( options.speed );

    // @public double number line associated with this car
    this.doubleNumberLine = new DoubleNumberLine( this.speedProperty, {
      //TODO
    } );

    // @public marker editor for this car's double number line
    this.markerEditor = new MarkerEditor( this.speedProperty, {
      //TODO
    } );
  }

  unitRates.register( 'Car', Car );

  return inherit( Object, Car, {

    // @public
    reset: function() {
      this.speedProperty.reset();
      this.doubleNumberLine.reset();
      this.markerEditor.reset();
    }
  } );
} );