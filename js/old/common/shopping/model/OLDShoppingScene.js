// Copyright 2016, University of Colorado Boulder

/**
 * A scene in one of the Shopping screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {string} name - internal name, no i18n required
   * @param {HTMLImageElement} image - image used to represent the scene
   * @param {OLDItemData[]} itemDataArray - items in the scene
   * @param {Object} [options]
   * @constructor
   */
  function OLDShoppingScene( name, image, itemDataArray, options ) {

    // validate args
    assert && assert( itemDataArray && itemDataArray.length > 0, 'at least 1 ItemData is required' );

    options = _.extend( {

      // index of the item that is initially selected, randomly chosen
      itemIndex: phet.joist.random.nextIntBetween( 0, itemDataArray.length - 1 )
    }, options );

    // validate options
    assert && assert( options.itemIndex >= 0 && options.itemIndex < itemDataArray.length, 'invalid itemIndex: ' + options.itemIndex );

    // @public (read-only)
    this.name = name; //TODO should be able to eliminate this
    this.image = image;
    this.itemDataArray = itemDataArray;
    this.itemDataProperty = new Property( itemDataArray[ options.itemIndex ] );
  }

  unitRates.register( 'OLDShoppingScene', OLDShoppingScene );

  return inherit( Object, OLDShoppingScene, {

    // @public
    reset: function() {

      // Randomly choose an item on reset.
      var itemIndex = phet.joist.random.nextIntBetween( 0, this.itemDataArray.length - 1 );
      this.itemDataProperty.value = this.itemDataArray[ itemIndex ];
    }
  } );
} );