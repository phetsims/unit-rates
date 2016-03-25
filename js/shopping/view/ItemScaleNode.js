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
  var Dimension2 = require( 'DOT/Dimension2' );

  // images
  var scaleImage = require( 'mipmap!UNIT_RATES/scale.png' );

  // constants
  var DISPLAY_SIZE = new Dimension2( 80, 50 );
  var DISPLAY_BOTTOM_OFFSET = 32;
  var DISPLAY_SPACING = 10;  // space beteen mutliple displays
  var DISPLAY_FONT = new PhetFont( 20 );

  // strings
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );
  var weightUnitString = require( 'string!UNIT_RATES/weightUnit' );

  /**
   *
   * @param {Scale} scale
   * @param {Node} itemLayer
   * @param (function} itemMovedCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function ItemScaleNode( scale, itemLayer, itemMovedCallback, options ) {

    options = options || {};

    Node.call( this, options );

    var self = this;

    this.scale = scale;
    this.itemLayer = itemLayer;
    this.itemMovedCallback = itemMovedCallback;

    // This is Loading the scale image and scaling it to desired width and adding to the node
    this.scaleNode = new Image( scaleImage, { pickable: true } );
    this.addChild( this.scaleNode );

    // a transparant node with the approximate shape of the top of the scale - used for a drop location
    this.dropNode = new Path( new Shape()
       .ellipse( this.scaleNode.centerX, this.scaleNode.top + 12,
        this.scaleNode.width * 0.47, this.scaleNode.height * 0.13, 0 ), {
      //fill: 'orange', // uncomment to see drop zone
      lineWidth: 0,
      pickable: true
    } );
    this.scaleNode.addChild( this.dropNode );

    // @private
    this.costOnlyDisplayX = self.centerX;
    this.costUnitDisplayX = this.centerX - ( DISPLAY_SIZE.width / 2 ) - DISPLAY_SPACING;

    // cost of items display, always visible
    // @private
    this.costDisplayNode = new ValueDisplayNode( this.scale.costProperty, {
      preText: currencySymbolString,
      decimalPlaces: 2,
      centerX: this.costUnitDisplayX,
      centerY: this.bottom - DISPLAY_BOTTOM_OFFSET
    } );
    this.addChild( this.costDisplayNode );

    // weight of items display, visibility changes
    // @private
    this.weightDisplayNode = new ValueDisplayNode( this.scale.weightProperty, {
      postText: weightUnitString,
      centerX: this.centerX + ( DISPLAY_SIZE.width / 2 ) + DISPLAY_SPACING,
      centerY: this.bottom - DISPLAY_BOTTOM_OFFSET
    } );
    this.addChild( this.weightDisplayNode );

    // refresh on item change
    scale.itemDataProperty.link( function( data, oldData ) {

      // Check data type
      self.weightDisplayNode.visible = ( data === ItemData.RED_CANDY   || data === ItemData.YELLOW_CANDY ||
                                         data === ItemData.GREEN_CANDY || data === ItemData.BLUE_CANDY );

      // move cost display
      if ( self.weightDisplayNode.visible ) {
        self.costDisplayNode.centerX = self.costUnitDisplayX;
      }
      else {
        self.costDisplayNode.centerX = self.costOnlyDisplayX;
      }

      self.populate();

    } );
  }

  /**
   *
   * @param {Property} property
   * @param {Object} [options]
   * @returns {Panel}
   * @private
   */
  function ValueDisplayNode( property, options ) {

    options = _.extend( {
      minWidth: DISPLAY_SIZE.width,
      minHeight: DISPLAY_SIZE.height,
      preText: '',
      decimalPlaces: 1,
      postText: '',
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
      var fixedValue = Util.toFixed( value,  options.decimalPlaces );
      valueText.setText( options.preText + fixedValue.toString() + options.postText );
    } );

    return new Panel( valueText, options);
  }

  unitRates.register( 'ItemScaleNode', ItemScaleNode );

  return inherit( Node, ItemScaleNode, {

    /**
     * Checks if a point is in a droppable location
     *
     * @param {Vector2} point - parent (layer) coordinates
     * @return {boolean}
     * @public
     */
    pointInDropArea: function( point ) {
      var scalePoint = this.parentToLocalPoint( point );
      var localPoint = this.dropNode.parentToLocalPoint( scalePoint );
      return this.dropNode.containsPoint( localPoint );
    },

    /**
     * Creates nodes for each item
     * @public
     */
    populate: function() {

      var self = this;

      // get the current array for the item type
      var itemArray = this.scale.getItemsWithType( this.scale.itemDataProperty.value.type );

      // create nodes for all items of type
      itemArray.forEach( function( item ) {

        var position = item.positionProperty.value;

        // create new item node
        var itemNode = ItemNodeFactory.createItem( item, ShoppingConstants.ITEM_SIZE, position, self.itemMovedCallback );

        // add to the screen for layering purposes
        self.itemLayer.addChild( itemNode );
      } );
    },

    /**
     * Reset the scale node to its initial state
     * @public
     */
    reset: function() {
      // FIXME
    }


  } ); // inherit

} ); // define


