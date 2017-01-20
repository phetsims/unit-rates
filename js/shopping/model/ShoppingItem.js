// Copyright 2017, University of Colorado Boulder

/**
 * Model of a shopping item.
 * Origin is at the bottom center of the item.
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
   * @param {HTMLImageElement} image - image used by the view to represent this item
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItem( image, options ) {

    // @public (read-only)
    this.image = image;

    Movable.call( this, options );

    // @private
    this.disposeShoppingItem = function() {
      //TODO
    };
  }

  unitRates.register( 'ShoppingItem', ShoppingItem );

  return inherit( Movable, ShoppingItem, {

    // @public
    dispose: function() {
      Movable.prototype.dispose.call( this );
      this.disposeShoppingItem();
    }
  } );
} );
