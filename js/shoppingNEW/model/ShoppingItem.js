// Copyright 2016, University of Colorado Boulder

/**
 * An item in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} itemDescription - see Fruit.APPLES for an example
   * @constructor
   */
  function ShoppingItem( itemDescription ) {

    // @public (read-only)
    this.unitRate = itemDescription.unitRate;
    this.bagRate = itemDescription.bagRate;
    this.numberOfBags = itemDescription.numberOfBags;
    this.singularName = itemDescription.singularName;
    this.pluralName = itemDescription.pluralName;
    this.denominatorName = itemDescription.denominatorName;
    this.itemImage = itemDescription.itemImage;
    this.bagImage = itemDescription.bagImage;
    this.questions = itemDescription.questions;
  }

  unitRates.register( 'ShoppingItem', ShoppingItem );

  return inherit( Object, ShoppingItem );
} );
