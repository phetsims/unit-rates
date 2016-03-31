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
  var NumberLine = require( 'UNIT_RATES/shopping/model/NumberLine' );
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
    this.numberLine = new NumberLine( this.itemDataProperty );

    //
    this.itemDataProperty.link( function( data, oldData ) {
    } );
  }

  unitRates.register( 'UnitRatesModel', UnitRatesModel );

  return inherit( PropertySet, UnitRatesModel, {

    // Resets all model elements
    reset: function() {

      this.shelf.reset();

      PropertySet.prototype.reset.call( this );
    }

  } ); // inherit

} ); // define
