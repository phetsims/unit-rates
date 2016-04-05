// Copyright 2002-2016, University of Colorado Boulder

/**
 * The whole enchilada - shelf, scale, number line & challenges
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Shelf = require( 'UNIT_RATES/shopping/model/Shelf' );
  var Scale = require( 'UNIT_RATES/shopping/model/Scale' );
  var ItemNumberLine = require( 'UNIT_RATES/shopping/model/ItemNumberLine' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );

  /**
   * @constructor
   */
  function UnitRatesModel() {

    // @public (all)
    PropertySet.call( this, {
      itemData: ItemData.APPLES
    } );

    // @public
    this.shelf = new Shelf( this.itemDataProperty );
    this.scale = new Scale( this.itemDataProperty );
    this.numberLine = new ItemNumberLine( this.itemDataProperty );

    //
    this.itemDataProperty.link( function( data, oldData ) {
    } );

  }

  unitRates.register( 'UnitRatesModel', UnitRatesModel );

  return inherit( PropertySet, UnitRatesModel, {

    /**
     *
     * @param {Item} item
     * @public
     */
    addShelfItemToScale: function( item ) {

      // Remove from shelf & add to scale
      this.shelf.removeItem( item );
      this.scale.addItem(item );

      this.updateNumberLine();
    },

    /**
     *
     * @param {Item} item
     * @public
     */
    addScaleItemToShelf: function( item ) {

      // Remove from scale & add to shelf
      this.scale.removeItem( item );
      this.shelf.addItem( item );

      this.updateNumberLine();
    },

    /**
     *
     * @protected
     */
    updateNumberLine: function() {

      // create a new item on the number line representing the total number/weight of items currently on the scale
      var count = this.scale.getItemCount() ;
      if( count > 0 ) {
        this.numberLine.createItem( this.itemDataProperty.value, count );
      }
    },

    // Resets all model elements
    reset: function() {

      this.shelf.reset();
      this.scale.reset();
      this.numberLine.reset();

      PropertySet.prototype.reset.call( this );
    }

  } ); // inherit

} ); // define
