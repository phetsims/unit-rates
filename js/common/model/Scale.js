// Copyright 2017, University of Colorado Boulder

/**
 * Model of the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Scale( options ) {

    options = _.extend( {
      location: new Vector2( 0, 0 ), // {Vector2} location of the center of the scale's top surface
      width: 300, // {number} width of the top surface of the scale
      costIsHideable: false, // {boolean} whether cost is hideable
      quantityIsDisplayed: false, // {boolean} whether quantity is displayed
      quantityUnits: '' // {string} units for quantity
    }, options );

    // @public ( read-only)
    this.location = options.location;
    this.width = options.width;
    this.costIsHideable = options.costIsHideable;
    this.quantityIsDisplayed = options.quantityIsDisplayed;
    this.quantityUnits = options.quantityUnits;

    // @public
    this.costVisibleProperty = new Property( true );
    this.costProperty = new Property( 0 );
    this.quantityProperty = new Property( 0 );

    //TODO
  }

  unitRates.register( 'Scale', Scale );

  return inherit( Object, Scale, {

    reset: function() {
      this.costVisibleProperty.reset();
      this.costProperty.reset();
      this.quantityProperty.reset();
    },

    // @public
    clear: function() {
      //TODO
    }
  } );
} );
