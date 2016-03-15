// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  var SceneMode = Object.freeze( {
    FRUIT: 'Fruit',
    PRODUCE: 'Produce',
    CANDY: 'Candy'
  } );

  unitRates.register( 'SceneMode', SceneMode );

  return SceneMode;
} );


