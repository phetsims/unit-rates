// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model of a shopping item.
 * Origin is at the bottom center of the item.
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
 * @param {HTMLImageElement} image - image used by the view to represent this item
 * @param {Object} [options]
 * @constructor
 */
function ShoppingItem( name, image, options ) {

  options = merge( {
    animationSpeed: 400, // distance/second
    visible: true // {boolean} is the item initially visible?
  }, options );

  // @public (read-only)
  this.name = name;
  this.image = image;

  // @public
  this.visibleProperty = new BooleanProperty( options.visible );

  URMovable.call( this, options );
}

unitRates.register( 'ShoppingItem', ShoppingItem );

export default inherit( URMovable, ShoppingItem, {

  // @public
  reset: function() {
    this.visibleProperty.reset();
    URMovable.prototype.reset.call( this );
  }
} );