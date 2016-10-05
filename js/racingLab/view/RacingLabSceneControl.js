// Copyright 2016, University of Colorado Boulder

/**
 * Scene control for the 'Racing Screen', switches between 1 and 2 cars.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  // var blueCarImage = require( 'image!UNIT_RATES/blue_car.png' );
  // var redCarImage = require( 'image!UNIT_RATES/red_car.png' );
  var oneCarSceneImage = require( 'image!UNIT_RATES/one_car_scene.png' );
  var twoCarSceneImage = require( 'image!UNIT_RATES/two_car_scene.png' );

  /**
   * @param {Property.<number>} trackCountProperty
   * @param {Object} [options]
   * @constructor
   */
  function RacingLabSceneControl( trackCountProperty, options ) {
    RadioButtonGroup.call( this, trackCountProperty, [
      { value: 1, node: new Image( oneCarSceneImage, { scale: 0.22 } ) },
      { value: 2, node: new Image( twoCarSceneImage, { scale: 0.22 } ) }
    ], options );
  }

  unitRates.register( 'RacingLabSceneControl', RacingLabSceneControl );

  return inherit( RadioButtonGroup, RacingLabSceneControl );
} );