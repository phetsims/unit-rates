// Copyright 2016, University of Colorado Boulder

/**
 * Model for the 'Racing Lab' screen.
 * The Racing lab model contains the 2 individual track models and uses those to determine when both races are finished.
 * It also scales the simulation dt values to slow down the overall simulation.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var TrackGroup = require( 'UNIT_RATES/racingLab/model/TrackGroup' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @constructor
   */
  function RacingLabModel() {

    PropertySet.call( this, {
      trackCount: 1,        // number of cars or tracks
      running: false,      // is a race currently running
      elapsedTime: 0.0,        // elapsed time in hours
      flagArrowsVisible: true        // are the green flags around teh finish flag visible
    } );

    var self = this;

    // @public - group models
    this.trackGroup1 = new TrackGroup( this.elapsedTimeProperty, this.flagArrowsVisibleProperty );
    this.trackGroup2 = new TrackGroup( this.elapsedTimeProperty, this.flagArrowsVisibleProperty );

    // update race running state
    Property.lazyMultilink( [ this.trackGroup1.carFinishedProperty, this.trackGroup2.carFinishedProperty ],
      function( car1Finished, car2Finished ) {
        if ( self.trackCountProperty.value === 1 ) {
          self.runningProperty.value = !car1Finished;
        }
        else if ( self.trackCountProperty.value === 2 ) {
          self.runningProperty.value = !( car1Finished && car2Finished );
        }
        else {
          assert && assert( false, 'Invalid car count' );
        }
      } );
  }

  unitRates.register( 'RacingLabModel', RacingLabModel );

  return inherit( PropertySet, RacingLabModel, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Returns if the model is in the start position or not
     *
     * @return {boolean}
     * @public
     */
    atStart: function() {
      return ( this.elapsedTimeProperty.value === 0.0 );
    },

    /**
     * Simulation time step
     *
     * {number} dt - time step
     * @public
     */
    step: function( dt ) {
      if ( this.runningProperty.value && dt < 1 ) {
        // Scale sim dt to slow things down
        this.elapsedTimeProperty.value += ( dt / 1.75 );
      }
    },

    /**
     * Restarts both tracks - car at start line, elapsed time = 0.
     *
     * @public
     */
    restart: function() {
      this.trackGroup1.restart();
      this.trackGroup2.restart();
      this.runningProperty.reset();
      this.elapsedTimeProperty.reset();
    },

    // @public
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.trackGroup1.reset();
      this.trackGroup2.reset();
      this.restart();
    }

  } ); // inherit

} ); // define
