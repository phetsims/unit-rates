// Copyright 2002-2016, University of Colorado Boulder

/**
 * Displays the scale and any items that were added to it. Also displays the cost for all items (& weight for candy).
 * The 'top' portion of the scale is also considered a 'drop-zone' for items being dragged from the shelf.
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ShoppingConstants = require( 'UNIT_RATES/common/shopping/ShoppingConstants' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var Item = require( 'UNIT_RATES/common/shopping/model/Item' );
  var ItemNodeFactory = require( 'UNIT_RATES/common/shopping/view/ItemNodeFactory' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'SUN/Panel' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Property = require( 'AXON/Property' );

  // images
  var scaleImage = require( 'image!UNIT_RATES/scale.png' );

  // constants
  var DROP_ZONE_X_SCALE     = 1.05;                     // How much bigger the drop zone width is from the image
  var DROP_ZONE_Y_SCALE     = 2.25;                     // How much bigger the drop zone height is from the image
  var NODE_X_SPACING        = 0;
  var NODE_Y_SPACING        = 5;
  var DISPLAY_BOTTOM_OFFSET = 32;
  var DISPLAY_SPACING       = 10;                       // space beteen mutliple displays
  var DISPLAY_FONT          = new PhetFont( 20 );
  var DISPLAY_SIZE          = new Dimension2( 70, 40 );

  // strings
  var costString = require( 'string!UNIT_RATES/cost' );
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );
  var lbsString = require( 'string!UNIT_RATES/lbs' );

  /**
   *
   * @param {Scale} scale - model
   * @param {Node} itemLayer - a container node which holds the item nodes. Used here for local posiitoning of items
   * @param (function} startMoveCallback - function called when item drag starts
   * @param (function} endMoveCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function ScaleNode( scale, itemLayer, startMoveCallback, endMoveCallback, options ) {

    options = options || {
      enableHideCost: false
    };

    var self = this;

    this.scale              = scale;
    this.itemLayer          = itemLayer;
    this.startMoveCallback  = startMoveCallback;
    this.endMoveCallback    = endMoveCallback;

    // load the scale image
    this.scaleNode = new Image( scaleImage );

    // a transparant node with the approximate shape of the top of the scale - used for positioning dropped items
    // @private
    this.scaleTopNode = new Path( new Shape()
       .ellipse( this.scaleNode.centerX, this.scaleNode.top + 12,
        this.scaleNode.width * 0.4, this.scaleNode.height * 0.1, 0 ), {
      //fill: 'rgba(0,255,0,0.5)', // uncomment to see top zone
      lineWidth: 0
    } );

    // a transparant node overlaying the scale - defines a drop location
    var dropWidth  = this.scaleNode.width  * DROP_ZONE_X_SCALE;
    var dropHeight = this.scaleNode.height * DROP_ZONE_Y_SCALE;
    // @private
    this.dropNode = new Path( new Shape()
        .rect( this.scaleNode.left - ( dropWidth  - this.scaleNode.width ) / 2,
               this.scaleNode.top  - ( dropHeight - this.scaleNode.height ),
               dropWidth, dropHeight - DISPLAY_BOTTOM_OFFSET ), {
      //fill: 'rgba(255,255,0,0.5)', // uncomment to see drop zone
      lineWidth: 0
    } );

    // @private
    this.costOnlyDisplayX = this.scaleNode.centerX;
    this.costUnitDisplayX = this.scaleNode.centerX - ( DISPLAY_SIZE.width / 2 ) - DISPLAY_SPACING;

    this.showCostProperty = new Property( true );

    // cost of items display, always visible
    // @private
    this.costDisplayNode = new ValueDisplayNode( this.scale.costProperty, {
      centerX: this.costOnlyDisplayX,
      centerY: this.scaleNode.bottom - DISPLAY_BOTTOM_OFFSET,
      preText: currencySymbolString,
      decimalPlaces: 2,
      enableHideValue: options.enableHideCost,
      hideValueProperty: this.showCostProperty,
      hiddenValueText: costString
    } );

    // weight of items display, visibility changes
    // @private
    this.weightDisplayNode = new ValueDisplayNode( this.scale.weightProperty, {
      postText: lbsString,
      centerX: this.scaleNode.centerX + ( DISPLAY_SIZE.width / 2 ) + DISPLAY_SPACING,
      centerY: this.scaleNode.bottom - DISPLAY_BOTTOM_OFFSET
    } );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ this.scaleNode, this.scaleTopNode, this.dropNode, this.costDisplayNode, this.weightDisplayNode ];

    Node.call( this, options );

    // refresh on item change
    scale.itemDataProperty.link( function( itemData, oldData ) {

      var itemType = itemData.type;

      var isFruit = ( itemType === ItemData.APPLES.type  || itemType === ItemData.LEMONS.type ||
                      itemType === ItemData.ORANGES.type || itemType === ItemData.PEARS.type );
      var isCandy = ( itemType === ItemData.RED_CANDY.type   || itemType === ItemData.PURPLE_CANDY.type ||
                      itemType === ItemData.GREEN_CANDY.type || itemType === ItemData.BLUE_CANDY.type );

      // show/hide weight display for candy only
      self.weightDisplayNode.visible = isCandy;

      // move cost display
      if ( self.weightDisplayNode.visible ) {
        self.costDisplayNode.centerX = self.costUnitDisplayX;
      }
      else {
        self.costDisplayNode.centerX = self.costOnlyDisplayX;
      }

      var itemNode = ItemNodeFactory.createItem( new Item( itemData, ( isFruit ? 1 : 2 ) ) );

      // pre-compute stacked item positions
      var globalDropBounds = self.scaleTopNode.getGlobalBounds();
      var localDropBounds  = self.itemLayer.globalToParentBounds( globalDropBounds );
      var itemX = localDropBounds.minX - itemNode.width / 2 + NODE_X_SPACING;
      var itemY = localDropBounds.centerY - itemNode.height + 2;

      // save pre-colmputed staked positions (array of Vector2)
      self.stackedPositions = [];

      // save the Y coordinate for moving higher items to lower positions - use a .XX string
      self.stackedYPositions = [  itemY.toFixed( 2 ) ];

      for (var i = 0; i < ShoppingConstants.MAX_ITEMS-1; i++) {

        self.stackedPositions.push( new Vector2( itemX, itemY ) );

        itemX += itemNode.width + NODE_X_SPACING;

        if ( itemX >= localDropBounds.maxX ) {
          itemX = localDropBounds.minX + NODE_X_SPACING;
          itemY -= itemNode.height - NODE_Y_SPACING;

          self.stackedYPositions.push( itemY.toFixed( 2 ) );
        }
      }

      self.populate();
    } );
  }

  /**
   * Node used to display a numeric value associated with the items on the scale (i.e. cost, weight)
   * @param {Property.<number>} valueProperty
   * @param {Object} [options]
   * @returns {Panel}
   * @private
   */
  function ValueDisplayNode( valueProperty, options ) {

    options = options || {};

    options = _.extend( {
      minWidth: DISPLAY_SIZE.width,
      minHeight: DISPLAY_SIZE.height,
      preText: '',                      // optional text before the value (i.e. '$')
      decimalPlaces: 1,                 // decimal plce to show for the scale value
      postText: '',                     // optional text after the value (i.e. 'lbs')
      resize: false,
      cornerRadius: 5,
      lineWidth: 0,
      align: 'center',
      enableHideValue: false,
      hideValueProperty: new Property( false ),
      hiddenValueText: ''
    }, options );

    var self = this;

    this.enableHideValue   = options.enableHideValue;
    this.hideValueProperty = options.hideValueProperty;
    this.hiddenValueText   = options.hiddenValueText;

    var contentNode = new Node();

    if( this.enableHideValue  ) {
      this.showValueButton = new ExpandCollapseButton( this.hideValueProperty, {
        sideLength: 15
      } );
      contentNode.addChild( this.showValueButton );
    }

    // @private
    var valueText = new Text( '-', {
      left: ( this.showValueButton ? this.showValueButton.right + 4 : 0 ),
      top:  ( this.showValueButton ? this.showValueButton.top : 0 ),
      font: DISPLAY_FONT,
      maxWidth: 0.9 * DISPLAY_SIZE.width,
      maxHeight: 0.9 * DISPLAY_SIZE.height
    } );
    contentNode.addChild( valueText );

    // update value text
    Property.multilink( [ valueProperty, this.hideValueProperty ], function( value, hideValue ) {
      if( self.enableHideValue && !hideValue ) {
        valueText.setText( ' ' + self.hiddenValueText );
      } else {
        var valueString = Util.toFixed( value, options.decimalPlaces ).toString();
        valueText.setText( options.preText + ' ' + valueString + ' ' + options.postText );
      }
    } );

    return new Panel( contentNode, options);
  }

  unitRates.register( 'ScaleNode', ScaleNode );

  return inherit( Node, ScaleNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Checks if an area (bounds) is in/intersects a droppable location on the scale
     * @param {Bounds2} bounds - parent (layer) coordinates
     * @return {boolean}
     * @public
     */
    intersectsDropArea: function( bounds ) {
      var scaleBounds = this.parentToLocalBounds( bounds );
      return ( this.dropNode.intersectsBoundsSelf( scaleBounds ) ||
               this.dropNode.bounds.containsBounds( scaleBounds ) );
    },

    /**
     * Moves any out of place nodes back into a stacked position.
     * @public
     */
    adjustItemPositions: function( animate ) {
      var self = this;

      // get the current array for the item type
      var itemArray = this.scale.getItemsWithType( this.scale.itemDataProperty.value.type );

      var allNodes = [];
      var updateNodes = [];
      var availablePositions = self.stackedPositions.slice( 0 );

      // Filter out nodes that need to be repositioned, at the sme time figure out the available positions in the stack.
      this.itemLayer.getChildren().forEach( function( itemNode ) {

        if ( itemArray.contains( itemNode.item ) ) {

          allNodes.push( itemNode );

          // check if the node is in a correct position
          var index = availablePositions.findIndex( function( element, index, array ) {
              return element.equals( itemNode.item.position );
            }, this );

          if ( index < 0 ) {
            // not in correct position, add the node to the update list
            updateNodes.push( itemNode );
          }
          else {
            // in correct position, remove this position from the available list
            availablePositions.splice( index, 1 );
          }
        }
      } );

      // next reposition those nodes not stacked correctly - these will automatically go to the bottom first
      updateNodes.forEach( function( itemNode ) {
        if ( availablePositions.length ) {
          var position = availablePositions.shift();
          itemNode.item.setPosition( position.x, position.y, animate );
        }
      } );

      // for remaining available positions, move higher nodes to lower positions
      // for every open bottom spot see if there's a nearby node to fill it
      for (var i = 0; i < availablePositions.length; i++) {

        var position = availablePositions[i];

        // only consider bottom positions
        if( position.y.toFixed( 2 ) !== self.stackedYPositions[0] ) {
          continue;
        }

        for (var j = 0; j < allNodes.length; j++) {
          var itemNode = allNodes[j];

          // only consider nodes that are not on the bottom
          if( itemNode.item.position.y.toFixed( 2 ) !== self.stackedYPositions[0] ) {

            var nodeDistance = itemNode.item.position.distance( position );
            if ( nodeDistance < 1.5 * itemNode.width ) {
              // move the node
              itemNode.item.setPosition( position.x, position.y, animate );

              // remove the position from the availble list
              availablePositions.splice( i, 1);
              break;
            }
          }
        }
      }
    },

    /**
     * Creates nodes for each item in the model
     * @public
     */
    populate: function() {

      var self = this;

      // get the current array for the item type
      var itemArray = this.scale.getItemsWithType( this.scale.itemDataProperty.value.type );

      // checks the item layer to see if there is already a node for the item
      // @param {Item}
      // @returns {boolean}
      function itemNodeExists( item ) {
        var exists = false;

        var itemNodeArray = self.itemLayer.getChildren();

        for (var i = 0; i < itemNodeArray.length; i++) {
          if ( itemNodeArray[i].item === item ) {
            exists = true;
            break;
          }
        }
        return exists;
      }

      // create nodes for all items of type (fruit | produce)
      itemArray.forEach( function( item ) {

        // only populate/create nodes for new items
        if ( !itemNodeExists( item ) ) {

          // create new item node
          var itemNode = ItemNodeFactory.createItem( item, {
            moveStartCallback: self.startMoveCallback,
            moveEndCallback: self.endMoveCallback
          } );

          // add to the screen layer for correct rendering
          self.itemLayer.addChild( itemNode );
        }
      } );

      this.adjustItemPositions( false );
    },

    /**
     * Reset the scale node to its initial state (for the currently selected item type
     * @public
     */
    resetCurrentItem: function() {
      this.scale.resetCurrentItem();
    },

    /**
     * Reset the scale node to its initial state (all item types)
     * @public
     */
    reset: function() {
      this.populate();
    }

  } ); // inherit

} ); // define


