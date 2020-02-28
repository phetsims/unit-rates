// Copyright 2016-2020, University of Colorado Boulder

/**
 * Scene control for the 'Racing Screen', switches between 1 and 2 cars.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import blueCarImage from '../../../images/blue_car_png.js';
import redCarImage from '../../../images/red_car_png.js';
import unitRates from '../../unitRates.js';

/**
 * @param {Property.<boolean>} car2VisibleProperty - is car2 visible?
 * @param {Object} [options]
 * @constructor
 */
function RacingLabSceneControl( car2VisibleProperty, options ) {

  options = merge( {

    // RacingLabSceneControl options
    buttonWidth: 68,

    // RadioButtonGroup options
    orientation: 'vertical',
    baseColor: 'white',
    buttonContentXMargin: 12,
    buttonContentYMargin: 10,
    spacing: 11 // space between the buttons

  }, options );

  const maxCarWidth = options.buttonWidth - ( 2 * options.buttonContentXMargin );

  RadioButtonGroup.call( this, car2VisibleProperty, [
    { value: false, node: createOneCarIcon( maxCarWidth ) },
    { value: true, node: createTwoCarsIcon( maxCarWidth ) }
  ], options );
}

unitRates.register( 'RacingLabSceneControl', RacingLabSceneControl );

/**
 * Creates the icon for the 1-car scene, scaled to fit a specified width.
 * @param {number} maxCarWidth
 * @returns {Node}
 */
function createOneCarIcon( maxCarWidth ) {
  return createCarImage( redCarImage, maxCarWidth );
}

/**
 * Creates the icon for the 2-cars scene, scaled to fit a specified width.
 * @param {number} maxCarWidth
 * @returns {Node}
 */
function createTwoCarsIcon( maxCarWidth ) {
  return new VBox( {
    spacing: 7, // space between the 2 cars
    children: [
      createCarImage( redCarImage, maxCarWidth ),
      createCarImage( blueCarImage, maxCarWidth )
    ]
  } );
}

/**
 * Creates a car icon, scaled to fit a specified width.
 * @param {HTMLImageElement} imageFile
 * @param {number} maxCarWidth
 * @returns {Node}
 */
function createCarImage( imageFile, maxCarWidth ) {
  const carImage = new Image( imageFile );
  carImage.setScaleMagnitude( maxCarWidth / carImage.width );
  return carImage;
}

inherit( RadioButtonGroup, RacingLabSceneControl );
export default RacingLabSceneControl;