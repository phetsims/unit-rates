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
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
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

  // constants
  var MAX_MARKER_COUNT = 15;


  /**
   * @param {ItemNumberLine} numberLine
   * @param {NumberKeypad} keypad
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineNode( numberLine, keypad, options ) {

    options = options || {};

    var self = this;

    URNumberLineNode.call( this, numberLine, options );

    this.keypad = keypad;
    this.markerDragBounds = new Bounds2( this.graphBounds.minX, 0, this.graphBounds.maxX, 0 );

    // refresh on item change
    numberLine.itemDataProperty.link( function( itemData, oldItemData ) {

      // set number line labels
      switch( itemData.type ) {
          case ItemData.APPLES.type:
            self.setLineLabels( costCurrencyString, applesString );
            break;
          case ItemData.LEMONS.type:
            self.setLineLabels( costCurrencyString, lemonsString );
            break;
          case ItemData.ORANGES.type:
            self.setLineLabels( costCurrencyString, orangesString );
            break;
          case ItemData.PEARS.type:
            self.setLineLabels( costCurrencyString, pearsString );
            break;
          case ItemData.CARROTS.type:
            self.setLineLabels( costCurrencyString, carrotsString );
            break;
          case ItemData.CUCUMBERS.type:
            self.setLineLabels( costCurrencyString, cucumbersString );
            break;
          case ItemData.POTATOES.type:
            self.setLineLabels( costCurrencyString, potatoesString );
            break;
          case ItemData.TOMATOES.type:
            self.setLineLabels( costCurrencyString, tomatoesString );
            break;
          case ItemData.RED_CANDY.type:
            self.setLineLabels( costCurrencyString, weightUnitString );
            break;
          case ItemData.YELLOW_CANDY.type:
            self.setLineLabels( costCurrencyString, weightUnitString );
            break;
          case ItemData.GREEN_CANDY.type:
            self.setLineLabels( costCurrencyString, weightUnitString );
            break;
          case ItemData.BLUE_CANDY.type:
            self.setLineLabels( costCurrencyString, weightUnitString );
            break;
          default:
            assert && assert( true, 'Number line using unrecognized type' );
        }

        self.populate();
    } );

    this.topAddButton.addListener( function() {
      var item = self.createNextItem();
      if( item !== null ) {

        // turn of any existing dragable markers
        self.forEachMarker(  function( marker ) {
          marker.item.dragable = false;
        } );

        // Create new editable marker
        item.dragable = true;
        item.editable = ShoppingConstants.EditMode.UNIT;
        self.createItemMarker( item );
      }
    } );

    this.bottomAddButton.addListener( function() {
      var item = self.createNextItem();
      if( item !== null ) {

        // turn of any existing dragable markers
        self.forEachMarker(  function( marker ) {
          marker.item.dragable = false;
        } );

        // Create new dragable/editable marker
        item.dragable = true;
        item.editable = ShoppingConstants.EditMode.COST;
        self.createItemMarker( item );
      }
    } );

  }

  unitRates.register( 'NumberLineNode', NumberLineNode );

  return inherit( URNumberLineNode, NumberLineNode, {

    /*
     *
     * @override @public
     */
    populate: function() {

      var self = this;

      // remove all existing markers
      this.graphLayerNode.removeAllChildren();

      var itemData = this.numberLine.itemDataProperty.value;

      // get the current array for the item type
      var itemArray = this.numberLine.getItemsWithType( itemData.type );
      itemArray.forEach( function( item ) {
        self.createItemMarker( item );
      } );
    },

    /**
     *
     * @return {Item | null}
     * @private
     */
    createNextItem: function() {

      var self = this;

      var availableCounts = self.numberLine.getAvailableCounts( MAX_MARKER_COUNT );

      var item = null;
      if( availableCounts.length > 0 ) {
        // create a new item with the first available item count
        item = self.numberLine.createItem( self.numberLine.itemDataProperty.value, availableCounts[0] );
      }

      return item;
    },

    /**
     *
     * @private
     */
    createItemMarker: function( item ) {

      // calc position
      var countPercent = item.count / MAX_MARKER_COUNT;
      if ( countPercent >= 0 && countPercent <= 1.0 ) {

        var x = this.markerDragBounds.maxX * countPercent + ( 1.0 - countPercent ) * this.markerDragBounds.minX;
        var y = this.graphBounds.centerY;
        var position = new Vector2( x, y );

        // make marker node
        var markerNode = new NumberLineMarkerNode( item, position, this.keypad,
          this.markerStartDrag.bind( this ), this.markerEndDrag.bind( this ), {
          centerX: x,
          centerY: y,
          lineHeight: 50,
          stroke: 'black',
          lineWidth: 1.25,
          dragBounds: this.markerDragBounds
        } );

        this.addMarker( markerNode );
      }
    },

    /**
     * Called when an item's node is dragged to a new location
     * @private
     */
    markerStartDrag: function( markerNode ) {

      // Hide the keypad
      this.keypad.visible = false;

      // Hide number display & edit buttons
      markerNode.hideDragNodes();
    },

    /**
     * Called when an item's node is dragged to a new location
     * @private
     */
    markerEndDrag: function( markerNode ) {

      // Show number display & edit buttons
      markerNode.showDragNodes();

      // Snap to closest available slot
      var dragXPercent = ( markerNode.centerX - this.markerDragBounds.minX ) /
                         ( this.markerDragBounds.maxX - this.markerDragBounds.minX );

      var newCount = Math.round( dragXPercent * MAX_MARKER_COUNT );

      var availableCounts = this.numberLine.getAvailableCounts( MAX_MARKER_COUNT );
      if( availableCounts.indexOf( newCount ) >= 0 ) {

        // change the item's count to the new dragged count value
        markerNode.item.count = newCount;
        this.populate();
      }
      else {
        // Send it back from whence it came
        markerNode.restoreLastPosition();
      }

    },

    /**
     *
     * @override @public
     */
    removeAllMarkers: function() {

      // Hide the keypad
      this.keypad.visible = false;

      this.numberLine.removeAllItemsWithType( this.numberLine.itemDataProperty.value.type );

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
