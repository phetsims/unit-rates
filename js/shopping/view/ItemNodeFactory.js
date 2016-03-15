// Copyright 2002-2016, University of Colorado Boulder

/**
 * Factory for creating the various item nodes (fruit, produce, candy, bags).
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );

  // constants


  var ItemNodeFactory = {

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
          new Circle( size, { fill: 'red', stroke: 'black' } )
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
          new Circle( size, { fill: 'yellow', stroke: 'black' } )
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
          new Circle( size, { fill: 'orange', stroke: 'black' } )
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
          new Circle( size, { fill: 'green', stroke: 'black' } )
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
          new Circle( size, { fill: 'brown', stroke: 'black' } )
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
          new Circle( size, { fill: 'red', stroke: 'black' } )
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
          new Circle( size, { fill: 'gold', stroke: 'black' } )
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
