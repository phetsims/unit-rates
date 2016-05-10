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
  var unitRates = require( 'UNIT_RATES/unitRates' );
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
      position: new Vector2( 0, 0 ), // (0, 0) is considered an uninitialized position - FIXME: move up to ItemNode?
      dragable: true,
      editable: false
    } );

    // @public (readonly)
    this.type = data.type;

    // @public (readonly)
    this.rate = data.rate;

    // @public (readonly)
    this.weight = data.weight;

    // @public (readwrite)
    this.count = count || 1;
  }

  unitRates.register( 'Item', Item );

  return inherit( PropertySet, Item, {

    /**
     * @param {Item} item
     * @returns {boolean}
     * @public
     */
    isEqual: function( item ) {
       return ( item.type === this.type && item.rate === this.rate &&
                item.weight === this.weight &&  item.count === this.count );
    }

  } ); // inherit

} ); //define
