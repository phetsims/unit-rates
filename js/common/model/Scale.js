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

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Scale( options ) {

    options = _.extend( {
      costIsHideable: false, // {boolean} whether cost is hideable
      quantityIsDisplayed: false, // {boolean} whether quantity is displayed
      quantityUnits: '' // {string} units for quantity
    }, options );

    // @public ( read-only)
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
