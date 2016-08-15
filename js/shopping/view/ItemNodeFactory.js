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
  var Image = require( 'SCENERY/nodes/Image' );
  var Vector2 = require( 'DOT/Vector2' );

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
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createItem: function( item, options ) {

      options = _.extend( {
        imageScale: -1,
        moveStartCallback: null,  // function called when item drag starts
        moveEndCallback: null     // function called when item drag ends
     }, options || {} );

      var itemNode = new ItemNode( item, new Vector2( 0, 0 ), options );
      itemNode.addDragListeners( options.moveStartCallback, options.moveEndCallback );

      var imageName  = null;
      var imageScale = null;

      // Get the item image name & scaling based on the Item type & count
      switch( item.type ) {
        case ItemData.APPLES.type:
          if( item.count === 1 ) {
            imageName  = appleImage;
            imageScale = 0.024;
          }
          else {
            imageName  = appleBagImage;
            imageScale = 0.045;
          }
          break;
        case ItemData.LEMONS.type:
          if( item.count === 1 ) {
            imageName  = lemonImage;
            imageScale = 0.020;
          }
          else {
            imageName  = lemonBagImage;
            imageScale = 0.045;
          }
          break;
        case ItemData.ORANGES.type:
          if( item.count === 1 ) {
            imageName  = orangeImage;
            imageScale = 0.022;
          }
          else {
            imageName  = orangeBagImage;
            imageScale = 0.045;
          }
          break;
        case ItemData.PEARS.type:
          if( item.count === 1 ) {
            imageName  = pearImage;
            imageScale = 0.026;
          }
          else {
            imageName  = pearBagImage;
            imageScale = 0.045;
          }
          break;
        case ItemData.CARROTS.type:
          if( item.count === 1 ) {
            imageName  = carrotImage;
            imageScale = 0.025;
          }
          else {
            imageName  = carrotBagImage;
            imageScale = 0.045;
          }
          break;
        case ItemData.CUCUMBERS.type:
          if( item.count === 1 ) {
            imageName  = cucumberImage;
            imageScale = 0.025;
          }
          else {
            imageName  = cucumberBagImage;
            imageScale = 0.045;
          }
          break;
        case ItemData.POTATOES.type:
          if( item.count === 1 ) {
            imageName  = potatoImage;
            imageScale = 0.025;
          }
          else {
            imageName  = potatoBagImage;
            imageScale = 0.045;
          }
          break;
        case ItemData.TOMATOES.type:
          if( item.count === 1 ) {
            imageName  = tomatoImage;
            imageScale = 0.025;
          }
          else {
            imageName  = tomatoBagImage;
            imageScale = 0.045;
          }
          break;
        case ItemData.PURPLE_CANDY.type:
          if( item.count === 1 ) {
            imageName  = purpleCandyImage;
            imageScale = 0.025;
          }
          else {
            imageName  = purpleCandyBagImage;
            imageScale = 0.025;
          }
          break;
        case ItemData.RED_CANDY.type:
          if( item.count === 1 ) {
            imageName  = redCandyImage;
            imageScale = 0.025;
          }
          else {
            imageName  = redCandyBagImage;
            imageScale = 0.025;
          }
          break;
        case ItemData.GREEN_CANDY.type:
          if( item.count === 1 ) {
            imageName  = greenCandyImage;
            imageScale = 0.025;
          }
          else {
            imageName  = greenCandyBagImage;
            imageScale = 0.025;
          }
          break;
        case ItemData.BLUE_CANDY.type:
          if( item.count === 1 ) {
            imageName  = blueCandyImage;
            imageScale = 0.025;
          }
          else {
            imageName  = blueCandyBagImage;
            imageScale = 0.025;
          }
          break;
        default:
          assert && assert( false, 'Node factory cannot create item of unrecognized type' );
      }

      assert && assert( imageName !== null, 'Unable to create item node of type:' + item.type );

      var imageNode = new Image( imageName, { scale: ( options.imageScale > 0 ? options.imageScale : imageScale ) } );

      itemNode.addChild( imageNode );

      return itemNode;
    }

  }; // ItemNodeFactory

  unitRates.register( 'ItemNodeFactory', ItemNodeFactory );

  return ItemNodeFactory;

} ); // define
