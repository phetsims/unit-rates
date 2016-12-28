// Copyright 2016, University of Colorado Boulder

//TODO move to scenery-phet?
/**
 * Convenience type for creating a rectangular push button with a fontawesome icon.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {string} iconName - the fontawesome icon name
   * @param {Object} [options]
   * @constructor
   */
  function FontAwesomeButton( iconName, options ) {

    options = _.extend( {
      iconScale: 1 // scale for the icon
    }, options );

    assert && assert( !options.content, 'this button creates its own content' );
    options.content = new FontAwesomeNode( iconName, { scale: options.iconScale } );

    RectangularPushButton.call( this, options );
  }

  unitRates.register( 'FontAwesomeButton', FontAwesomeButton );

  return inherit( RectangularPushButton, FontAwesomeButton );
} );