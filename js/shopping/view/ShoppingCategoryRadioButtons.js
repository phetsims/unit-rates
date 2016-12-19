// Copyright 2016, University of Colorado Boulder

/**
 * Radio buttons for selecting a category of items in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingCategory[]} categories
   * @param {Property.<ShoppingCategory>} categoryProperty
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingCategoryRadioButtons( categories, categoryProperty, options ) {

    options = _.extend( {
      orientation: 'horizontal',
      baseColor: 'white',
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