// Copyright 2002-2016, University of Colorado Boulder

/**
 * All the items currently on the number line
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemCollection = require( 'UNIT_RATES/shopping/model/ItemCollection' );

  /**
   *
   * @constructor
   */
  function ItemNumberLine( itemDataProperty ) {

    // @public (all)
    ItemCollection.call( this, itemDataProperty, {
    } );

    var self = this;

    this.itemDataProperty = itemDataProperty;

    // update value text
    itemDataProperty.link( function( value, oldValue ) {
    } );

    // refresh on item additions/removals
    this.addListeners( function( item, observableArray ) {
      //console.log( 'ItemNumberLine: ' + observableArray.length );
    },
    function( item, observableArray ) {
      //console.log( 'ItemNumberLine: ' + observableArray.length );
    } );

  }

  unitRates.register( 'ItemNumberLine', ItemNumberLine );

  return inherit( ItemCollection, ItemNumberLine, {

    /**
     * @public
     */
    reset: function() {
      ItemCollection.prototype.reset.call( this );
    }

  } );

} );
