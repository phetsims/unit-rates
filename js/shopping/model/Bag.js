// Copyright 2017-2020, University of Colorado Boulder

/**
 * Model of a bag that contains shopping items.
 * Origin is at the bottom center of the bag.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import URMovable from '../../common/model/URMovable.js';
import unitRates from '../../unitRates.js';

/**
 * @param {string} name - for internal use
 * @param {HTMLImageElement} image - image used by the view to represent this bag
 * @param {Object} [options]
 * @constructor
 */
function Bag( name, image, options ) {

  options = merge( {

    visible: true, // {boolean} is the bag initially visible?

    // {ShoppingItem[]|null} items in the bag, null means the bag does not open when placed on the scale
    items: null,

    // URMovable options
    animationSpeed: 400 // distance/second

  }, options );

  // @public (read-only)
  this.name = name;
  this.image = image;
  this.items = options.items;

  // @public
  this.visibleProperty = new BooleanProperty( options.visible );

  URMovable.call( this, options );
}

unitRates.register( 'Bag', Bag );

export default inherit( URMovable, Bag, {

  // @public
  reset: function() {
    this.visibleProperty.reset();
    URMovable.prototype.reset.call( this );
  }
} );