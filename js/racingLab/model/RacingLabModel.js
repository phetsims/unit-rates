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
  function RacingLabModel() {

    PropertySet.call( this, {
      //TODO
    } );
  }

  unitRates.register( 'RacingLabModel', RacingLabModel );

  return inherit( PropertySet, RacingLabModel, {


  } ); // inherit

} ); // define
