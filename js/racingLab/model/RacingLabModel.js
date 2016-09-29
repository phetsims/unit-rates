// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var RacingLabConstants = require( 'UNIT_RATES/racingLab/RacingLabConstants' );
  var TrackGroup = require( 'UNIT_RATES/racingLab/model/TrackGroup' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function RacingLabModel() {

    PropertySet.call( this, {
      carCount:           1,
      running:            false,
      elapsedTime:        0.0,
      flagArrowsVisible:  true
    } );

    var self = this;

    // @public - group models
    this.trackGroup1 = new TrackGroup( this.elapsedTimeProperty, this.flagArrowsVisibleProperty );
    this.trackGroup2 = new TrackGroup( this.elapsedTimeProperty, this.flagArrowsVisibleProperty );

    // update running state
    Property.lazyMultilink( [ this.trackGroup1.carFinishedProperty, this.trackGroup2.carFinishedProperty ],
      function( car1Finished, car2Finished ) {
        if( self.carCountProperty.value === 1 ) {
          self.runningProperty.value = !car1Finished;
        }
        else if( self.carCountProperty.value === 2 ) {
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
     * @return {boolean}
     * @public
     */
    atStart: function() {
      return ( this.elapsedTimeProperty.value === 0.0 );
    },

    /**
     * {number} dt - time step
     * @public
     */
    step: function( dt ) {
      if ( this.runningProperty.value && dt < 1 ) {
        // Scale sim dt to slow things down
        var scaleDt = ( dt / RacingLabConstants.RACING_DT_SCALE );
        this.elapsedTimeProperty.value += scaleDt;
      }
    },

    /**
     * Restarts both tracks - car at start line, elapsed time = 0.
     * @public
     */
    restart: function() {
      this.trackGroup1.restart();
      this.trackGroup2.restart();
      this.runningProperty.reset();
      this.elapsedTimeProperty.reset();
    },

    /**
     * Resets the challenges questions to all unanswered
     * @public
     */
    reset: function() {
      this.trackGroup1.reset();
      this.trackGroup2.reset();
      PropertySet.prototype.reset.call( this );
    }

  } ); // inherit

} ); // define
