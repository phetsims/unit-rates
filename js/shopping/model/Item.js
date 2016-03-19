// Copyright 2002-2016, University of Colorado Boulder

/**
 * A specific instance of an item (i.e. apple, cucumbers, blue candy) and it's attributes
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  //var unitRates = require( 'UNIT_RATES/unitRates' );
  var PropertySet = require( 'AXON/PropertySet' );

  function Item( type, unit, rate, initialPosition ) {
    PropertySet.call( this,
      {
        userControlled: false,
        position: initialPosition
      } );

    this.type = type;
    this.unit = unit;
    this.rate = rate;
  }

  return inherit( PropertySet, Item, {

  } ); // inherit

} ); //define
