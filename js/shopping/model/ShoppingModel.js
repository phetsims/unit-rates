// Copyright 2002-2016, University of Colorado Boulder

/**
 * The whole enchilada - shelf, scale, number line & challanges
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
  var ItemType = require( 'UNIT_RATES/shopping/enum/ItemType' );

  // strings
  /*
  var applesString = require( 'string!UNIT_RATES/Apples' );
  var lemonsString = require( 'string!UNIT_RATES/Lemons' );
  var orangesString = require( 'string!UNIT_RATES/Oranges' );
  var pearsString = require( 'string!UNIT_RATES/Pears' );
  var carrotsString = require( 'string!UNIT_RATES/Carrots' );
  var cucumbersString = require( 'string!UNIT_RATES/Cucumbers' );
  var potatoesString = require( 'string!UNIT_RATES/Potatoes' );
  var tomatoesString = require( 'string!UNIT_RATES/Tomatoes' );
  var redCandyString = require( 'string!UNIT_RATES/RedCandy' );
  var yellowCandyString = require( 'string!UNIT_RATES/YellowCandy' );
  var greenCandyString = require( 'string!UNIT_RATES/GreenCandy' );
  var blueCandyString = require( 'string!UNIT_RATES/BlueCandy' );
  */

  /**
   * @constructor
   */
  function UnitRatesModel() {

    // @public (all)
    PropertySet.call( this, {
      itemType: ItemType.APPLES
    } );

    var self = this;

    // @public
    this.shelf = new Shelf( this.itemTypeProperty );

    //
    this.itemTypeProperty.link( function( type, oldType ) {
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
