// Copyright 2017, University of Colorado Boulder

/**
 * Pressing this button resets the shelf to its initial state.
 * As a side-effect, the scale is cleared and markers are removed from the double number line.
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
   * @param {ShoppingScene} shoppingScene
   * @param {Object} [options]
   * @constructor
   */
  function ResetShelfButton( shoppingScene, options ) {

    options = _.extend({

      // RectangularPushButton options
      baseColor: URColors.clearScaleButton,
      xMargin: 12

    },options);

    // icon - designer insisted on using this icon instead of the standard ResetButton, see unit-rates#86
    assert && assert( !options.content, 'this button creates its own content' );
    var scaleRemoveIcon = new FontAwesomeNode( 'level_down' );
    scaleRemoveIcon.setScaleMagnitude( -0.7, 0.7 ); // reflect about the y axis
    options.content = scaleRemoveIcon;

    RectangularPushButton.call( this, options );

    this.addListener( function() {
      //TODO
    } );
  }

  unitRates.register( 'ResetShelfButton', ResetShelfButton );

  return inherit( RectangularPushButton, ResetShelfButton );
} );
