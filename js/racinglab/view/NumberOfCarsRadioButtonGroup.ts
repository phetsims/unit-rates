// Copyright 2016-2023, University of Colorado Boulder

/**
 * NumberOfCarsRadioButtonGroup switches between 1 and 2 cars in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Image, Node, NodeTranslationOptions, VBox } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import blueCar_png from '../../../images/blueCar_png.js';
import redCar_png from '../../../images/redCar_png.js';
import unitRates from '../../unitRates.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';

const RADIO_BUTTON_OPTIONS = {
  baseColor: 'white',
  xMargin: 12,
  yMargin: 10
};

type SelfOptions = {
  buttonWidth?: number;
};
type NumberOfCarsRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions;

export default class NumberOfCarsRadioButtonGroup extends RectangularRadioButtonGroup<boolean> {

  /**
   * @param car2VisibleProperty - is car2 visible?
   * @param [providedOptions]
   */
  public constructor( car2VisibleProperty: BooleanProperty, providedOptions?: NumberOfCarsRadioButtonGroupOptions ) {

    const options = optionize<NumberOfCarsRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {

      // SelfOptions
      buttonWidth: 68,

      // RectangularRadioButtonGroupOptions
      orientation: 'vertical',
      spacing: 11,
      radioButtonOptions: RADIO_BUTTON_OPTIONS
    }, providedOptions );

    const maxCarWidth = options.buttonWidth - ( 2 * RADIO_BUTTON_OPTIONS.xMargin );

    const items: RectangularRadioButtonGroupItem<boolean>[] = [
      { value: false, createNode: () => createOneCarIcon( maxCarWidth ) },
      { value: true, createNode: () => createTwoCarsIcon( maxCarWidth ) }
    ];

    super( car2VisibleProperty, items, options );
  }
}

/**
 * Creates the icon for the 1-car scene, scaled to fit a specified width.
 */
function createOneCarIcon( maxCarWidth: number ): Node {
  return createCarImage( redCar_png, maxCarWidth );
}

/**
 * Creates the icon for the 2-cars scene, scaled to fit a specified width.
 */
function createTwoCarsIcon( maxCarWidth: number ): Node {
  return new VBox( {
    spacing: 7, // space between the 2 cars
    children: [
      createCarImage( redCar_png, maxCarWidth ),
      createCarImage( blueCar_png, maxCarWidth )
    ]
  } );
}

/**
 * Creates a car icon, scaled to fit a specified width.
 */
function createCarImage( imageFile: HTMLImageElement, maxCarWidth: number ): Node {
  const carImage = new Image( imageFile );
  carImage.setScaleMagnitude( maxCarWidth / carImage.width );
  return carImage;
}

unitRates.register( 'NumberOfCarsRadioButtonGroup', NumberOfCarsRadioButtonGroup );