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
  var ItemNode = require( 'UNIT_RATES/shopping/view/ItemNode' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  // constants


  var ItemNodeFactory = {

     /**
     * Creates an node of size for specified item
     *
     * @param {Item} item
     * @param {number} size
     * @param {Vector2} position
     * @param (function(ItemNode)} movedCallback - function called when item drag ends
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createItem: function( item, size, position, movedCallback, options ) {

      var imageNode = null;

      switch( item.type ) {
        case ItemData.APPLES.type:
          imageNode = this.createApple( size, options );
          break;
        case ItemData.LEMONS.type:
          imageNode = this.createLemon( size, options );
          break;
        case ItemData.ORANGES.type:
          imageNode = this.createOrange( size, options );
          break;
        case ItemData.PEARS.type:
          imageNode = this.createPear( size, options );
          break;
        case ItemData.CARROTS.type:
          imageNode = this.createCarrot( size, options );
          break;
        case ItemData.CUCUMBERS.type:
          imageNode = this.createCucumber( size, options );
          break;
        case ItemData.POTATOES.type:
          imageNode = this.createPotatoe( size, options );
          break;
        case ItemData.TOMATOES.type:
          imageNode = this.createTomato( size, options );
          break;
        case ItemData.RED_CANDY.type:
          imageNode = this.createRedCandy( size, options );
          break;
        case ItemData.YELLOW_CANDY.type:
          imageNode = this.createYellowCandy( size, options );
          break;
        case ItemType.GREEN_CANDY.type:
          imageNode = this.createGreenCandy( size, options );
          break;
        case ItemData.BLUE_CANDY.type:
          imageNode = this.createBlueCandy( size, options );
          break;
        default:
      }

      assert && assert( imageNode !== null, 'Unable to create item node of type:' + item.type );

      return new ItemNode( item, position, movedCallback, {
        children: [ imageNode ]
      }, options );

    },

    // ----------------------------- Fruit ----------------------------- //

    /**
     * Creates a apple
     *
     * @param {number} size in pixels
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createApple: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'crimson', stroke: 'black' } )
        ]
      }, options );
    },

    /**
     * Creates a lemon
     *
     * @param {number} size in pixels
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createLemon: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'gold', stroke: 'black' } )
        ]
      }, options );
    },

    /**
     * Creates a orange
     *
     * @param {number} size in pixels
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createOrange: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'darkorange', stroke: 'black' } )
        ]
      }, options );
    },

    /**
     * Creates a pear
     *
     * @param {number} size in pixels
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createPear: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'lime', stroke: 'black' } )
        ]
      }, options );
    },

    // ----------------------------- Produce ----------------------------- //

    /**
     * Creates a carrot
     *
     * @param {number} size in pixels
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createCarrot: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'orange', stroke: 'black' } )
        ]
      }, options );
    },

    /**
     * Creates a cucumber
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createCucumber: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'darkgreen', stroke: 'black' } )
        ]
      }, options );
    },

    /**
     * Creates a potatoe
     *
     * @param {number} size in pixels
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createPotatoe: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'sienna', stroke: 'black' } )
        ]
      }, options );
    },

    /**
     * Creates a tomato
     *
     * @param {number} size in pixels
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createTomato: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'firebrick', stroke: 'black' } )
        ]
      }, options );
    },

    // ----------------------------- Candy ----------------------------- //

    /**
     * Creates a red candy
     *
     * @param {number} size in pixels
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createRedCandy: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'red', stroke: 'black' } )
        ]
      }, options );
    },

    /**
     * Creates a yellow candy
     *
     * @param {number} size in pixels
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createYellowCandy: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'yellow', stroke: 'black' } )
        ]
      }, options );
    },

    /**
     * Creates a green candy
     *
     * @param {number} size in pixels
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createGreenCandy: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'green', stroke: 'black' } )
        ]
      }, options );
    },

    /**
     * Creates a blue candy
     *
     * @param {number} size in pixels
     * @param {Object} [options]
     * @returns {Node}
     * @public
     */
    createBlueCandy: function( size, options ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'blue', stroke: 'black' } )
        ]
      }, options );
    }

    // ----------------------------- Bags ----------------------------- //

    // FIXME: add bags

  }; // ItemNodeFactory

  unitRates.register( 'ItemNodeFactory', ItemNodeFactory );

  return ItemNodeFactory;

} ); // define
