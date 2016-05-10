// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var CurvedArrowShape = require( 'SCENERY_PHET/CurvedArrowShape' );
  var Path = require( 'SCENERY/nodes/Path' );
  //var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );       // FIXME - add to scenery-phet?
  var Matrix3 = require( 'DOT/Matrix3' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function CurvedArrowButton( options ) {

    options = _.extend( {

      headWidth: 15,
      headHeight: 15,
      tailWidth: 5,
      baseColor: new Color( 255, 255, 255 )
    }, options );

    var arrowShape = new CurvedArrowShape( 8, -Math.PI, 0, options ).transformed( Matrix3.scaling( -1, 1 ) );

    RectangularPushButton.call( this, _.extend( {
      content: new Path( arrowShape, { fill: 'black' } )
    }, options ) );
  }

  // FIXME - add to scenery-phet?
  unitRates.register( 'CurvedArrowButton', CurvedArrowButton );

  return inherit( RectangularPushButton, CurvedArrowButton );
} );
