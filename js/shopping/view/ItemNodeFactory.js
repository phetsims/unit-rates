// Copyright 2002-2016, University of Colorado Boulder

/**
 * Factory for creating the various item nodes (fruit, produce, candy, bags).
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  // constants


  var ItemNodeFactory = {

     /**
     * Creates an node of size for specified item
     *
     * @param {Item} item
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createItemNode: function( item, size ) {

      var itemNode = null;

      switch( item.type ) {
        case ItemData.APPLES.type:
          itemNode = this.createApple( size );
          break;
        case ItemData.LEMONS.type:
          itemNode = this.createLemon( size );
          break;
        case ItemData.ORANGES.type:
          itemNode = this.createOrange( size );
          break;
        case ItemData.PEARS.type:
          itemNode = this.createPear( size );
          break;
        case ItemData.CARROTS.type:
          itemNode = this.createCarrot( size );
          break;
        case ItemData.CUCUMBERS.type:
          itemNode = this.createCucumber( size );
          break;
        case ItemData.POTATOES.type:
          itemNode = this.createPotatoe( size );
          break;
        case ItemData.TOMATOES.type:
          itemNode = this.createTomatoe( size );
          break;
        case ItemData.RED_CANDY.type:
          itemNode = this.createRedCandy( size );
          break;
        case ItemData.YELLOW_CANDY.type:
          itemNode = this.createYellowCandy( size );
          break;
        case ItemType.GREEN_CANDY.type:
          itemNode = this.createGreenCandy( size );
          break;
        case ItemData.BLUE_CANDY.type:
          itemNode = this.createBlueCandy( size );
          break;
        default:
      }

      assert && assert( itemNode !== null, 'Unable to create item node of type:' + item.type );

      itemNode.item = item;

      return itemNode;
    },

    // ----------------------------- Fruit ----------------------------- //

    /**
     * Creates a apple
     *
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createApple: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'crimson', stroke: 'black' } )
        ]
      } );
    },

    /**
     * Creates a lemon
     *
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createLemon: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'gold', stroke: 'black' } )
        ]
      } );
    },

    /**
     * Creates a orange
     *
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createOrange: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'darkorange', stroke: 'black' } )
        ]
      } );
    },

    /**
     * Creates a pear
     *
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createPear: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'lime', stroke: 'black' } )
        ]
      } );
    },

    // ----------------------------- Produce ----------------------------- //

    /**
     * Creates a carrot
     *
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createCarrot: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'orange', stroke: 'black' } )
        ]
      } );
    },

    /**
     * Creates a cucumber
     * @returns {Node}
     * @public
     */
    createCucumber: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'darkgreen', stroke: 'black' } )
        ]
      } );
    },

    /**
     * Creates a potatoe
     *
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createPotatoe: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'sienna', stroke: 'black' } )
        ]
      } );
    },

    /**
     * Creates a tomatoe
     *
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createTomatoe: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'firebrick', stroke: 'black' } )
        ]
      } );
    },

    // ----------------------------- Candy ----------------------------- //

    /**
     * Creates a red candy
     *
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createRedCandy: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'red', stroke: 'black' } )
        ]
      } );
    },

    /**
     * Creates a yellow candy
     *
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createYellowCandy: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'yellow', stroke: 'black' } )
        ]
      } );
    },

    /**
     * Creates a green candy
     *
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createGreenCandy: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'green', stroke: 'black' } )
        ]
      } );
    },

    /**
     * Creates a blue candy
     *
     * @param {number} size in pixels
     * @returns {Node}
     * @public
     */
    createBlueCandy: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'blue', stroke: 'black' } )
        ]
      } );
    }

    // ----------------------------- Bags ----------------------------- //

    // FIXME: add bags

  }; // ItemNodeFactory

  unitRates.register( 'ItemNodeFactory', ItemNodeFactory );

  return ItemNodeFactory;

} ); // define
