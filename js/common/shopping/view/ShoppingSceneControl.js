// Copyright 2016, University of Colorado Boulder

/**
 * Control for selecting a shopping scene.
 * Instances of this object exist for the lifetime of the simulation, so dispose is not needed.
 *
 * @author Dave Schmitz (Schmitzware)
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
  var appleImage = require( 'image!UNIT_RATES/apple.png' );
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );

  /**
   * @param {Property.<string>} sceneProperty
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingSceneControl( sceneProperty, options ) {

    options = _.extend( {
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 12,
      buttonContentXMargin: 5,
      buttonContentYMargin: 5
    }, options );

    RadioButtonGroup.call( this, sceneProperty, [
      { value: 'fruit', node: createIcon( appleImage ) },
      { value: 'produce', node: createIcon( carrotImage ) },
      { value: 'candy', node: createIcon( purpleCandyImage ) }
    ], options );
  }

  unitRates.register( 'ShoppingSceneControl', ShoppingSceneControl );

  /**
   * Creates the icon associated with a scene.
   * @param {HTMLImageElement} image
   * @returns {Node}
   */
  function createIcon( image ) {
    return new Image( image, { scale: 0.5 } );
  }

  return inherit( RadioButtonGroup, ShoppingSceneControl );
} );
