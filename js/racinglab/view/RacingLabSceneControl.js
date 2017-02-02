// Copyright 2016-2017, University of Colorado Boulder

/**
 * Scene control for the 'Racing Screen', switches between 1 and 2 cars.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var blueCarImage = require( 'image!UNIT_RATES/blue_car.png' );
  var redCarImage = require( 'image!UNIT_RATES/red_car.png' );

  /**
   * @param {Property.<number>} numberOfCarsProperty
   * @param {Object} [options]
   * @constructor
   */
  function RacingLabSceneControl( numberOfCarsProperty, options ) {

    options = _.extend( {

      // RacingLabSceneControl options
      buttonWidth: 68,

      // RadioButtonGroup options
      orientation: 'vertical',
      baseColor: 'white',
      buttonContentXMargin: 12,
      buttonContentYMargin: 10,
      spacing: 11 // space between the buttons

    }, options );

    var maxCarWidth = options.buttonWidth - ( 2 * options.buttonContentXMargin );

    RadioButtonGroup.call( this, numberOfCarsProperty, [
      { value: 1, node: createOneCarIcon( maxCarWidth ) },
      { value: 2, node: createTwoCarsIcon( maxCarWidth ) }
    ], options );
  }

  unitRates.register( 'RacingLabSceneControl', RacingLabSceneControl );

  /**
   * Creates the icon for the 1-car scene, scaled to fit a specified width.
   *
   * @param {number} maxCarWidth
   * @returns {Node}
   */
  function createOneCarIcon( maxCarWidth ) {
    return createCarImage( redCarImage, maxCarWidth );
  }

  /**
   * Creates the icon for the 2-cars scene, scaled to fit a specified width.
   *
   * @param {number} maxCarWidth
   * @returns {Node}
   */
  function createTwoCarsIcon( maxCarWidth ) {
    return new VBox( {
      spacing: 7, // space between the 2 cars
      children: [
        createCarImage( redCarImage, maxCarWidth ),
        createCarImage( blueCarImage, maxCarWidth )
      ]
    } );
  }

  /**
   * Creates a car icon, scaled to fit a specified width.
   *
   * @param {HTMLImageElement} imageFile
   * @param {number} maxCarWidth
   * @returns {Node}
   */
  function createCarImage( imageFile, maxCarWidth ) {
    var carImage = new Image( imageFile );
    carImage.setScaleMagnitude( maxCarWidth / carImage.width );
    return carImage;
  }

  return inherit( RadioButtonGroup, RacingLabSceneControl );
} );