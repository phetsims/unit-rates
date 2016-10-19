// Copyright 2016, University of Colorado Boulder

/**
 * Factory for creating the various item nodes (fruit, produce, candy, bags).
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var MovableNode = require( 'UNIT_RATES/common/view/MovableNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var appleImage = require( 'image!UNIT_RATES/apple.png' );
  var lemonImage = require( 'image!UNIT_RATES/lemon.png' );
  var orangeImage = require( 'image!UNIT_RATES/orange.png' );
  var pearImage = require( 'image!UNIT_RATES/pear.png' );
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var cucumberImage = require( 'image!UNIT_RATES/cucumber.png' );
  var potatoImage = require( 'image!UNIT_RATES/potato.png' );
  var tomatoImage = require( 'image!UNIT_RATES/tomato.png' );
  var blueCandyImage = require( 'image!UNIT_RATES/blue_candy.png' );
  var greenCandyImage = require( 'image!UNIT_RATES/green_candy.png' );
  var purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );
  var redCandyImage = require( 'image!UNIT_RATES/red_candy.png' );

  var appleBagImage = require( 'image!UNIT_RATES/apple_bag.png' );
  var lemonBagImage = require( 'image!UNIT_RATES/lemon_bag.png' );
  var orangeBagImage = require( 'image!UNIT_RATES/orange_bag.png' );
  var pearBagImage = require( 'image!UNIT_RATES/pear_bag.png' );
  var carrotBagImage = require( 'image!UNIT_RATES/carrot_bag.png' );
  var cucumberBagImage = require( 'image!UNIT_RATES/cucumber_bag.png' );
  var potatoBagImage = require( 'image!UNIT_RATES/potato_bag.png' );
  var tomatoBagImage = require( 'image!UNIT_RATES/tomato_bag.png' );
  var blueCandyBagImage = require( 'image!UNIT_RATES/blue_candy_bag.png' );
  var greenCandyBagImage = require( 'image!UNIT_RATES/green_candy_bag.png' );
  var purpleCandyBagImage = require( 'image!UNIT_RATES/purple_candy_bag.png' );
  var redCandyBagImage = require( 'image!UNIT_RATES/red_candy_bag.png' );

  var ItemNodeFactory = {

    /**
     * Creates a node of a specified size for specified item
     *
     * @param {ItemData} item - the item to create (i.e. apple, carrot)
     * @param {Object} [options]
     * @returns {MovableNode}
     * @public
     */
    createItemNode: function( item, options ) {

      options = _.extend( {
        imageScale: 0.5,
        moveStartCallback: null,  // function called when item drag starts
        moveCallback: null,       // function called during the drag
        moveEndCallback: null,    // function called when item drag ends
        pickable: true //TODO this doesn't seem appropriate, since item nodes are used in (e.g.) combo boxes
      }, options );

      // Get the item's image name
      var imageName = null;
      var singleItem = ( item.countProperty.value === 1 );
      switch( item.type ) {

        // fruits
        case ItemData.APPLES.type:
          imageName = ( singleItem ) ? appleImage : appleBagImage;
          break;
        case ItemData.LEMONS.type:
          imageName = singleItem ? lemonImage : lemonBagImage;
          break;
        case ItemData.ORANGES.type:
          imageName = singleItem ? orangeImage : orangeBagImage;
          break;
        case ItemData.PEARS.type:
          imageName = singleItem ? pearImage : pearBagImage;
          break;

        // vegetables
        case ItemData.CARROTS.type:
          imageName = singleItem ? carrotImage : carrotBagImage;
          break;
        case ItemData.CUCUMBERS.type:
          imageName = singleItem ? cucumberImage : cucumberBagImage;
          break;
        case ItemData.POTATOES.type:
            imageName = singleItem ? potatoImage : potatoBagImage;
          break;
        case ItemData.TOMATOES.type:
            imageName = singleItem ? tomatoImage : tomatoBagImage;
          break;

        // candy
        case ItemData.PURPLE_CANDY.type:
            imageName = singleItem ? purpleCandyImage : purpleCandyBagImage;
          break;
        case ItemData.RED_CANDY.type:
            imageName = singleItem ? redCandyImage : redCandyBagImage;
          break;
        case ItemData.GREEN_CANDY.type:
            imageName = singleItem ? greenCandyImage : greenCandyBagImage;
          break;
        case ItemData.BLUE_CANDY.type:
            imageName = singleItem ? blueCandyImage : blueCandyBagImage;
          break;

        default:
          throw new Error( false, 'unsupported item type: ' + item.type );
      }

      var itemNode = new MovableNode( item, new Vector2( 0, 0 ), options );
      //TODO this should be doable via MovableNode options
      itemNode.addDragListeners( options.moveStartCallback, options.moveCallback, options.moveEndCallback );
      //TODO this should be doable via MovableNode options
      itemNode.addChild( new Image( imageName, { scale: options.imageScale } ) );

      return itemNode;
    }

  }; // ItemNodeFactory

  unitRates.register( 'ItemNodeFactory', ItemNodeFactory );

  return ItemNodeFactory;

} ); // define
