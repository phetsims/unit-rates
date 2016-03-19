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
  var PropertySet = require( 'AXON/PropertySet' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemCollection = require( 'UNIT_RATES/shopping/model/ItemCollection' );

  /**
   *
   * {Property.<ItemType>} itemTypeProperty
   * @constructor
   */
  function Shelf( itemTypeProperty ) {

    // @public (all)
    ItemCollection.call( this, itemTypeProperty, {
    } );
  }

  unitRates.register( 'Shelf', Shelf );

  return inherit( ItemCollection, Shelf, {

    // Resets all model elements
    reset: function() {
      ItemCollection.prototype.reset.call( this );
    }

  } );

} );
