// Copyright 2017, University of Colorado Boulder

/**
 * Button used to start and stop a race in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanRoundToggleButton = require( 'SUN/buttons/BooleanRoundToggleButton' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StopSignNode = require( 'SCENERY_PHET/StopSignNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var goButtonIconImage = require( 'image!UNIT_RATES/go_button_icon.png' );

  /**
   * @param {Property.<boolean>} runningProperty
   * @param {Object} [options]
   * @constructor
   */
  function StartStopButton( runningProperty, options ) {

    var self = this;

    options = _.extend( {
      radius: 45
    }, options );

    var goIcon = new Image( goButtonIconImage, { scale: 0.5 } );
    var stopIcon = new StopSignNode( { fillRadius: 25 } );

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