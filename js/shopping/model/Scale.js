// Copyright 2017, University of Colorado Boulder

/**
 * Model of the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // sim modules
  var RowLayout = require( 'UNIT_RATES/shopping/model/RowLayout' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Scale( options ) {

    options = _.extend( {
      location: new Vector2( 0, 0 ), // {Vector2} location of the center of the scale's top surface
      width: 300, // {number} width of the top surface of the scale
      quantityUnits: '', // {string} units for quantity
      numberOfBags: 4,
      bagWidth: 70
    }, options );

    // @public ( read-only)
    this.location = options.location;
    this.width = options.width;
    this.quantityUnits = options.quantityUnits;

    // @public
    this.costProperty = new Property( 0 );
    this.quantityProperty = new Property( 0 );

    // @private manages the layout of objects on the scale
    this.rowLayout = new RowLayout( {
      centerX: this.location.x,
      numberOfObjects: options.numberOfBags,
      objectWidth: options.bagWidth
    } );
  }

  unitRates.register( 'Scale', Scale );

  return inherit( Object, Scale, {

    // @public
    reset: function() {
      this.costProperty.reset();
      this.quantityProperty.reset();
      this.rowLayout.reset();
    }
  } );
} );
