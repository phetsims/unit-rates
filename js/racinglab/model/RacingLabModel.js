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
  var URColors = require( 'UNIT_RATES/common/URColors' );

  // images
  var blueCarImage = require( 'image!UNIT_RATES/blue_car.png' );
  var redCarImage = require( 'image!UNIT_RATES/red_car.png' );

  /**
   * @constructor
   */
  function RacingLabModel() {

    var self = this;

    // @public is the race running?
    this.runningProperty = new Property( false );

    // @public the red (top) car
    this.car1 = new RaceCar( redCarImage, {
      color: URColors.car1,
      trackLength: 150
    } );

    // @public the blue (bottom) car
    this.car2 = new RaceCar( blueCarImage, {
      color: URColors.car2,
      trackLength: 100,
      visible: false
    } );

    // When both cars reach the finish line, stop the race.
    Property.lazyMultilink( [ this.car1.distanceProperty, this.car2.distanceProperty ],
      function( distance1, distance2 ) {
        if ( self.car1.isAtFinish() && ( !self.car2.visibleProperty.value || self.car2.isAtFinish() ) ) {
          self.runningProperty.value = false;
        }
      } );

    // If both cars are at the finish line, changing the state to running restarts the race. unlink not needed.
    this.runningProperty.link( function( running ) {
      if ( running && self.car1.isAtFinish() && ( !self.car2.visibleProperty.value || self.car2.isAtFinish() ) ) {
        self.car1.resetRace();
        self.car2.resetRace();
      }
    } );

    // Reset the race when any of these Properties is changed. unmultilink not needed
    // See https://github.com/phetsims/unit-rates/issues/93
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

    /**
     * Updates time-dependent parts of the model.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {
      if ( this.runningProperty.value ) {
        this.car1.step( dt );
        this.car2.step( dt );
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
