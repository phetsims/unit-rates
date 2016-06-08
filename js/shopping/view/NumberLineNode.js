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
  var CurvedArrowButton = require( 'UNIT_RATES/common/view/CurvedArrowButton' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var NumberLineMarkerNode = require( 'UNIT_RATES/shopping/view/NumberLineMarkerNode' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var EDITABLE_MARKER_X = 25;

  // strings
  var applesCapString = require( 'string!UNIT_RATES/applesCap' );
  var lemonsCapString = require( 'string!UNIT_RATES/lemonsCap' );
  var orangesCapString = require( 'string!UNIT_RATES/orangesCap' );
  var pearsCapString = require( 'string!UNIT_RATES/pearsCap' );
  var carrotsCapString = require( 'string!UNIT_RATES/carrotsCap' );
  var cucumbersCapString = require( 'string!UNIT_RATES/cucumbersCap' );
  var potatoesCapString = require( 'string!UNIT_RATES/potatoesCap' );
  var tomatoesCapString = require( 'string!UNIT_RATES/tomatoesCap' );
  var costString = require( 'string!UNIT_RATES/cost' );
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );
  var weightString = require( 'string!UNIT_RATES/weight' );
  var lbsString = require( 'string!UNIT_RATES/lbs' );
  var costCurrencyString = costString + ' (' + currencySymbolString + ')';
  var weightUnitString = weightString + ' (' + lbsString + ')';

  /**
   * @param {NumberLine} numberLine
   * @param {NumberKeypad} keypad
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineNode( numberLine, keypad, options ) {

    options = _.extend( {
      yAxisOffset:  45
    }, options || {} );

    var self          = this;
    this.numberLine   = numberLine;
    this.keypad       = keypad;

    URNumberLineNode.call( this, options );

    // undo button
    this.undoEditButtonNode = new CurvedArrowButton( {
      visible: false,
      headWidth: 8,
      headHeight: 8,
      tailWidth: 5,
      left: 8,
      centerY: this.centerY - 8,
      listener: function() {
        self.removeEditMarker();
        self.populate();
        self.undoEditButtonNode.visible = false;
      }
    } );
    this.addChild( this.undoEditButtonNode );


    // refresh on item change
    numberLine.itemDataProperty.link( function( itemData, oldItemData ) {

      // set number line labels
      switch( itemData.type ) {
          case ItemData.APPLES.type:
            self.setLineLabels( costCurrencyString, applesCapString );
            break;
          case ItemData.LEMONS.type:
            self.setLineLabels( costCurrencyString, lemonsCapString );
            break;
          case ItemData.ORANGES.type:
            self.setLineLabels( costCurrencyString, orangesCapString );
            break;
          case ItemData.PEARS.type:
            self.setLineLabels( costCurrencyString, pearsCapString );
            break;
          case ItemData.CARROTS.type:
            self.setLineLabels( costCurrencyString, carrotsCapString );
            break;
          case ItemData.CUCUMBERS.type:
            self.setLineLabels( costCurrencyString, cucumbersCapString );
            break;
          case ItemData.POTATOES.type:
            self.setLineLabels( costCurrencyString, potatoesCapString );
            break;
          case ItemData.TOMATOES.type:
            self.setLineLabels( costCurrencyString, tomatoesCapString );
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
      this.graphMarkerLayerNode.removeAllChildren();

      // get the current array for the item type
      var itemArray = this.getItemArray();
      itemArray.forEach( function( item ) {
        self.createItemMarker( item );
      } );

      // Create an editable marker (if needed)
      this.createEditMarker();
    },

    /**
     *
     * @private
     */
    createItemMarker: function( item ) {

      var self = this;

      var x = this.origin.x;
      var y = this.origin.y;

      // make marker node
      var markerNode = new NumberLineMarkerNode( item, new Vector2( x, y ), this.keypad, {
        draggable:  false,
        centerX:    x,
        centerY:    y,
        lineHeight: 40,
        stroke:     'black',
        lineWidth:  1.25
      } );

      // check answers on user input
      Property.multilink( [ markerNode.item.costQnA.valueProperty, markerNode.item.unitQnA.valueProperty ],
        function( costProperty, unitProperty ) {
          self.updateItemMarkerPosition( markerNode );
          self.createEditMarker();
      } );

      this.addMarker( markerNode );
    },

    /**
     *
     * @private
     */
    createEditMarker: function( ) {

      // get the current array for the item type
      var itemArray = this.getItemArray();

      // get the editable marker
      var editableItems = itemArray.filter( function( item ) {
          return item.editable;
      } );

      // create an editable marker
      if( editableItems.length === 0 ) {
        var editItem = this.numberLine.createItem( this.numberLine.itemDataProperty.value, -1, true );
        this.createItemMarker( editItem );
      }

      // update undo button visibility
      this.updateUndoVisibility();
    },

    /**
     *
     * @private
     */
    removeEditMarker: function( ) {

      var editMarker = this.getEditMarker();

      // get the current array for the item type
      var itemArray = this.getItemArray();

      itemArray.remove( editMarker );
    },

    /**
     *
     * @private
     */
    getEditMarker: function( ) {

      // get the current array for the item type
      var itemArray = this.getItemArray();
      var editableItems = itemArray.filter( function( item ) {
          return item.editable;
      } );
      assert && assert( (editableItems.length === 1 ), 'multiple editable number line markers' );

      var editMarker = editableItems.pop();

      return editMarker;
    },

    /**
     *
     * @private
     */
    updateUndoVisibility: function( ) {

      // If the editable marker is on the number line show the undo button
      var editMarker = this.getEditMarker();
      this.undoEditButtonNode.visible = ( editMarker.count > 0 );
    },

    /**
     *
     * @private
     */
    updateItemMarkerPosition: function( markerNode ) {
      console.log('updateItemEditableMarker: ' + markerNode.item.count);

      var x     = markerNode.item.positionProperty.value.x;
      var y     = markerNode.item.positionProperty.value.y;
      var count = markerNode.item.count;

      // calc X position based on the item count
      if( count > 0 ) {
        var countPercent =  count / ShoppingConstants.MAX_ITEMS;
        if ( countPercent >= 0 && countPercent <= 1.0 ) {
          x =  ( ( 1.0 - countPercent ) * this.origin.x ) + ( this.graphBounds.maxX * countPercent );
        }
      }
      //
      else if ( markerNode.item.editable &&  markerNode.item.positionProperty.value.x === this.origin.x ) {
        x = EDITABLE_MARKER_X;
      }

      markerNode.item.positionProperty.value = new Vector2( x, y );
    },

    /**
     *
     * @private
     */
    getItemArray: function( ) {

      // get the current item type
      var itemData = this.numberLine.itemDataProperty.value;

      // get the current array for the item type
      var itemArray = this.numberLine.getItemsWithType( itemData.type );
      assert && assert( (itemArray !== null ), 'multiple editable number line markers' );

      return itemArray;
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

      // add back an editable marker
      this.populate();
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
