// Copyright 2017, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  var URConstants = {

    // image scaling
    BAG_IMAGE_SCALE: 0.5,
    SHOPPING_ITEM_IMAGE_SCALE: 0.5,

    // options shared by all AccordionBoxes
    ACCORDION_BOX_OPTIONS: {
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 10,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5
    }

  };

  unitRates.register( 'URConstants', URConstants );

  return URConstants;
} );
