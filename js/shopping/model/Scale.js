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
  var Property = require( 'AXON/Property' );

  /**
   *
   * @constructor
   */
  function Scale( itemDataProperty ) {

    // @public (all)
    ItemCollection.call( this, itemDataProperty, {
    } );

    var self = this;

    this.itemDataProperty = itemDataProperty;
    this.costProperty     = new Property( 0.0 );
    this.weightProperty   = new Property( 0.0 );

    // update value text
    itemDataProperty.link( function( value, oldValue ) {

      self.costProperty.reset();
      self.weightProperty.reset();

      // get the current array for the item type
      var cost = 0;
      var weight = 0;
      var itemArray = self.getItemsWithType( value.type );
      itemArray.forEach( function( item ) {

        cost += ( item.rate * item.units * item.weight );
        weight += item.weight;
      } );

      self.costProperty.value = cost;
      self.weightProperty.value = weight;
    } );

    // refresh on item additions/removals
    this.addListeners( function( item, observableArray ) {
      console.log( 'Scale: ' + observableArray.length );

      self.costProperty.value += ( item.rate * item.units * item.weight );
      self.weightProperty.value += item.weight;

      // FIXME: expand fruit bag types into individual items
    },
    function( item, observableArray ) {
      console.log( 'Scale: ' + observableArray.length );

      self.costProperty.value -= ( item.rate * item.units * item.weight );
      self.weightProperty.value -= item.weight;
    } );
  }

  unitRates.register( 'Scale', Scale );

  return inherit( ItemCollection, Scale, {

    /**
     * @public
     */
    reset: function() {
      this.costProperty.reset();
      this.weightProperty.reset();
      ItemCollection.prototype.reset.call( this );
    }

  } );

} );
