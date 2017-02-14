// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RaceCar = require( 'UNIT_RATES/racinglab/model/RaceCar' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var blueCarImage = require( 'image!UNIT_RATES/blue_car.png' );
  var redCarImage = require( 'image!UNIT_RATES/red_car.png' );

  /**
   * @constructor
   */
  function RacingLabModel() {

    // @public is the race running?
    this.runningProperty = new Property( false );

    // @public the red (top) car
    this.car1 = new RaceCar( redCarImage );

    // @public the blue (bottom) car
    this.car2 = new RaceCar( blueCarImage, { visible: false } );

    // Reset the race when any of the specified Properties changes. unmultilink not needed
    Property.lazyMultilink( [

        // changed via the scene radio buttons
        this.car2.visibleProperty,

        // changed via the Rate spinners
        this.car1.rate.numeratorProperty,
        this.car1.rate.denominatorProperty,
        this.car2.rate.numeratorProperty,
        this.car2.rate.denominatorProperty,

        // changed by dragging the finish line flags
        this.car1.track.lengthProperty,
        this.car2.track.lengthProperty
      ],
      this.resetRace.bind( this ) );
  }

  unitRates.register( 'RacingLabModel', RacingLabModel );

  return inherit( Object, RacingLabModel, {

    // @public
    step: function( dt ) {
      if ( this.runningProperty.value ) {
        this.car1.step( dt );
        this.car2.step( dt );
        //TODO update timeProperty1 (and timeProperty2 ?)
      }
    },

    // @public
    reset: function() {
      this.runningProperty.reset();
      this.car1.reset();
      this.car2.reset();
    },

    // @private resets the race
    resetRace: function() {
      this.runningProperty.reset();
      this.car1.resetRace();
      this.car2.resetRace();
    }
  } );
} );
