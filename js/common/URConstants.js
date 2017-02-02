// Copyright 2017, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Range = require( 'DOT/Range' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  var URConstants = {

    // screen
    SCREEN_X_MARGIN: 15,
    SCREEN_Y_MARGIN: 15,

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
    },

    // options shared by all NumberPickers
    NUMBER_PICKER_OPTIONS: {
      xMargin: 8,
      cornerRadius: 4
    },

    //TODO what is the correct range for Shopping rate spinners? see #141
    // range for Rate spinners
    COST_RANGE: new Range( 1, 30 ),
    QUANTITY_RANGE: new Range( 1, 30 ),
    MILES_RANGE: new Range( 20, 100 ),
    HOURS_RANGE: new Range( 1, 10 )

  };

  unitRates.register( 'URConstants', URConstants );

  return URConstants;
} );
