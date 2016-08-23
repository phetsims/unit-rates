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
      type:   'apple',
      rate:   new Property( 0.5 )
    },
    LEMONS: {
      type:   'lemon',
      rate:   new Property( 0.25 )
    },
    ORANGES: {
      type:   'orange',
      rate:   new Property( 0.75 )
    },
    PEARS: {
      type:   'pear',
      rate:   new Property( 0.4 )
    },
    CARROTS:{
      type:   'carrot',
      rate:   new Property( 0.15 )
    },
    CUCUMBERS: {
      type:   'cucumber',
      rate:   new Property( 0.22 )
    },
    POTATOES: {
      type:   'potato',
      rate:   new Property( 0.45 )
    },
    TOMATOES: {
      type:   'tomato',
      rate:   new Property( 0.3 )
    },
    PURPLE_CANDY: {
      type:   'purpleCandy',
      rate:   new Property( 5.40 )
    },
    RED_CANDY: {
      type:   'redCandy',
      rate:   new Property( 3.80 )
    },
    GREEN_CANDY: {
      type:   'greenCandy',
      rate:   new Property( 8.20 )
    },
    BLUE_CANDY: {
      type:   'blueCandy',
      rate:   new Property( 1.30 )
    }
  } );

  unitRates.register( 'ItemData', ItemData );

  return ItemData;
} );

