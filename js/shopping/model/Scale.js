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
  var Property = require( 'AXON/Property' );

  /**
   *
   * {Property.<ItemType>} itemTypeProperty
   * @constructor
   */
  function Scale( itemTypeProperty ) {

    // @public (all)
    ItemCollection.call( this, itemTypeProperty, {
    } );

    var self = this;

    this.costProperty = new Property( 0.0 );
    this.weightProperty = new Property( 0.0 );

    // on item change
    this.itemTypeProperty.link( function( type, oldType ) {


    } );
  }

  unitRates.register( 'Scale', Scale );

  return inherit( ItemCollection, Scale, {

    // Resets all model elements
    // @public
    reset: function() {
      ItemCollection.prototype.reset.call( this );
    },

    // @private
    updateValues: function() {
      // FIXME
      this.costProperty = 0.0;
      this.weightProperty = 0.0;
    }

  } );

} );
