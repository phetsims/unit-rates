// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var NumberLineNode = require( 'UNIT_RATES/common/view/NumberLineNode' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );

  // strings
  var applesString = require( 'string!UNIT_RATES/Apples' );
  var lemonsString = require( 'string!UNIT_RATES/Lemons' );
  var orangesString = require( 'string!UNIT_RATES/Oranges' );
  var pearsString = require( 'string!UNIT_RATES/Pears' );
  var carrotsString = require( 'string!UNIT_RATES/Carrots' );
  var cucumbersString = require( 'string!UNIT_RATES/Cucumbers' );
  var potatoesString = require( 'string!UNIT_RATES/Potatoes' );
  var tomatoesString = require( 'string!UNIT_RATES/Tomatoes' );
  var costString = require( 'string!UNIT_RATES/Cost' );
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );
  var weightString = require( 'string!UNIT_RATES/Weight' );
  var weightMassString = require( 'string!UNIT_RATES/weightMass' );
  var costCurrencyString = costString + ' (' + currencySymbolString + ')';
  var weightUnitString = weightString + ' (' + weightMassString + ')';


  /**
   * @param {ItemNumberLine} numberLine
   * @param {Object} [options]
   * @constructor
    * @constructor
   */
  function ItemNumberLineNode( numberLine, options ) {

    options = options || {};

    var self = this;

    NumberLineNode.call( this, numberLine, options );

    this.maxValue = 1.0;

    // refresh on item change
    numberLine.itemDataProperty.link( function( itemData, oldItemData ) {

      // set labels
      switch( itemData.type ) {
          case ItemData.APPLES.type:
            self.maxValue = 15.0;
            self.setLineLabels( costCurrencyString, applesString );
            break;
          case ItemData.LEMONS.type:
            self.maxValue = 15.0;
            self.setLineLabels( costCurrencyString, lemonsString );
            break;
          case ItemData.ORANGES.type:
            self.maxValue = 15.0;
            self.setLineLabels( costCurrencyString, orangesString );
            break;
          case ItemData.PEARS.type:
            self.maxValue = 15.0;
            self.setLineLabels( costCurrencyString, pearsString );
            break;
          case ItemData.CARROTS.type:
            self.maxValue = 15.0;
            self.setLineLabels( costCurrencyString, carrotsString );
            break;
          case ItemData.CUCUMBERS.type:
            self.maxValue = 15.0;
            self.setLineLabels( costCurrencyString, cucumbersString );
            break;
          case ItemData.POTATOES.type:
            self.maxValue = 15.0;
            self.setLineLabels( costCurrencyString, potatoesString );
            break;
          case ItemData.TOMATOES.type:
            self.maxValue = 15.0;
            self.setLineLabels( costCurrencyString, tomatoesString );
            break;
          case ItemData.RED_CANDY.type:
            self.maxValue = 1.5;
            self.setLineLabels( costCurrencyString, weightUnitString );
            break;
          case ItemData.YELLOW_CANDY.type:
            self.maxValue = 1.5;
            self.setLineLabels( costCurrencyString, weightUnitString );
            break;
          case ItemData.GREEN_CANDY.type:
            self.maxValue = 1.5;
            self.setLineLabels( costCurrencyString, weightUnitString );
            break;
          case ItemData.BLUE_CANDY.type:
            self.maxValue = 1.5;
            self.setLineLabels( costCurrencyString, weightUnitString );
            break;
          default:
            assert && assert( true, 'Number line using unrecognized type' );
        }

        self.populate();
    } );

    this.addCostButton.addListener( function() {
      console.log('NumberLine: add cost');
    } );

    this.addUnitButton.addListener( function() {
      console.log('NumberLine: add unit');
    } );

  }

  unitRates.register( 'ItemNumberLineNode', ItemNumberLineNode );

  return inherit( NumberLineNode, ItemNumberLineNode, {

    /**
     *
     * @override @public
     */
    populate: function() {

      var self = this;

      // remove all existing markers
      this.graphLayerNode.removeAllChildren();

      // item count or item weight?
      var type = this.numberLine.itemDataProperty.value;
      var typeIsCandy = ( type === ItemData.RED_CANDY   || type === ItemData.YELLOW_CANDY ||
                          type === ItemData.GREEN_CANDY || type === ItemData.BLUE_CANDY );

      // get the current array for the item type
      var itemArray = this.numberLine.getItemsWithType( this.numberLine.itemDataProperty.value.type );
      console.log('NumberLine: ' + itemArray.length);
      itemArray.forEach( function( item ) {

        var position = ( typeIsCandy ? ( item.weight * item.count ) : item.count ) / self.maxValue;
        self.addMarker( position );
      } );
    },

    /**
     *
     * @override @public
     */
    removeAllMarkers: function() {

      this.numberLine.resetItemType( this.numberLine.itemDataProperty.value.type );

      NumberLineNode.prototype.removeAllMarkers.call( this );
    },

    /**
     *
     * @override @public
     */
    reset: function() {
      this.expandedProperty.reset();
    }

  } );  // define

} );  // inherit
