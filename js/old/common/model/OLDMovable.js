// Copyright 2016, University of Colorado Boulder

/**
 * A base class used for positioning/animating derived nodes
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function OLDMovable( options ) {

    options = _.extend( {
      xAxisEnabled: true,           // allows movement in x direction
      yAxisEnabled: true,           // allows movement in y direction
      bounds: null,                 // Bounds2 - allowed bounds for movement.
      position: new Vector2( 0, 0 ) // default position
    }, options );

    // @public
    this.positionProperty = new Property( options.position );

    //TODO these look like they should be private constants, not Properties
    this.xAxisEnabledProperty = new Property( options.xAxisEnabled );
    this.yAxisEnabledProperty = new Property( options.yAxisEnabled );
    this.boundsProperty = new Property( options.bounds );
  }

  unitRates.register( 'OLDMovable', OLDMovable );

  return inherit( Object, OLDMovable, {

    reset: function() {
      this.xAxisEnabledProperty.reset();
      this.yAxisEnabledProperty.reset();
      this.boundsProperty.reset();
      this.positionProperty.reset();
    },

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

    // @public
    dispose: function() {
      this.positionProperty.unlinkAll(); //TODO why is this necessary?
      this.xAxisEnabledProperty.dispose();
      this.yAxisEnabledProperty.dispose();
      this.boundsProperty.dispose();
      this.positionProperty.dispose();
    }

  } ); // inherit

} ); //define
