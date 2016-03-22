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
  var ItemCollection = require( 'UNIT_RATES/shopping/model/ItemCollection' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var Random = require( 'DOT/Random' );

  // contants
  var RAND = new Random();

  /**
   *
   * @constructor
   */
  function Shelf( itemDataProperty ) {

    ItemCollection.call( this );

    this.itemDataProperty = itemDataProperty;
    this.populate();
  }

  unitRates.register( 'Shelf', Shelf );

  return inherit( ItemCollection, Shelf, {

    /**
     * Populates all item types
     * @private
     */
    populate: function() {

      // FIXME: populate all item types
      for (var key in ItemData) {
        var itemData = ItemData[ key ];
        var itemCount = RAND.random() * 10;
        for (var i = 0; i < itemCount; i++) {
          this.createItem( itemData.type, 1, itemData.rate );
        }
      }
    },

    /**
     * Resets all model elements
     * @private
     */
   reset: function() {
      ItemCollection.prototype.reset.call( this );
      this.populate();
    }

  } );

} );
