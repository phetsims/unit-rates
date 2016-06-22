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
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var NumberLineMarkerNode = require( 'UNIT_RATES/shopping/view/NumberLineMarkerNode' );
  var Property = require( 'AXON/Property' );

  // constants
  var EDITABLE_MARKER_X = 25;
  var UNDO_BUTTON_X     = 5;

  // images
  var undoButtonImage = require( 'image!UNIT_RATES/undo-button.png' );

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
    this.undoEditButtonNode = new RectangularPushButton( {
      visible: false,
      baseColor: '#f2f2f2',
      headWidth: 8,
      headHeight: 8,
      tailWidth: 5,
      left: UNDO_BUTTON_X,
      centerY: this.graphBounds.centerY,
      content: new Image( undoButtonImage, { scale: 0.25 }),
      listener: function() {
        self.removeEditMarker();
      }
    } );
    this.contentNode.addChild( this.undoEditButtonNode );

    this.addPopulateListener();

    // refresh on item change
    numberLine.itemDataProperty.link( function( itemData, oldItemData ) {

      // clear the undo stack on an item change (it gets rebuilt automatically)
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
    } );

  }

  unitRates.register( 'NumberLineNode', NumberLineNode );

  return inherit( URNumberLineNode, NumberLineNode, {

    /**
     *
     * @protected
     */
    addPopulateListener: function() {

      var self = this;

      // refresh on item additions/removals
      this.numberLine.addListeners( function( item, observableArray ) {
        //onAddCallback
        self.populate();
      },
      function( item, observableArray ) {
      } );
    },

    /**
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
     * @private
     */
    addEditMarker: function( ) {

      // create one if there is none
      if( !this.editMarkerExists() ) {

        // create a new editable item
        var editItem = this.numberLine.createItem( this.numberLine.itemDataProperty.value, -1 );
        editItem.setPosition( EDITABLE_MARKER_X, this.origin.y, false );

        // create a matching item marker node for the item
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
        var itemMarkerNode = this.undoItemNodeList.pop();

        // precision marker? remove it completly
        var itemArray = this.getItemArray();
        itemArray.remove( itemMarkerNode.item );
        this.populate();
      }
    },

     /**
     *
     * @private
     */
    editMarkerExists: function( ) {

      // look for an existing editable item
      var itemArray = this.getItemArray();
      var editableItems = itemArray.filter( function( item ) {
          return item.editableProperty.value;
      } );

      return ( editableItems.length > 0 );
    },

    /**
     *
     * @return {NumberLineMarkerNode}
     * @private
     */
    createItemMarkerNode: function( item ) {

      var self = this;

      // make marker node
      var position = item.positionProperty.value;
      var markerNode = new NumberLineMarkerNode( item, position, this.keypad, {
        draggable:  false,
        centerX:    position.x,
        centerY:    position.y,
        stroke:     'black',
        lineWidth:  1.25,
        bottomDecimalPlaces: ( item.isCandy() ? 2 : 1 )
      } );
      this.addMarker( markerNode );

      // update on top/bottom values changes
      Property.multilink( [ markerNode.item.costQnA.valueProperty, markerNode.item.unitQnA.valueProperty ],
        function( costProperty, unitProperty ) {
          self.updateItemMarkerNode( markerNode );
          self.addEditMarker();  // if needed
      } );

      return markerNode;
    },

    /**
     *
     * @private
     */
    updateItemMarkerNode: function( markerNode ) {

      var x           = markerNode.item.positionProperty.value.x;
      var y           = this.origin.y;
      var count       = markerNode.item.count;
      var inUndoList  = ( this.undoItemNodeList.indexOf( markerNode ) >= 0 );
      var isRemovable = this.isMarkerRemovable( markerNode );

      //
      if( count >= 0 ) {

        // undo stack managment
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
          markerNode.item.outOfRangeProperty.set( true );
        }
        else if ( countPercent >= 0 ) {
          x = ( ( 1.0 - countPercent ) * this.origin.x ) + ( this.graphBounds.maxX * countPercent );
          markerNode.item.outOfRangeProperty.set( false );
        }
      }

      // edit marker checks
      if( markerNode.item.editableProperty.value ) {

        // make sure the edit marker is on top of all other markers
        markerNode.moveToFront();

        // check edit marker for existing markers with same count
        var itemArray = this.getItemArray();
        var dupItemArray = itemArray.filter( function( item ) {
          return ( item.isEqual( markerNode.item ) && item !== markerNode.item );
        } );

        // if teh edit marker is a dup, remove it
        if( dupItemArray.length > 0 ) {
          this.removeEditMarker();
        }
      }

      // update the position on the number line
      markerNode.item.setPosition( x, y, markerNode.item.editableProperty.value );
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
        if( markerNode.item.editableProperty.value ) {
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
      var isEditable     = markerNode.item.editableProperty.value;
      var isCandy        = markerNode.item.isCandy();
      var countPrecision = markerNode.item.getCountPrecision();
      return ( isEditable || ( !isCandy && countPrecision >= 1 ) || ( isCandy && countPrecision >= 2 ) );
    },

    /**
     *
     * @returns {ObservableArray}
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
     * @public
     */
    reset: function() {

      URNumberLineNode.prototype.reset.call( this );

      this.addPopulateListener();
    }

  } );  // define

} );  // inherit
