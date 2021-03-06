// Copyright 2016-2020, University of Colorado Boulder

/**
 * NumberOfCarsRadioButtonGroup switches between 1 and 2 cars in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import blueCarImage from '../../../images/blue_car_png.js';
import redCarImage from '../../../images/red_car_png.js';
import unitRates from '../../unitRates.js';

class NumberOfCarsRadioButtonGroup extends RectangularRadioButtonGroup {

  /**
   * @param {Property.<boolean>} car2VisibleProperty - is car2 visible?
   * @param {Object} [options]
   */
  constructor( car2VisibleProperty, options ) {

    options = merge( {

      // NumberOfCarsRadioButtonGroup options
      buttonWidth: 68,

      // RectangularRadioButtonGroup options
      orientation: 'vertical',
      baseColor: 'white',
      buttonContentXMargin: 12,
      buttonContentYMargin: 10,
      spacing: 11 // space between the buttons

    }, options );

    const maxCarWidth = options.buttonWidth - ( 2 * options.buttonContentXMargin );

    super( car2VisibleProperty, [
      { value: false, node: createOneCarIcon( maxCarWidth ) },
      { value: true, node: createTwoCarsIcon( maxCarWidth ) }
    ], options );
  }
}

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

unitRates.register( 'NumberOfCarsRadioButtonGroup', NumberOfCarsRadioButtonGroup );
export default NumberOfCarsRadioButtonGroup;