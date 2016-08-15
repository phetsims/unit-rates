// Copyright 2002-2016, University of Colorado Boulder

/**
 * Container for all supported items & assocaited static attributes (type,unit,rate)
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // FIXME: weight may be removed - waiting for design document clearifications

  var ItemData = Object.freeze( {
    APPLES: {
      type:   'apple',
      rate:   0.5,
      weight: 1.0
    },
    LEMONS: {
      type:   'lemon',
      rate:   0.25,
      weight: 1.0
    },
    ORANGES: {
      type:   'orange',
      rate:   0.75,
      weight: 1.0
    },
    PEARS: {
      type:   'pear',
      rate:   0.4,
      weight: 1.0
    },
    CARROTS:{
      type:   'carrot',
      rate:   0.15,
      weight: 1.0
    },
    CUCUMBERS: {
      type:   'cucumber',
      rate:   0.22,
      weight: 1.0
    },
    POTATOES: {
      type:   'potato',
      rate:   0.45,
      weight: 1.0
    },
    TOMATOES: {
      type:   'tomato',
      rate:   0.3,
      weight: 1.0
    },
    PURPLE_CANDY: {
      type:   'purpleCandy',
      rate:   5.40,
      weight: 1.0
    },
    RED_CANDY: {
      type:   'redCandy',
      rate:   3.80,
      weight: 1.0
    },
    GREEN_CANDY: {
      type:   'greenCandy',
      rate:   8.20,
      weight: 1.0
    },
    BLUE_CANDY: {
      type:   'blueCandy',
      rate:   1.30,
      weight: 1.0
    }
  } );

  unitRates.register( 'ItemData', ItemData );

  return ItemData;
} );

