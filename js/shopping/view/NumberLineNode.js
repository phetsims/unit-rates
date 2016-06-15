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
  var UNDO_BUTTON_X     = 5;

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
      yAxisOffset:  50
    }, options || {} );

    var self          = this;
    this.numberLine   = numberLine;
    this.keypad       = keypad;

    URNumberLineNode.call( this, options );

    this.outOfRangeMarkerX = ( this.topArrowNode.right + this.topArrowLabel.left ) / 2;

    // undo button
    this.undoEditButtonNode = new CurvedArrowButton( {
      visible: false,
      baseColor: '#f2f2f2',
      headWidth: 8,
      headHeight: 8,
      tailWidth: 5,
      left: UNDO_BUTTON_X,
      centerY: this.graphBounds.centerY,
      listener: function() {
        self.removeEditMarker();
      }
    } );
    this.contentNode.addChild( this.undoEditButtonNode );

    // refresh on item change
    numberLine.itemDataProperty.link( function( itemData, oldItemData ) {

      self.undoItemNodeList = [];

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

        // FIXME: rebuild undo stack?
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

      // reset the undo stack
      this.undoItemNodeList.length = 0;

      // get the current array for the item type
      var itemArray = this.getItemArray();
      itemArray.forEach( function( item ) {
        self.createItemMarkerNode( item );
      } );

      // Create an editable marker (if needed)
      this.addEditMarker();
    },

    /**
     *
     * @return {NumberLineMarkerNode}
     * @private
     */
    createItemMarkerNode: function( item ) {

      var self = this;

      var x = this.origin.x;
      var y = this.origin.y;

      // make marker node
      var markerNode = new NumberLineMarkerNode( item, new Vector2( x, y ), this.keypad, {
        draggable:  false,
        centerX:    x,
        centerY:    y,
        stroke:     'black',
        lineWidth:  1.25,
        bottomDecimalPlaces: ( item.isCandy() ? 2 : 1 )
      } );
      this.addMarker( markerNode );

      // update on top/bottom values changes
      Property.multilink( [ markerNode.item.costQnA.valueProperty, markerNode.item.unitQnA.valueProperty ],
        function( costProperty, unitProperty ) {
          self.updateItemMarker( markerNode );
          self.addEditMarker();  // if needed
      } );

      // make edit markers always on top: FIXME: this doesn't do anything
      if( item.editable ) {
        markerNode.moveToBack();
      }

      this.updateItemMarker( markerNode );

      return markerNode;
    },

    /**
     *
     * @private
     */
    addEditMarker: function( ) {

      var editMarker = this.getEditMarker();
      if( editMarker === null ) {
        // create a new editable item
        var editItem = this.numberLine.createItem( this.numberLine.itemDataProperty.value, -1, true );

        // create a matching item marker node
        this.createItemMarkerNode( editItem );

        // reset the kepad
        this.keypad.visible = false;
        this.keypad.clear();
      }

      this.updateUndoButton();
    },

    /**
     *
     * @private
     */
    removeEditMarker: function( ) {

      if( this.undoItemNodeList.length > 0 ) {

        // get the last item added
        var itemNode = this.undoItemNodeList.pop();

        // get the current array for the item type
        var itemArray = this.getItemArray();
        itemArray.remove( itemNode.item );

        this.populate();
      }
    },

    /**
     *
     * @return {ItemMarker}
     * @private
     */
    getEditMarker: function( ) {

      var editMarker = null;

      // get the current array for the item type
      var itemArray = this.getItemArray();
      var editableItems = itemArray.filter( function( item ) {
          return item.editable;
      } );
      assert && assert( (editableItems.length <= 1 ), 'multiple editable number line markers' );

      // if there's an editMarker (which there always should be) return it
      if( editableItems.length > 0 ) {
        editMarker = editableItems.pop();
      }

      return editMarker;
    },

    /**
     *
     * @private
     */
    updateItemMarker: function( markerNode ) {

      var x           = markerNode.item.positionProperty.value.x;
      var y           = markerNode.item.positionProperty.value.y;
      var count       = markerNode.item.count;
      var inUndoList  = ( this.undoItemNodeList.indexOf( markerNode ) >= 0 );
      var isRemovable = this.isMarkerRemovable( markerNode );

      // new edit marker?
      if ( markerNode.item.editable && markerNode.item.positionProperty.value.x === this.origin.x ) {
        x = EDITABLE_MARKER_X;
      }
      else if( count > 0 ) {

        // manage undo stack
        if( !inUndoList && isRemovable ) {
          this.undoItemNodeList.push( markerNode );
        }
        else if( inUndoList && !isRemovable ) {
          this.undoItemNodeList.splice( this.undoItemNodeList.indexOf( markerNode ), 1 );
        }

        // calc X position based on the item count
        var countPercent = count / ShoppingConstants.MAX_ITEMS;

        // off the number line?
        if( countPercent > 1.0 ) {
          x = this.outOfRangeMarkerX;
          markerNode.outOfRangeProperty.set( true );
        }
        else if ( countPercent >= 0 ) {
          x = ( ( 1.0 - countPercent ) * this.origin.x ) + ( this.graphBounds.maxX * countPercent );
          markerNode.outOfRangeProperty.set( false );
        }
      }
      markerNode.item.positionProperty.value = new Vector2( x, y );

      this.updateUndoButton();
    },

    /**
     *
     * @private
     */
    updateUndoButton: function() {

      // update undo button visibility
      this.undoEditButtonNode.visible = ( this.undoItemNodeList.length > 0 );

      if( this.undoEditButtonNode.visible ) {

        // get the top marker on the undo stack
        var markerNode = this.undoItemNodeList[ this.undoItemNodeList.length-1 ];

        // move the undo button based on the marker's 'editability'
        if( markerNode.item.editable ) {
          // edit marker
          this.undoEditButtonNode.left    = UNDO_BUTTON_X;
          this.undoEditButtonNode.centerY = this.graphBounds.centerY;
        }
        else {
          // position under marker node
          this.undoEditButtonNode.centerX = markerNode.centerX;
          this.undoEditButtonNode.top     = markerNode.bottom;
        }

      }
    },

    /**
     *
     * @private
     */
    isMarkerRemovable: function( markerNode ) {
      var isCandy   = markerNode.item.isCandy();
      var countPrecision = markerNode.item.getCountPrecision();
      //console.log( ' E: ' + markerNode.item.editable + ' P: ' +  countPrecision );

      return ( markerNode.item.editable || ( !isCandy && countPrecision >= 1 ) || ( isCandy && countPrecision >= 2 ) );
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

      this.undoItemNodeList.length = 0;

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
      this.removeAllMarkers();
      this.expandedProperty.reset();
    }

  } );  // define

} );  // inherit
