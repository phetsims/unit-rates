// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {RacingLabModel} model
   * @constructor
   */
  function RacingLabScreenView( model ) {

    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  unitRates.register( 'RacingLabScreenView', RacingLabScreenView );

  return inherit( ScreenView, RacingLabScreenView, {

  } ); // inherit

} ); // define
