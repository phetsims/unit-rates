// Copyright 2016, University of Colorado Boulder

/**
 * A specific instance of an item (i.e. apple, cucumber, blue candy) or group of multiple items (i.e. bag, count > 1).
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemData = require( 'UNIT_RATES/common/shopping/model/ItemData' );
  var Movable = require( 'UNIT_RATES/common/model/Movable' );
  var Property = require( 'AXON/Property' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {string} type
   * @param {number} [count]
   * @constructor
   */
  function Item( type, count ) {

    Movable.call( this );

    // @public (read-only)
    this.type = type; // {string}, e.g. 'apple', 'cucumber', 'blueCandy'
    this.countProperty = new Property( count ); // the number of items (or weight in pounds for candy)
  }

  unitRates.register( 'Item', Item );

  return inherit( Movable, Item );
} );
