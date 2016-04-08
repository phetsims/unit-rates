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
  var URNumberLineNode = require( 'UNIT_RATES/common/view/URNumberLineNode' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var NumberLineMarkerNode = require( 'UNIT_RATES/shopping/view/NumberLineMarkerNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );

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
  function NumberLineNode( numberLine, options ) {

    options = options || {};

    var self = this;

    URNumberLineNode.call( this, numberLine, options );

    this.tmpCounter = 1;

    this.maxValue = 1.0;
    this.markerDragBounds = new Bounds2( this.graphBounds.minX, 0, this.graphBounds.maxX, 0 );

    // refresh on item change
    numberLine.itemDataProperty.link( function( itemData, oldItemData ) {

      // set number line labels & maximum values
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
      var item = self.createNextItem();
      if( item !== null ) {
        self.createItemMarker( item, true );
      }

    } );

    this.addUnitButton.addListener( function() {
    } );

  }

  unitRates.register( 'NumberLineNode', NumberLineNode );

  return inherit( URNumberLineNode, NumberLineNode, {

    /**
     *
     * @return {Item | null}
     * @private
     */
    createNextItem: function() {

      var itemData = this.numberLine.itemDataProperty.value;

      // get the current array for the item type
      var itemArray = this.numberLine.getItemsWithType( itemData.type );

      // FIXME: find empty slot


      var item = this.numberLine.createItem( this.numberLine.itemDataProperty.value, this.tmpCounter++ );

      return item;
    },

    /*
     *
     * @override @public
     */
    populate: function() {

      var self = this;

      // remove all existing markers - FIXME: only add new nodes??
      this.graphLayerNode.removeAllChildren();

      var itemData = this.numberLine.itemDataProperty.value;

      // get the current array for the item type
      var itemArray = this.numberLine.getItemsWithType( itemData.type );
      console.log('NumberLine: ' + itemArray.length);
      itemArray.forEach( function( item ) {
        self.createItemMarker( item, false ); // FIXME: need to keep track of editable
      } );
    },

    /**
     *
     * @private
     */
    createItemMarker: function( item, editable ) {

      var typeIsCandy = ( item.type === ItemData.RED_CANDY.type   || item.type === ItemData.YELLOW_CANDY.type ||
                          item.type === ItemData.GREEN_CANDY.type || item.type === ItemData.BLUE_CANDY.type );

      // calc position
      var valuePercent = ( typeIsCandy ? ( item.weight * item.count ) : item.count ) / this.maxValue;
      if ( valuePercent >= 0 && valuePercent <= 1.0 ) {

        var x = this.markerDragBounds.maxX * valuePercent + ( 1.0 - valuePercent ) * this.markerDragBounds.minX;
        var y = this.graphBounds.centerY;
        var position = new Vector2( x, y );

        // make marker node
        var markerNode = new NumberLineMarkerNode( item, position, this.markerMoved, {
          centerX: x,
          centerY: y,
          lineHeight: 50,
          stroke: 'black',
          lineWidth: 1.25,
          editable: editable,
          movementBounds: this.markerDragBounds
        } );

        this.addMarker( markerNode );
      }
    },

    /**
     * Called when an item's node is dragged to a new location
     * @private
     */
    markerMoved: function( itemNode ) {

      // Send it back from whence it came
      //itemNode.restoreLastPosition();
      console.log('itemMoved');
    },

    /**
     *
     * @override @public
     */
    removeAllMarkers: function() {

      this.numberLine.resetItemType( this.numberLine.itemDataProperty.value.type );

      URNumberLineNode.prototype.removeAllMarkers.call( this );
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
