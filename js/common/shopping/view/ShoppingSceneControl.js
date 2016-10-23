// Copyright 2016, University of Colorado Boulder

/**
 * Control for selecting a shopping scene.
 * Instances of this object exist for the lifetime of the simulation, so dispose is not needed.
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

  /**
   * @param {ShoppingScene[]} scenes
   * @param {Property.<string>} sceneProperty
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingSceneControl( scenes, sceneProperty, options ) {

    options = _.extend( {
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 12,
      buttonContentXMargin: 5,
      buttonContentYMargin: 5
    }, options );

    // describe a radio button for each scene
    var contentArray = [];
    scenes.forEach( function( scene ) {
      contentArray.push( {
        value: scene,
        node: new Image( scene.image, { scale: 0.5 } )
      } );
    } );

    RadioButtonGroup.call( this, sceneProperty, contentArray, options );
  }

  unitRates.register( 'ShoppingSceneControl', ShoppingSceneControl );

  return inherit( RadioButtonGroup, ShoppingSceneControl );
} );