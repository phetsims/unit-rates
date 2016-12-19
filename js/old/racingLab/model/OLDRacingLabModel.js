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

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var OLDTrackGroup = require( 'UNIT_RATES/old/racingLab/model/OLDTrackGroup' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} options
   * @constructor
   */
  function OLDRacingLabModel( options ) {

    options = _.extend( {
       trackCount: 1
    }, options );

    // validate options
    assert && assert( options.trackCount === 1 || options.trackCount === 2, 'invalid trackCount: ' + options.trackCount );

    //TODO visibility annotations
    this.trackCountProperty = new Property( options.trackCount ); // number of cars or tracks
    this.runningProperty = new Property( false ); // is a race currently running
    this.elapsedTimeProperty = new Property( 0 ); // elapsed time in hours
    this.flagArrowsVisibleProperty = new Property( true ); // are the green flags around the finish flag visible

    var self = this;

    // @public - group models
    this.trackGroup1 = new OLDTrackGroup( this.elapsedTimeProperty, this.flagArrowsVisibleProperty );
    this.trackGroup2 = new OLDTrackGroup( this.elapsedTimeProperty, this.flagArrowsVisibleProperty );

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

  unitRates.register( 'OLDRacingLabModel', OLDRacingLabModel );

  return inherit( Object, OLDRacingLabModel, {

    // no dispose, persists for the lifetime of the sim.

    // @public
    reset: function() {

      // reset Properties
      this.trackCountProperty.reset();
      this.runningProperty.reset();
      this.elapsedTimeProperty.reset();
      this.flagArrowsVisibleProperty.reset();

      this.trackGroup1.reset();
      this.trackGroup2.reset();
      this.restart();
    },

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
    }

  } ); // inherit

} ); // define
