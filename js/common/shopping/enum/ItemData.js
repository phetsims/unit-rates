// Copyright 2002-2016, University of Colorado Boulder

/**
 * Container for all supported items & assocaited attributes (type & rate)
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  var ItemData = Object( {
    APPLES: {
      type:   'apple',
      rate:   0.5
    },
    LEMONS: {
      type:   'lemon',
      rate:   0.25
    },
    ORANGES: {
      type:   'orange',
      rate:   0.75
    },
    PEARS: {
      type:   'pear',
      rate:   0.4
    },
    CARROTS:{
      type:   'carrot',
      rate:   0.15
    },
    CUCUMBERS: {
      type:   'cucumber',
      rate:   0.22
    },
    POTATOES: {
      type:   'potato',
      rate:   0.45
    },
    TOMATOES: {
      type:   'tomato',
      rate:   0.3
    },
    PURPLE_CANDY: {
      type:   'purpleCandy',
      rate:   5.40
    },
    RED_CANDY: {
      type:   'redCandy',
      rate:   3.80
    },
    GREEN_CANDY: {
      type:   'greenCandy',
      rate:   8.20
    },
    BLUE_CANDY: {
      type:   'blueCandy',
      rate:   1.30
    }
  } );

  unitRates.register( 'ItemData', ItemData );

  return ItemData;
} );

