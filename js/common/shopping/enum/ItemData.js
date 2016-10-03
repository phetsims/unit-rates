// Copyright 2016, University of Colorado Boulder

/**
 * Container for all supported shopping items
 * type = the item type (duh)
 * rate = the default unit rate
 * maxUnits = the maximum number of items that should appear on the bottom number line (item count | weight )
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  var ItemData = Object( {
    APPLES: {
      type: 'apple',
      rate: 0.5,
      maxUnit: 16
    },
    LEMONS: {
      type: 'lemon',
      rate: 0.25,
      maxUnit: 16
    },
    ORANGES: {
      type: 'orange',
      rate: 0.75,
      maxUnit: 16
    },
    PEARS: {
      type: 'pear',
      rate: 0.4,
      maxUnit: 16
    },
    CARROTS: {
      type: 'carrot',
      rate: 0.15,
      maxUnit: 16
    },
    CUCUMBERS: {
      type: 'cucumber',
      rate: 0.22,
      maxUnit: 12
    },
    POTATOES: {
      type: 'potato',
      rate: 0.45,
      maxUnit: 12
    },
    TOMATOES: {
      type: 'tomato',
      rate: 0.3,
      maxUnit: 16
    },
    PURPLE_CANDY: {
      type: 'purpleCandy',
      rate: 5.40,
      maxUnit: 1.6
    },
    RED_CANDY: {
      type: 'redCandy',
      rate: 3.80,
      maxUnit: 1.2
    },
    GREEN_CANDY: {
      type: 'greenCandy',
      rate: 8.20,
      maxUnit: 1.2
    },
    BLUE_CANDY: {
      type: 'blueCandy',
      rate: 1.30,
      maxUnit: 1.6
    }
  } );

  unitRates.register( 'ItemData', ItemData );

  return ItemData;
} );

