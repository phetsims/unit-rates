// Copyright 2016-2017, University of Colorado Boulder

/**
 * Radio buttons for selecting a category of items in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URColors = require( 'UNIT_RATES/common/URColors' );

  /**
   * @param {ShoppingCategory[]} categories
   * @param {Property.<ShoppingCategory>} categoryProperty
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingCategoryRadioButtons( categories, categoryProperty, options ) {

    options = _.extend( {

      // RadioButtonGroup options
      orientation: 'horizontal',
      baseColor: URColors.categoryButton,
      spacing: 12,
      buttonContentXMargin: 5,
      buttonContentYMargin: 5
    }, options );

    // describe a radio button for each category
    var contentArray = [];
    categories.forEach( function( category ) {
      contentArray.push( {
        value: category,
        node: new Image( category.image, { scale: 0.5 } )
      } );
    } );

    RadioButtonGroup.call( this, categoryProperty, contentArray, options );
  }

  unitRates.register( 'ShoppingCategoryRadioButtons', ShoppingCategoryRadioButtons );

  return inherit( RadioButtonGroup, ShoppingCategoryRadioButtons );
} );
