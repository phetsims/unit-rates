// Copyright 2016, University of Colorado Boulder

/**
 * A base class used for positioning/animating derived nodes
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Movable( options ) {

    options = _.extend( {
      xAxisEnabled: true,           // allows movement in x direction
      yAxisEnabled: true,           // allows movement in y direction
      bounds: null,                 // Bounds2 - allowed bounds for movement.
      position: new Vector2( 0, 0 ) // default position
    }, options || {} );

    // @public (read-write)
    PropertySet.call( this, {
      xAxisEnabled: options.xAxisEnabled,
      yAxisEnabled: options.yAxisEnabled,
      bounds: options.bounds,
      position: options.position
    } );
  }

  unitRates.register( 'Movable', Movable );

  return inherit( PropertySet, Movable, {

    /**
     * Update the item position property, tween if animate specified
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

        // axis enable check
        if ( !this.xAxisEnabledProperty.value ) {
          x = this.positionProperty.value.x;
        }
        if ( !this.yAxisEnabledProperty.value ) {
          y = this.positionProperty.value.y;
        }

        // bounds check
        if ( this.boundsProperty.value !== null ) {
          var bounds = this.boundsProperty.value;
          x = ( x < bounds.minX ? bounds.minX : x );
          x = ( x > bounds.maxX ? bounds.maxX : x );
          y = ( y < bounds.minY ? bounds.minY : y );
          y = ( y > bounds.maxY ? bounds.maxY : y );
        }

        this.positionProperty.value = new Vector2( x, y );
      }
    },

    //
    dispose: function() {
      this.positionProperty.unlinkAll();

      PropertySet.prototype.dispose.call( this );
    }

  } ); // inherit

} ); //define
