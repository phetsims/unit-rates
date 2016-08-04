// Copyright 2002-2016, University of Colorado Boulder

/**
 * A specific instance of an item (i.e. apple, cucumber, blue candy) with it's dynamic attributes
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants

  /**
   * @param {ItemData} data
   * @param {number} [count]
   * @constructor
   */
  function Item( data, count ) {

    // @public (read-write)
    PropertySet.call( this, {
      position: new Vector2( 0, 0 )
    } );

    // @public (read-only)
    this.type   = data.type;

    // @public (read-only)
    this.rate   = data.rate;

    // @public (read-only) - FIXME: probably not needed any more. Waiting on final design doc revisions
    this.weight = data.weight;

    // @public (read-write)
    this.count  = count || 1;
  }

  unitRates.register( 'Item', Item );

  return inherit( PropertySet, Item, {

    /**
     * Update the item position property, tween if specified
     * @param {number} x
     * @param {number} y
     * @param {boolean} animate - preforms a tween between the old position and the new
     * @public
     */
    setPosition: function( x, y, animate ) {
      var self = this;

      if ( animate ) {

        var position = {
          x: this.positionProperty.value.x,
          y: this.positionProperty.value.y
        };

        var animationTween = new TWEEN.Tween( position ).
          to( {
            x: x,
            y: y
          }, 1000 )
          .easing( TWEEN.Easing.Cubic.Out )
          .onUpdate( function() {
            self.setPosition( position.x, position.y, false );
          } )
          .onComplete( function() {
          } );

        animationTween.start();
      }
      else {
        this.positionProperty.value = new Vector2( x, y );
      }
    },

    /**
     * Convenience function
     * @param {Item} item
     * @returns {boolean}
     * @public
     */
    isEqual: function( item ) {
       return ( item.type   === this.type   && item.rate  === this.rate &&
               item.weight === this.weight && item.count === this.count );
    },

    /**
     * Convenience function
     * @returns {boolean}
     * @public
     */
    isCandy: function() {
      return ( this.type === ItemData.RED_CANDY.type   || this.type === ItemData.YELLOW_CANDY.type ||
              this.type === ItemData.GREEN_CANDY.type || this.type === ItemData.BLUE_CANDY.type );
    },

    //
    dispose: function() {
      this.positionProperty.unlinkAll();
    }

  } ); // inherit

} ); //define
