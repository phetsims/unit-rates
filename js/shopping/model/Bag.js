// Copyright 2017, University of Colorado Boulder

/**
 * Model of a bag that contains shopping items.
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
   * @param {ShoppingItem[]} shoppingItems - the shopping items that are in the bag
   * @param {Object} [options]
   * @constructor
   */
  function Bag( bagImage, shoppingItems, options ) {

    options = _.extend( {
      bagOpens: false // {boolean} do bags 'open' to produce items?
    }, options );

    // @public (read-only)
    this.bagImage = bagImage;
    this.shoppingItems = shoppingItems;

    Movable.call( this, options );

    // @private
    this.disposeBag = function() {

      // dispose of all shopping items that are in the bag
      shoppingItems.forEach( function( shoppingItem ) {
        shoppingItem.dispose();
      } );
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
