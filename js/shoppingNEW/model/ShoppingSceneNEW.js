// Copyright 2016, University of Colorado Boulder

/**
 * A scene in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {string} name - internal name of the scene, not visible to the user
   * @param {HTMLImageElement} image - image used to represent the scene
   * @param {ShoppingItem[]} shoppingItems - items in this scene
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingSceneNEW( name, image, shoppingItems, options ) {

    assert && assert( shoppingItems.length > 0, 'at least 1 ShoppingItem is required' );

    options = _.extend( {

      // index of the item that is initially selected, randomly chosen
      shoppingItemIndex: phet.joist.random.nextIntBetween( 0, shoppingItems.length - 1 )
    }, options );

    // validate options
    assert && assert( options.shoppingItemIndex >= 0 && options.shoppingItemIndex < shoppingItems.length,
      'invalid shoppingItemIndex: ' + options.shoppingItemIndex );

    // @public (read-only)
    this.name = name;
    this.image = image;
    this.shoppingItems = shoppingItems;
    this.shoppingItemProperty = new Property( shoppingItems[ options.shoppingItemIndex ] );
  }

  unitRates.register( 'ShoppingSceneNEW', ShoppingSceneNEW );

  return inherit( Object, ShoppingSceneNEW, {

    // @public
    reset: function() {

      // Reset all shopping items
      this.shoppingItems.forEach( function( shoppingItem ) {
        //TODO shoppingItem.reset();
      } );

      // Randomly choose an item
      var shoppingItemIndex = phet.joist.random.nextIntBetween( 0, this.shoppingItems.length - 1 );
      this.shoppingItemProperty.value = this.shoppingItems[ shoppingItemIndex ];
    }
  } );
} );
