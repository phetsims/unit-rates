// Copyright 2002-2016, University of Colorado Boulder

/**
 * Container for all supported items & assocaited static attributes (type,unit,rate)
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  var ItemData = Object.freeze( {
    APPLES: {
      type: 'apple',
      rate: 0.5,
      weight: 1
    },
    LEMONS: {
      type: 'lemon',
      rate: 0.25,
      weight: 1
    },
    ORANGES: {
      type: 'orange',
      rate: 0.75,
      weight: 1
    },
    PEARS: {
      type: 'pear',
      rate: 0.4,
      weight: 1
    },
    CARROTS:{
      type: 'carrot',
      rate: 0.15,
      weight: 1
    },
    CUCUMBERS: {
      type: 'cucumber',
      rate: 0.22,
      weight: 1
    },
    POTATOES: {
      type: 'potato',
      rate: 0.45,
      weight: 1
    },
    TOMATOES: {
      type: 'tomato',
      rate: 0.3,
      weight: 1
    },
    RED_CANDY: {
      type: 'redCandy',
      rate: 0.5,
      weight: 1
    },
    YELLOW_CANDY: {
      type: 'yellowCandy',
      rate: 0.5,
      weight: 1
    },
    GREEN_CANDY: {
      type: 'greenCandy',
      rate: 0.7,
      weight: 1
    },
    BLUE_CANDY: {
      type: 'blueCandy',
      rate: 0.4,
      weight: 1
    }
  } );

  unitRates.register( 'ItemData', ItemData );

  return ItemData;
} );

