// Copyright 2017, University of Colorado Boulder

/**
 * Pressing this button clears the scale, returning all items to the shelf.
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
  var URColors = require( 'UNIT_RATES/common/URColors' );

  /**
   * @param {Scale} scale
   * @param {Object} [options]
   * @constructor
   */
  function ClearScaleButton( scale, options ) {

    options = _.extend({

      // RectangularPushButton options
      baseColor: URColors.clearScaleButton,
      xMargin: 12

    },options);

    // icon
    assert && assert( !options.content, 'this button creates its own content' );
    var scaleRemoveIcon = new FontAwesomeNode( 'level_down' );
    scaleRemoveIcon.setScaleMagnitude( -0.7, 0.7 ); // reflect about the y axis
    options.content = scaleRemoveIcon;

    RectangularPushButton.call( this, options );

    this.addListener( function() {
      scale.clear();
    } );
  }

  unitRates.register( 'ClearScaleButton', ClearScaleButton );

  return inherit( RectangularPushButton, ClearScaleButton );
} );
