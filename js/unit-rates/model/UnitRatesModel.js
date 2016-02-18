// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @constructor
   */
  function UnitRatesModel() {

    PropertySet.call( this, {
      //TODO
    } );
  }

  unitRates.register( 'UnitRatesModel', UnitRatesModel );

  return inherit( PropertySet, UnitRatesModel, {

    //TODO Called by the animation loop. Optional, so if your model has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle model animation here.
    }
  } );
} );