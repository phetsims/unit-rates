// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model of the shelf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const ShoppingContainer = require( 'UNIT_RATES/shopping/model/ShoppingContainer' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Shelf( options ) {

    options = merge( {

      position: new Vector2( 0, 0 ), // {Vector2} position of the center of the shelf's top face

      // ShoppingContainer options
      numberOfBags: 4, // {number} maximum number of bags on the shelf
      bagSize: new Dimension2( 100, 100 ), // {number} dimensions of each bag
      bagRowYOffset: 0, // {number} offset of bag row from shelf origin
      numberOfItems: 15, // {number} maximum number of items on the shelf
      itemSize: new Dimension2( 25, 25 ), // {number} dimensions of each item
      backRowYOffset: 8, // {number} offset of items back row from shelf origin
      frontRowYOffset: 16 // {number} offset of items front row from shelf origin

    }, options );

    ShoppingContainer.call( this, options );

    // @public (read-only) description of pseudo-3D shape
    this.width = 350; // {number} width of the top face, at its center
    this.height = 15; // {number} height of the front face
    this.depth = 45; // {number} depth, after flattening to 2D
    this.perspectiveXOffset = 30; // {number} offset for parallel perspective, after flattening to 2D
  }

  unitRates.register( 'Shelf', Shelf );

  return inherit( ShoppingContainer, Shelf );
} );