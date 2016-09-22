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
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants

  /**
   * @param {string} type
   * @param {number} [count]
   * @constructor
   */
  function Item( type, count ) {

    // @public (read-write)
    PropertySet.call( this, {
      count: count || 1,
      position: new Vector2( 0, 0 )
    } );

    // @public (read-only)
    this.type = type;
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

        var animationTween = new TWEEN.Tween( position ).to( {
          x: x,
          y: y
        }, 1000 )
          .easing( TWEEN.Easing.Cubic.InOut )
          .onUpdate( function() {
            self.setPosition( position.x, position.y, false );
          } )
          .onComplete( function() {
          } );

        animationTween.start( phet.joist.elapsedTime );
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
    isCandy: function() {
      return ( this.type === ItemData.RED_CANDY.type || this.type === ItemData.PURPLE_CANDY.type ||
               this.type === ItemData.GREEN_CANDY.type || this.type === ItemData.BLUE_CANDY.type );
    },

    //
    dispose: function() {
      this.positionProperty.unlinkAll();
    }

  } ); // inherit

} ); //define
