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
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var ItemNodeFactory = require( 'UNIT_RATES/shopping/view/ItemNodeFactory' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'SUN/Panel' );
  var Util = require( 'DOT/Util' );
  var Random = require( 'DOT/Random' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // images
  var scaleImage = require( 'image!UNIT_RATES/scale.png' );

  // constants
  var DISPLAY_BOTTOM_OFFSET = 32;
  var DISPLAY_SPACING       = 10;  // space beteen mutliple displays
  var DISPLAY_FONT          = new PhetFont( 20 );
  var DISPLAY_SIZE          = new Dimension2( 70, 40 );
  var RAND                  = new Random();

  // strings
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );
  var lbsString = require( 'string!UNIT_RATES/lbs' );

  /**
   *
   * @param {Scale} scale - model
   * @param {Node} itemLayer - a container node which holds the item nodes. Used here for local posiitoning of items
   * @param (function} itemMovedCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function ScaleNode( scale, itemLayer, itemMovedCallback, options ) {

    options = options || {};

    var self = this;

    this.scale = scale;
    this.itemLayer = itemLayer;
    this.itemMovedCallback = itemMovedCallback;
    this.typeIsCandy = false;

    // load the scale image
    this.scaleNode = new Image( scaleImage, { pickable: true } );

    // a transparant node with the approximate shape of the top of the scale - defines a drop location
    // @private
    this.scaleDropNode = new Path( new Shape()
       .ellipse( this.scaleNode.centerX, this.scaleNode.top + 12,
        this.scaleNode.width * 0.47, this.scaleNode.height * 0.13, 0 ), {
      //fill: 'orange', // uncomment to see drop zone
      lineWidth: 0,
      pickable: true
    } );

    // @private
    this.costOnlyDisplayX = this.scaleNode.centerX;
    this.costUnitDisplayX = this.scaleNode.centerX - ( DISPLAY_SIZE.width / 2 ) - DISPLAY_SPACING;

    // cost of items display, always visible
    // @private
    this.costDisplayNode = new ValueDisplayNode( this.scale.costProperty, {
      preText: currencySymbolString,
      decimalPlaces: 2,
      centerX: this.costUnitDisplayX,
      centerY: this.scaleNode.bottom - DISPLAY_BOTTOM_OFFSET
    } );

    // weight of items display, visibility changes
    // @private
    this.weightDisplayNode = new ValueDisplayNode( this.scale.weightProperty, {
      postText: lbsString,
      centerX: this.scaleNode.centerX + ( DISPLAY_SIZE.width / 2 ) + DISPLAY_SPACING,
      centerY: this.scaleNode.bottom - DISPLAY_BOTTOM_OFFSET
    } );

    // refresh on item change
    scale.itemDataProperty.link( function( data, oldData ) {

      // Check data type
      self.typeIsCandy = ( data.type === ItemData.RED_CANDY.type  || data.type === ItemData.YELLOW_CANDY.type ||
                           data.type === ItemData.GREEN_CANDY.type || data.type === ItemData.BLUE_CANDY.type );

      // Show/hide candy specific UI elements
      //self.candyContainer.visible    = self.typeIsCandy;
      self.weightDisplayNode.visible = self.typeIsCandy;

      // move cost display
      if ( self.weightDisplayNode.visible ) {
        self.costDisplayNode.centerX = self.costUnitDisplayX;
      }
      else {
        self.costDisplayNode.centerX = self.costOnlyDisplayX;
      }

      self.populate();
    } );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ this.scaleNode, this.scaleDropNode, this.costDisplayNode, this.weightDisplayNode ];

    Node.call( this, options );

  }

  /**
   * Node used to display a numeric value associated with the items on the scale (i.e. cost, weight)
   * @param {Property} property
   * @param {Object} [options]
   * @returns {Panel}
   * @private
   */
  function ValueDisplayNode( property, options ) {

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
      align: 'center'
    }, options );

    // @private
    var valueText = new Text( '-', {
      font: DISPLAY_FONT,
      maxWidth: 0.9 * DISPLAY_SIZE.width,
      maxHeight: 0.9 * DISPLAY_SIZE.height
    } );

    // update value text
    property.link( function( value, oldValue ) {
      var fixedValue = Util.toFixed( value, options.decimalPlaces );
      valueText.setText( options.preText + ' ' + fixedValue.toString() + ' ' + options.postText );
    } );

    return new Panel( valueText, options);
  }

  unitRates.register( 'ScaleNode', ScaleNode );

  return inherit( Node, ScaleNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Checks if a point is in a droppable location on the scale
     * @param {Vector2} bounds - parent (layer) coordinates
     * @return {boolean}
     * @public
     */
    intersectsDropArea: function( bounds ) {
      var scaleBounds = this.parentToLocalBounds( bounds );
      return this.scaleDropNode.intersectsBoundsSelf( scaleBounds );
    },

    /**
     * Adjusts item nodes bottom center coordinate to be in the drop area, basically so items appear
     * to be on the scale all the time.
     * @public
     */
     adjustItemPositions: function() {

      var globalDropBounds = this.scaleDropNode.getGlobalBounds();
      var localDropBounds = this.itemLayer.globalToParentBounds( globalDropBounds );

      // get the current array for the item type
      var itemArray = this.scale.getItemsWithType( this.scale.itemDataProperty.value.type );

      // Make sure bottoms of all itemNodes are on the scale
      this.itemLayer.getChildren().forEach( function( itemNode ) {

        if ( itemArray.contains( itemNode.item ) ) {
          var x = itemNode.item.positionProperty.value.x;
          var y = itemNode.item.positionProperty.value.y;

          if( x < localDropBounds.minX ) {
            x = localDropBounds.minX;
          }
          else if( x > localDropBounds.maxX ) {
            x = localDropBounds.maxX;
          }

          var bottomY = y + itemNode.height / 2;
          if( bottomY < localDropBounds.minY ) {
              y  = ( localDropBounds.maxY + localDropBounds.minY ) / 2 + ( itemNode.height / 2 );
          }
          else if( bottomY > localDropBounds.maxY ) {
              y  = ( localDropBounds.maxY + localDropBounds.minY ) / 2 - ( itemNode.height / 2 );
          }

          itemNode.item.setPosition( x, y, false );
        }
      } );
    },

    /**
     * Creates nodes for each item in the model
     * @public
     */
    populate: function() {

      var self = this;

      // get the current array for the item type
      var itemArray = this.scale.getItemsWithType( this.scale.itemDataProperty.value.type );

      // calc the drop zone center (for positioning new items)
      var dropCenter = this.scaleDropNode.getGlobalBounds().getCenter();
      var layerDropCenter = this.itemLayer.globalToParentPoint( dropCenter );

      // create nodes for all items of type (fruit | produce)
      itemArray.forEach( function( item ) {

        var position = item.positionProperty.value;

        // create new item node
        var itemNode = ItemNodeFactory.createItem( item, ShoppingConstants.ITEM_SIZE, position, null, self.itemMovedCallback );

        // initial position - create a random position on the shelf
        if(position.x === 0 && position.y === 0) {

          // jitter the initial positions a bit
          var jitterX =  ( ( RAND.random() - 0.5 ) * ( self.scaleDropNode.width * 0.8 ) );
          var jitterY =  ( ( RAND.random() - 0.5 ) * ( self.scaleDropNode.height * 0.25 ) );
          var x = layerDropCenter.x + jitterX;
          var y = layerDropCenter.y + jitterY - itemNode.height / 2;
          item.setPosition( x, y, false );
        }

        // add to the screen layer for correct rendering
        self.itemLayer.addChild( itemNode );
      } );

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


