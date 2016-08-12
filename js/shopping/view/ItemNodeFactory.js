// Copyright 2002-2016, University of Colorado Boulder

/**
 * Factory for creating the various item nodes (fruit, produce, candy, bags). These are generic for now and may be
 * replaced with static artwork at a later time.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemNode = require( 'UNIT_RATES/shopping/view/ItemNode' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Vector2 = require( 'DOT/Vector2' );
  var Random = require( 'DOT/Random' );

  // contants
  var RAND = new Random();
  var BACKGROUND_COLOR = 'rgba(0,0,0,0)';

  // images
  var appleImage        = require( 'image!UNIT_RATES/apple.png' );
  var lemonImage        = require( 'image!UNIT_RATES/lemon.png' );
  var orangeImage       = require( 'image!UNIT_RATES/orange.png' );
  var pearImage         = require( 'image!UNIT_RATES/pear.png' );
  var carrotImage       = require( 'image!UNIT_RATES/carrot.png' );
  var cucumberImage     = require( 'image!UNIT_RATES/cucumber.png' );
  var potatoImage       = require( 'image!UNIT_RATES/potato.png' );
  var tomatoImage       = require( 'image!UNIT_RATES/tomato.png' );
  var blueCandyImage    = require( 'image!UNIT_RATES/blue_candy.png' );
  var greenCandyImage   = require( 'image!UNIT_RATES/green_candy.png' );
  var purpleCandyImage  = require( 'image!UNIT_RATES/purple_candy.png' );
  var redCandyImage     = require( 'image!UNIT_RATES/red_candy.png' );

  var appleBagImage        = require( 'image!UNIT_RATES/apple_bag.png' );
  var lemonBagImage        = require( 'image!UNIT_RATES/lemon_bag.png' );
  var orangeBagImage       = require( 'image!UNIT_RATES/orange_bag.png' );
  var pearBagImage         = require( 'image!UNIT_RATES/pear_bag.png' );
  var carrotBagImage       = require( 'image!UNIT_RATES/carrot_bag.png' );
  var cucumberBagImage     = require( 'image!UNIT_RATES/cucumber_bag.png' );
  var potatoBagImage       = require( 'image!UNIT_RATES/potato_bag.png' );
  var tomatoBagImage       = require( 'image!UNIT_RATES/tomato_bag.png' );
  var blueCandyBagImage    = require( 'image!UNIT_RATES/blue_candy_bag.png' );
  var greenCandyBagImage   = require( 'image!UNIT_RATES/green_candy_bag.png' );
  var purpleCandyBagImage  = require( 'image!UNIT_RATES/purple_candy_bag.png' );
  var redCandyBagImage     = require( 'image!UNIT_RATES/red_candy_bag.png' );

  var ItemNodeFactory = {

     /**
     * Creates a node of a specified size for specified item
     * @param {ItemData} item - the item to create (i.e. apple, carrot)
     * @param {number} size - the width & height (all items are square)
     * @param (function(ItemNode)} [moveStartCallback] - function called when item drag starts
     * @param (function(ItemNode)} [moveEndCallback] - function called when item drag ends
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createItem: function( item, size, moveStartCallback, moveEndCallback, options ) {

      var itemNode = new ItemNode( item, new Vector2( 0, 0 ), options );
      itemNode.addDragListeners( moveStartCallback, moveEndCallback );

      var imageNode = null;

      switch( item.type ) {
        case ItemData.APPLES.type:
          imageNode = ( item.count === 1 ?
            new Image( appleImage,    { scale: 0.025 } ) :
            new Image( appleBagImage, { scale: 0.045 } ) );
          break;
        case ItemData.LEMONS.type:
          imageNode = ( item.count === 1 ?
            new Image( lemonImage,    { scale: 0.025 } ) :
            new Image( lemonBagImage, { scale: 0.045 } ) );
          break;
        case ItemData.ORANGES.type:
          imageNode = ( item.count === 1 ?
            new Image( orangeImage,    { scale: 0.025 } ) :
            new Image( orangeBagImage, { scale: 0.045 } ) );
          break;
        case ItemData.PEARS.type:
          imageNode = ( item.count === 1 ?
            new Image( pearImage,    { scale: 0.025 } ) :
            new Image( pearBagImage, { scale: 0.045 } ) );
          break;
        case ItemData.CARROTS.type:
          imageNode = ( item.count === 1 ?
            new Image( carrotImage,    { scale: 0.025 } ) :
            new Image( carrotBagImage, { scale: 0.045 } ) );
          break;
        case ItemData.CUCUMBERS.type:
          imageNode = ( item.count === 1 ?
            new Image( cucumberImage,    { scale: 0.025 } ) :
            new Image( cucumberBagImage, { scale: 0.045 } ) );
          break;
        case ItemData.POTATOES.type:
          imageNode = ( item.count === 1 ?
            new Image( potatoImage,    { scale: 0.025 } ) :
            new Image( potatoBagImage, { scale: 0.045 } ) );
          break;
        case ItemData.TOMATOES.type:
          imageNode = ( item.count === 1 ?
            new Image( tomatoImage,    { scale: 0.025 } ) :
            new Image( tomatoBagImage, { scale: 0.045 } ) );
          break;
        case ItemData.PURPLE_CANDY.type:
          imageNode = ( item.count === 1 ?
            new Image( purpleCandyImage,    { scale: 0.025 } ) :
            new Image( purpleCandyBagImage, { scale: 0.030 } ) );
          break;
        case ItemData.RED_CANDY.type:
          imageNode = ( item.count === 1 ?
            new Image( redCandyImage,    { scale: 0.025 } ) :
            new Image( redCandyBagImage, { scale: 0.030 } ) );
          break;
        case ItemData.GREEN_CANDY.type:
          imageNode = ( item.count === 1 ?
            new Image( greenCandyImage,    { scale: 0.025 } ) :
            new Image( greenCandyBagImage, { scale: 0.030 } ) );
          break;
        case ItemData.BLUE_CANDY.type:
          imageNode = ( item.count === 1 ?
            new Image( blueCandyImage,    { scale: 0.025 } ) :
            new Image( blueCandyBagImage, { scale: 0.030 } ) );
          break;
        default:
          assert && assert( false, 'Node factory cannot create item of unrecognized type' );
      }

      assert && assert( imageNode !== null, 'Unable to create item node of type:' + item.type );

      itemNode.addChild( imageNode );

      return itemNode;
    }

  }; // ItemNodeFactory

  unitRates.register( 'ItemNodeFactory', ItemNodeFactory );

  return ItemNodeFactory;

} ); // define
