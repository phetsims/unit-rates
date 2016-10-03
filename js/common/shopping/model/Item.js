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
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var Movable = require( 'UNIT_RATES/common/model/Movable' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {string} type
   * @param {number} [count]
   * @constructor
   */
  function Item( type, count ) {

    Movable.call( this );

    // @public (read-only)
    this.type = type;                    // (i.e. apple, cucumber, blue candy)
    this.countProperty = new Property( count );   // the number of items (or weight in pounds for candy) the instance represents
  }

  unitRates.register( 'Item', Item );

  return inherit( Movable, Item, {

    /**
     * Convenience function
     * @param {Item} item
     * @returns {boolean}
     * @public
     */
    isEqual: function( item ) {
      return ( item.type === this.type && item.countProperty.value === this.countProperty.value );
    },

    /**
     * Convenience function
     * @returns {boolean}
     * @public
     */
    isFruit: function() {
      return ( this.type === ItemData.APPLES.type || this.type === ItemData.LEMONS.type ||
               this.type === ItemData.ORANGES.type || this.type === ItemData.PEARS.type );
    },

    /**
     * Convenience function
     * @returns {boolean}
     * @public
     */
    isProduce: function() {
      return ( this.type === ItemData.CARROTS.type || this.type === ItemData.CUCUMBERS.type ||
               this.type === ItemData.POTATOES.type || this.type === ItemData.TOMATOES.type );
    },

    /**
     * Convenience function
     * @returns {boolean}
     * @public
     */
    isCandy: function() {
      return ( this.type === ItemData.RED_CANDY.type || this.type === ItemData.PURPLE_CANDY.type ||
               this.type === ItemData.GREEN_CANDY.type || this.type === ItemData.BLUE_CANDY.type );
    },

    // @public
    dispose: function() {
      Movable.prototype.dispose.call( this );
    }

  } ); // inherit

} ); //define
