// Copyright 2016-2023, University of Colorado Boulder

/**
 * Radio button group for selecting a category of items in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Image, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import URColors from '../../common/URColors.js';
import unitRates from '../../unitRates.js';
import ShoppingCategory from '../model/ShoppingCategory.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type ShoppingCategoryRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions;

export default class ShoppingCategoryRadioButtonGroup extends RectangularRadioButtonGroup<ShoppingCategory> {

  public constructor( categories: ShoppingCategory[],
                      categoryProperty: Property<ShoppingCategory>,
                      providedOptions?: ShoppingCategoryRadioButtonGroupOptions ) {

    const options = optionize<ShoppingCategoryRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {

      // RectangularRadioButtonGroupOptions
      orientation: 'horizontal',
      spacing: 12,
      radioButtonOptions: {
        baseColor: URColors.categoryButtonColorProperty,
        xMargin: 5,
        yMargin: 5
      }
    }, providedOptions );

    // describe a radio button for each category
    const items: RectangularRadioButtonGroupItem<ShoppingCategory>[] = categories.map( category => {
      return {
        value: category,
        createNode: () => new Image( category.image, { scale: 0.5 } )
      };
    } );

    super( categoryProperty, items, options );
  }
}

unitRates.register( 'ShoppingCategoryRadioButtonGroup', ShoppingCategoryRadioButtonGroup );