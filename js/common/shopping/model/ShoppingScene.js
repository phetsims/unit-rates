// Copyright 2016, University of Colorado Boulder

/**
 * A scene in one of the Shopping screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {string} name - internal name, no i18n required
   * @param {HTMLImageElement} image - image used to represent the scene
   * @param {ItemData[]} itemDataArray - items in the scene
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingScene( name, image, itemDataArray, options ) {

    // validate args
    assert && assert( itemDataArray && itemDataArray.length > 0, 'at least 1 ItemData is required' );

    options = _.extend( {
      itemIndex: 0 // index of the item that is initially selected
    }, options );

    // validate options
    assert && assert( options.itemIndex >= 0 && options.itemIndex < itemDataArray.length, 'invalid itemIndex: ' + options.itemIndex );

    // @public (read-only)
    this.name = name; //TODO should be able to eliminate this
    this.image = image;
    this.itemDataArray = itemDataArray;
    this.itemDataProperty = new Property( itemDataArray[ options.itemIndex ] );
  }

  unitRates.register( 'ShoppingScene', ShoppingScene );

  return inherit( Object, ShoppingScene, {

    // @public
    reset: function() {
      this.itemDataProperty.reset();
    }
  } );
} );