// Copyright 2017, University of Colorado Boulder

/**
 * Model of a bag that contains shopping items.
 * Origin is at the bottom center of the bag.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'UNIT_RATES/common/model/Movable' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

  /**
   * @param {number} unitsPerBag
   * @param {HTMLImageElement} image - image used by the view to represent this bag
   * @param {Object} [options]
   * @constructor
   */
  function Bag( unitsPerBag, image, options ) {

    options = _.extend( {

      // {ShoppingItem[]|null} items in the bag, null means the bag does not open when place on the scale
      shoppingItems: null,

      // Movable options
      animationSpeed: URQueryParameters.animationSpeed

    }, options );

    // @public (read-only)
    this.image = image;
    this.unitsPerBag = unitsPerBag;
    this.shoppingItems = options.shoppingItems;

    Movable.call( this, options );

    // @private
    this.disposeBag = function() {

      // dispose of all shopping items that are in the bag
      options.shoppingItems.forEach( function( shoppingItem ) {
        shoppingItem.dispose();
      } );
    };
  }

  unitRates.register( 'Bag', Bag );

  return inherit( Movable, Bag, {

    // @public
    dispose: function() {
      this.disposeBag();
      Movable.prototype.dispose.call( this );
    }
  } );
} );
