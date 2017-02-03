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
  var URFont = require( 'UNIT_RATES/common/URFont' );

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
      titleXMargin: 10,
      titleYMargin: 4,
      showTitleWhenExpanded: true,
      fill: 'white',
      cornerRadius: 5,
      buttonLength: 16,
      buttonXMargin: 10,
      buttonYMargin: 4,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,
      contentXMargin: 10,
      contentYMargin: 6,
      contentYSpacing: 0
    },

    // options shared by all NumberPickers
    NUMBER_PICKER_OPTIONS: {
      xMargin: 8,
      cornerRadius: 4
    },

    RACING_LAB_PICKER_FONT: new URFont( 20 ),

    //TODO what is the correct range for Shopping rate spinners? see #141
    // ranges for Rate spinners
    COST_RANGE: new Range( 1, 30 ),
    QUANTITY_RANGE: new Range( 1, 30 ),
    MILES_RANGE: new Range( 20, 100 ),
    HOURS_RANGE: new Range( 1, 10 ),

    // markers on the double number line
    MAJOR_MARKER_LENGTH: 55,
    MINOR_MARKER_LENGTH: 30,
    MARKER_Y_SPACING: 1  // space between the marker line and its values
  };

  unitRates.register( 'URConstants', URConstants );

  return URConstants;
} );
