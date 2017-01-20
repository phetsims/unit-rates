// Copyright 2017, University of Colorado Boulder

/**
 * Model of a bag of shopping items.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var Movable = require( 'UNIT_RATES/common/model/Movable' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {HTMLImageElement} bagImage - image used by the view to represent this bag
   * @param {HTMLImageElement} itemImage - image used by the view to represent the items in the bag
   * @param {Object} [options]
   * @constructor
   */
  function Bag( bagImage, itemImage, options ) {

    options = _.extend( {
      bagsOpen: false, // {boolean} do bags 'open' to produce items?
      quantity: 4  // {number} quantity that the bag contains
    }, options );

    // @public (read-only)
    this.bagImage = bagImage;
    this.itemImage = itemImage;
    this.quantity = options.quantity;

    Movable.call( this, options );

    // @private
    this.disposeBag = function() {
      //TODO if ( options.bagsOpen ) { create options.quantity ShoppingItem instances and notify observers }
    };
  }

  unitRates.register( 'Movable', Movable );

  return inherit( Movable, Bag, {

    // @public
    dispose: function() {
      Movable.prototype.dispose.call( this );
      this.disposeBag();
    }
  } );
} );
