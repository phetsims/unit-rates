// Copyright 2002-2016, University of Colorado Boulder

/**
 * Container for all supported items & assocaited attributes (type & rate)
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Property = require( 'AXON/Property' );

  var ItemData = Object( {
    APPLES: {
      type:     'apple',
      rate:     new Property( 0.5 ),
      maxCount: 16
    },
    LEMONS: {
      type:     'lemon',
      rate:     new Property( 0.25 ),
      maxCount: 16
    },
    ORANGES: {
      type:     'orange',
      rate:     new Property( 0.75 ),
      maxCount: 16
    },
    PEARS: {
      type:     'pear',
      rate:     new Property( 0.4 ),
      maxCount: 16
    },
    CARROTS:{
      type:     'carrot',
      rate:     new Property( 0.15 ),
      maxCount: 16
    },
    CUCUMBERS: {
      type:     'cucumber',
      rate:     new Property( 0.22 ),
      maxCount: 12
    },
    POTATOES: {
      type:     'potato',
      rate:     new Property( 0.45 ),
      maxCount: 12
    },
    TOMATOES: {
      type:     'tomato',
      rate:     new Property( 0.3 ),
      maxCount: 16
    },
    PURPLE_CANDY: {
      type:     'purpleCandy',
      rate:     new Property( 5.40 ),
      maxCount: 1.6
    },
    RED_CANDY: {
      type:     'redCandy',
      rate:     new Property( 3.80 ),
      maxCount: 1.2
    },
    GREEN_CANDY: {
      type:     'greenCandy',
      rate:     new Property( 8.20 ),
      maxCount: 1.2
    },
    BLUE_CANDY: {
      type:     'blueCandy',
      rate:     new Property( 1.30 ),
      maxCount: 1.6
    }
  } );

  unitRates.register( 'ItemData', ItemData );

  return ItemData;
} );

