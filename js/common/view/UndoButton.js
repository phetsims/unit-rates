// Copyright 2016, University of Colorado Boulder

/**
 * The 'undo' button, used to remove a marker from the double number line. 
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
   * @param {Object} [options]
   * @constructor
   */
  function UndoButton( options ) {

    options = _.extend( {
      baseColor: '#f2f2f2'
    }, options );

    assert && assert( !options.content, 'decoration not supported' );
    options.content = new FontAwesomeNode( 'undo', { scale: 0.4 } );

    RectangularPushButton.call( this, options );
  }

  unitRates.register( 'UndoButton', UndoButton );

  return inherit( RectangularPushButton, UndoButton );
} );
