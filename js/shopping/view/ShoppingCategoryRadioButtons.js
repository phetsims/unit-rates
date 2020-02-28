// Copyright 2016-2020, University of Colorado Boulder

/**
 * Radio buttons for selecting a category of items in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import URColors from '../../common/URColors.js';
import unitRates from '../../unitRates.js';

/**
 * @param {ShoppingCategory[]} categories
 * @param {Property.<ShoppingCategory>} categoryProperty
 * @param {Object} [options]
 * @constructor
 */
function ShoppingCategoryRadioButtons( categories, categoryProperty, options ) {

  options = merge( {

    // RadioButtonGroup options
    orientation: 'horizontal',
    baseColor: URColors.categoryButton,
    spacing: 12,
    buttonContentXMargin: 5,
    buttonContentYMargin: 5
  }, options );

  // describe a radio button for each category
  const contentArray = [];
  categories.forEach( function( category ) {
    contentArray.push( {
      value: category,
      node: new Image( category.image, { scale: 0.5 } )
    } );
  } );

  RadioButtonGroup.call( this, categoryProperty, contentArray, options );
}

unitRates.register( 'ShoppingCategoryRadioButtons', ShoppingCategoryRadioButtons );

inherit( RadioButtonGroup, ShoppingCategoryRadioButtons );
export default ShoppingCategoryRadioButtons;