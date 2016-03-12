// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // FIXME: roll name,enum,image,rate,weight into Object?

  var ItemType = Object.freeze( {
    APPLES: 'Apples',
    LEMONS: 'Lemons',
    ORANGES: 'Oranges',
    PEARS: 'Pears'
  } );

  unitRates.register( 'ItemType', ItemType );

  return ItemType;
} );


