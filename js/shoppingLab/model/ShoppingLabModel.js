// Copyright 2016, University of Colorado Boulder

/**
 * Shopping lab model
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URShoppingModel = require( 'UNIT_RATES/common/shopping/model/URShoppingModel' );

  /**
   * @constructor
   */
  function ShoppingLabModel() {

    URShoppingModel.call( this );
  }

  unitRates.register( 'ShoppingLabModel', ShoppingLabModel );

  return inherit( URShoppingModel, ShoppingLabModel, {


  } ); // inherit

} ); // define
