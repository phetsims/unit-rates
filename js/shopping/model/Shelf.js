// Copyright 2002-2016, University of Colorado Boulder

/**
 * All the items currently on the shelf
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var ItemCollection = require( 'UNIT_RATES/shopping/model/ItemCollection' );
  var ItemType = require( 'UNIT_RATES/shopping/enum/ItemType' );
  var Random = require( 'DOT/Random' );

  // contants
  var RAND = new Random();

  /**
   *
   * {Property.<ItemType>} itemTypeProperty
   * @constructor
   */
  function Shelf( itemTypeProperty ) {

    // @public (all)
    ItemCollection.call( this, itemTypeProperty );

    this.populate();
  }

  unitRates.register( 'Shelf', Shelf );

  return inherit( ItemCollection, Shelf, {

    // Resets all model elements
    populate: function() {

      // FIXME: populate all item types
      for (var key in ItemType) {
        var itemCount = RAND.random() * 10;
        for (var i = 0; i < itemCount; i++) {
          this.createItem( ItemType[key], 1, ShoppingConstants.APPLE_RATE );
        }
      }
    },

    // Resets all model elements
    reset: function() {
      ItemCollection.prototype.reset.call( this );
      this.populate();
    }

  } );

} );
