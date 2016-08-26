// Copyright 2002-2016, University of Colorado Boulder

/**
 * A derived, shopping-specific, double number line. Basically handles adding/removing marker nodes.
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var ShoppingConstants = require( 'UNIT_RATES/common/shopping/ShoppingConstants' );
  var URNumberLineNode = require( 'UNIT_RATES/common/view/URNumberLineNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var NumberLineMarkerNode = require( 'UNIT_RATES/common/shopping/view/NumberLineMarkerNode' );
  var Property = require( 'AXON/Property' );

  // constants
  var EDITABLE_MARKER_X = 25; // the defualt X position of an editable marker
  var UNDO_BUTTON_X     = 5;  // the default X position of the undo/remove button

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
   * @param {NumberLine} numberLine - the model
   * @param {NumberKeypad} keypad - shared keypad
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

    // @private - the fixed X location for ALL markers which are off the end of the number line
    this.outOfRangeMarkerX = ( this.topArrowNode.right + this.topArrowLabel.left ) / 2;

    // Array.<NumberLineMarkerNode> - The undo/remove stack of markers which keeps track of the order of
    // marker removals for the undo button.
    // @private
    this.undoItemNodeList = [];

    // undo button - it's position will change based on the marker beign edited. Incorrectly/unanswered editable markers
    // will position the button on the far left side of the number line, while correct/fractional 'count' markers will
    // reposition the undo button directly under the marker.
    this.undoEditButtonNode = new RectangularPushButton( {
      visible: false,
      baseColor: URConstants.DEFAULT_BUTTON_COLOR,
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
      self.undoItemNodeList.length = 0;

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
          case ItemData.PURPLE_CANDY.type:
            self.setLineLabels( costCurrencyString, weightUnitString );
            break;
          case ItemData.GREEN_CANDY.type:
            self.setLineLabels( costCurrencyString, weightUnitString );
            break;
          case ItemData.BLUE_CANDY.type:
            self.setLineLabels( costCurrencyString, weightUnitString );
            break;
          default:
            assert && assert( false, 'Number line using unrecognized type' );
        }

        self.populate();
    } );

  }

  unitRates.register( 'NumberLineNode', NumberLineNode );

  return inherit( URNumberLineNode, NumberLineNode, {

    /**
     * Adds the local callback for when a new item/marker is added to the number line. This gets called any time
     * the number line gets rebuilt (i.e. on a item type change - apples -> pears ), as the NumberLine model/ObservableArray
     * removes the listeners when cleared.
     * @protected
     */
    addPopulateListener: function() {

      var self = this;

      // refresh on item additions/removals
      this.numberLine.addListeners(
        // onAddCallback
        function( item, observableArray ) {
          self.populate();
        },
        // onRemoveCallback - no/op
        function( item, observableArray ) {
      } );
    },

    /**
     * Creates marker node for every item in the model
     * @override @public
     */
    populate: function() {

      var self = this;

      // remove all existing markers
      this.graphMarkerLayerNode.removeAllChildren();

      // reset the undo stack
      this.undoItemNodeList.length = 0;

      // get the current item array for the item type (array of NumberLineItem)
      var itemArray = this.getItemArray();
      itemArray.forEach( function( item ) {
        self.createItemMarkerNode( item );
      } );

      // Create an editable marker (if needed)
      this.addEditMarker();
    },

    /**
     * Adds a new editable marker to the number line (if one doesn't already exist). Editable markers have buttons
     * which allow the edit boxes to be linked to the shared keypad.
     * @private
     */
    addEditMarker: function( ) {

      // create one if there is none
      if ( !this.editMarkerExists() ) {

        // create a new editable item
        var editItem = this.numberLine.createItem( this.numberLine.itemDataProperty.value, -1 );
        editItem.setPosition( EDITABLE_MARKER_X, this.origin.y, false );

        // create a matching item marker node for the item
        this.createItemMarkerNode( editItem );

        // reset the kepad
        this.keypad.hide();
        this.keypad.clear();
      }

      this.updateUndoButton();
    },

    /**
     * Removes the top marker in the undo stack from the number line.
     * @private
     */
    removeEditMarker: function( ) {

      if ( this.undoItemNodeList.length > 0 ) {

        // get the last item added
        var itemMarkerNode = this.undoItemNodeList.pop();

        // precision marker? remove it completly
        var itemArray = this.getItemArray();
        itemArray.remove( itemMarkerNode.item );
        this.populate();
      }
    },

    /**
     * Tells whether there is an existing editable marker on the number line
     * @returns {boolean}
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
     * Creates a new marker node based on the specified item attiributes
     * @param {NumberLineItem} - the item (type, count, cost, etc..)
     * @return {NumberLineMarkerNode}
     * @private
     */
    createItemMarkerNode: function( item ) {

      var self = this;

      // Color the marker based on Challange prompts
      var markerColor = 'black';
      if ( item.isChallenge ) {
        if ( item.isChallengeUnitRate ) {
          markerColor = ShoppingConstants.UNIT_RATE_CORRECT_PROMPT_COLOR;
        }
        else {
          markerColor = ShoppingConstants.DEFAULT_CORRECT_PROMPT_COLOR;
        }
      }

      // make marker node at a specific location
      var position = item.positionProperty.value;
      var markerNode = new NumberLineMarkerNode( item, position, this.keypad, {
        draggable:    false,
        centerX:      position.x,
        centerY:      position.y,
        stroke:       'black',
        lineWidth:    1.25,
        markerColor:  markerColor,
        bottomDecimalPlaces: ( item.isCandy() ? 2 : 1 ) // Candy count values are 2 decimal places
      } );
      this.addMarker( markerNode );

      // update on top/bottom values changes
      this.qnaMultilink = Property.multilink( [ markerNode.item.costQnA.valueProperty, markerNode.item.unitQnA.valueProperty ],
        function( costProperty, unitProperty ) {
          self.updateItemMarkerNode( markerNode );
          self.addEditMarker();  // if needed
      } );

      return markerNode;
    },

    /**
     * This does a few things but mainly updating the marker's position on the number line. It also may add the
     * marker to the undo stack if it's an 'editable' marker.
     * @param {NumberLineMarkerNode}
     * @private
     */
    updateItemMarkerNode: function( markerNode ) {

      var x           = markerNode.item.positionProperty.value.x;
      var y           = this.origin.y;
      var count       = markerNode.item.countProperty.value;
      var inUndoList  = ( this.undoItemNodeList.indexOf( markerNode ) >= 0 );
      var isRemovable = this.isMarkerRemovable( markerNode );

      //
      if ( count >= 0 ) {

        // undo stack managment
        if ( !inUndoList && isRemovable ) {
          this.undoItemNodeList.push( markerNode );
        }
        else if ( inUndoList && !isRemovable ) {
          this.undoItemNodeList.splice( this.undoItemNodeList.indexOf( markerNode ), 1 );
        }

        // calc X position based on the item count
        var countPercent = ( count / ShoppingConstants.MAX_ITEMS );
        if ( markerNode.item.isCandy() ) {
          countPercent *= 10.0;
        }

        // off the number line?
        if ( countPercent > 1.0 ) {
          x = this.outOfRangeMarkerX;
          markerNode.item.outOfRangeProperty.set( true );
        }
        else if ( countPercent >= 0 ) {
          x = ( ( 1.0 - countPercent ) * this.origin.x ) + ( ( this.graphBounds.maxX + this.origin.x / 1.5 ) * countPercent );
          markerNode.item.outOfRangeProperty.set( false );
        }
      }

      // edit marker checks
      if ( markerNode.item.editableProperty.value ) {

        // make sure the edit marker is on top of all other markers
        markerNode.moveToFront();

        // check edit marker for existing markers with same count
        var itemArray = this.getItemArray();
        var dupItemArray = itemArray.filter( function( item ) {
          return ( item.isEqual( markerNode.item ) && item !== markerNode.item );
        } );

        // if the edit marker is a dup, remove it
        if ( dupItemArray.length > 0 ) {
          this.removeEditMarker();
        }
      }

      // update the position on the number line
      markerNode.item.setPosition( x, y, markerNode.item.editableProperty.value );
    },

    /**
     * Handles the undo button visibility as well as it's location - to the far left or under a specific marker.
     * @private
     */
    updateUndoButton: function() {

      // update undo button visibility
      this.undoEditButtonNode.visible = ( this.undoItemNodeList.length > 0 );

      if ( this.undoEditButtonNode.visible ) {

        // get the top marker on the undo stack
        var markerNode = this.undoItemNodeList[ this.undoItemNodeList.length-1 ];

        // move the undo button based on the marker's 'editability'
        if ( markerNode.item.editableProperty.value ) {
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
     * Tells whether a marker is 'removable'. Markers which are 'removable' are those which
     * are either still editable (i.e. not locked in) or those which have fractional 'count' values.
     * @returns {boolean}
     * @private
     */
    isMarkerRemovable: function( markerNode ) {
      var isEditable     = markerNode.item.editableProperty.value;
      var isCandy        = markerNode.item.isCandy();
      var countPrecision = markerNode.item.getCountPrecision();
      return ( isEditable || ( !isCandy && countPrecision >= 1 ) || ( isCandy && countPrecision >= 2 ) );
    },

    /**
     * Fetches the item array for the current item type.
     * @returns {Array}.<Item>
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
     * Removes all the markers
     * @override @public
     */
    removeAllMarkers: function() {

      // Hide the keypad
      this.keypad.hide();

      this.undoItemNodeList.length = 0;

      this.numberLine.removeAllItemsWithType( this.numberLine.itemDataProperty.value.type );

      URNumberLineNode.prototype.removeAllMarkers.call( this );

      // add back an editable marker
      this.populate();
    },

    /**
     * Resets the node to it's default state
     * @public
     */
    reset: function() {
      URNumberLineNode.prototype.reset.call( this );

      // re-add the local listener
      this.addPopulateListener();
    },

    // @public
    dispose: function() {
      this.qnaMultilink.dispose();
    }

  } );  // define

} );  // inherit
