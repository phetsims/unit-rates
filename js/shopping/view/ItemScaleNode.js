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
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'SUN/Panel' );
  var Emitter = require( 'AXON/Emitter' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // images
  var scaleImage = require( 'mipmap!UNIT_RATES/scale.png' );

  // constants
  var DISPLAY_SIZE = new Dimension2( 80, 50 );
  var DISPLAY_BOTTOM_OFFSET = 32;
  var DISPLAY_SPACING = 10;  // space beteen mutliple displays
  var DISPLAY_FONT = new PhetFont( 20 );

  /**
   *
   * @param {Scale} scale
   * @param (function} itemMovedCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function ItemScaleNode( scale, itemMovedCallback, options ) {

    options = options || {};

    Node.call( this, options );

    var self = this;
    this.scale = scale;

    // @protected - used to tell when an item node is moved
    this.dragEndEmitter = new Emitter();
    this.dragEndEmitter.addListener( itemMovedCallback );

    // This is Loading the scale image and scaling it to desired width and adding to the node
    this.scaleNode = new Image( scaleImage, { pickable: true } );
    this.addChild( this.scaleNode );

    // @private
    this.costOnlyDisplayX = self.centerX;
    this.costUnitDisplayX = this.centerX - ( DISPLAY_SIZE.width / 2 ) - DISPLAY_SPACING;

    // cost of items display, always visible
    // @private
    this.costDisplayNode = new ValueDisplayNode( {
      centerX: this.costUnitDisplayX,
      centerY: this.bottom - DISPLAY_BOTTOM_OFFSET
    } );
    this.addChild( this.costDisplayNode );

    // weight of items display, visibility changes
    // @private
    this.weightDisplayNode = new ValueDisplayNode( {
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

      self.refresh();
    } );

    // refresh on item additions/removals
    scale.addListeners( function( item, observableArray ) {
      self.refresh()
    },
    function( item, observableArray ) {
      self.refresh()
    } );
  }

  /**
   *
   * @param {Object} [options]
   * @returns {Panel}
   * @private
   */
  function ValueDisplayNode( options ) {

    options = _.extend( {
      minWidth: DISPLAY_SIZE.width,
      minHeight: DISPLAY_SIZE.height,
      resize: false,
      cornerRadius: 5,
      lineWidth: 0,
      align: 'center'
    }, options );

    // @private
    this.valueText = new Text( '-', {
      font: DISPLAY_FONT,
      maxWidth: 0.9 * DISPLAY_SIZE.width,
      maxHeight: 0.9 * DISPLAY_SIZE.height
    } );

    return new Panel( this.valueText, options);
  }

  unitRates.register( 'ItemScaleNode', ItemScaleNode );

  return inherit( Node, ItemScaleNode, {

    /**
     * Checks if a point is in a droppable location
     *
     * @param {Vector2} point
     * @return {boolean}
     * @public
     */
    pointInDropArea: function( point ) {
      var localPoint = this.scaleNode.globalToParentPoint( point );
      return this.scaleNode.containsPoint( localPoint );
    },

    /**
     * Creates nodes for each item
     * @public
     */
    refresh: function() {

      var self = this;

      // remove old nodes
      this.scaleNode.removeAllChildren();

      // create nodes for all items of type
      var itemArray = this.scale.getItemsWithType( this.scale.itemDataProperty.value.type );
      itemArray.forEach( function( item ) {

        var itemNode = ItemNodeFactory.createItemNode( item, ShoppingConstants.ITEM_SIZE );
        self.scaleNode.addChild( itemNode );

        // translate node according to item position property
        item.positionProperty.link( function( position, oldPosition ) {
          // update node position in local coordinates
          itemNode.translation = itemNode.globalToParentPoint( position );
        } );

        // add a drag listener
        itemNode.addInputListener( new SimpleDragHandler( {
          end: function( e ) {
            // announce drag complete
            self.dragEndEmitter.emit1( item );
          },

          translate: function( translation ) {
            // update node position in screen coordinates
            item.positionProperty.value = itemNode.parentToGlobalPoint( translation.position );
          }

        } ) );

      } );

      console.log( 'Refresh scale items: ' + itemArray.length);
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


