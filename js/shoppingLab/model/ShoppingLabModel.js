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
  var ItemData = require( 'UNIT_RATES/common/enum/ItemData' );

  /**
   * @constructor
   */
  function ShoppingLabModel() {

    PropertySet.call( this, {
      itemData: ItemData.APPLES   // the currently selected item type (& the associated static attributes)
    } );
  }

  unitRates.register( 'ShoppingLabModel', ShoppingLabModel );

  return inherit( PropertySet, ShoppingLabModel, {


  } ); // inherit

} ); // define
