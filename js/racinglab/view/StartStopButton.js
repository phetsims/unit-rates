// Copyright 2017, University of Colorado Boulder

/**
 * Button used to start and stop a race in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanRoundToggleButton = require( 'SUN/buttons/BooleanRoundToggleButton' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const StopSignNode = require( 'SCENERY_PHET/StopSignNode' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  const goButtonIconImage = require( 'image!UNIT_RATES/go_button_icon.png' );

  /**
   * @param {Property.<boolean>} runningProperty
   * @param {Object} [options]
   * @constructor
   */
  function StartStopButton( runningProperty, options ) {

    const self = this;

    options = _.extend( {
      radius: 45
    }, options );

    const goIcon = new Image( goButtonIconImage, { scale: 0.5 } );
    const stopIcon = new StopSignNode( { fillRadius: 25 } );

    BooleanRoundToggleButton.call( this, stopIcon, goIcon, runningProperty, options );

    // adjust button color based on runningProperty
    // unlink not needed, exists for sim lifetime
    runningProperty.link( function( running ) {
      self.baseColor = ( running ? '#6D6E70' : '#85d4a6' );
    } );
  }

  unitRates.register( 'StartStopButton', StartStopButton );

  return inherit( BooleanRoundToggleButton, StartStopButton );
} );