// Copyright 2002-2016, University of Colorado Boulder

/**
 * A specific instance of an item (i.e. apple, cucumbers, blue candy) with it's attributes
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
   * @param {ItemData} data
   * @param {number} [count]
   * @constructor
   */
  function Item( data, count ) {

    // @public (readwrite)
    PropertySet.call( this, {
      position: new Vector2( 0, 0 ) // (0, 0) is considered an uninitialized position
    } );

    // @public (readonly)
    this.type = data.type;

    // @public (readonly)
    this.rate = data.rate;

    // @public (readonly)
    this.weight = data.weight;

    // @public (readonly)
    this.count = count || 1;
  }

  return inherit( PropertySet, Item, {

  } ); // inherit

} ); //define
