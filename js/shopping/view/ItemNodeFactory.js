// Copyright 2002-2016, University of Colorado Boulder

/**
 * Factory for creating the various item (fruit, produce, candy, bags) nodes.
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

    /**
     * Creates an apple
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
     * Creates an lemon
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
     * Creates an orange
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
     * Creates an pear
     * @returns {Node}
     * @public
     */
    createPear: function( size ) {
      return new Node( {
        children: [
          new Circle( size, { fill: 'lime', stroke: 'black' } )
        ]
      } );
    }

  }; // ItemNodeFactory

  unitRates.register( 'ItemNodeFactory', ItemNodeFactory );

  return ItemNodeFactory;

} ); // define
