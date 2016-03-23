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
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {ItemType} item
   * @param {number} units
   * @param (number} rate
   * @param (number} [weight]
   * @constructor
   */
  function Item( type, units, rate, weight ) {

    // @public (readwrite)
    PropertySet.call( this, {
      position: new Vector2( 0, 0 )
    } );

    // @public (readonly)
    this.type = type;

    // @public (readonly)
    this.units = units;

    // @public (readonly)
    this.rate = rate;

    // @public (readonly)
    this.weight = weight;

  }

  return inherit( PropertySet, Item, {

  } ); // inherit

} ); //define
