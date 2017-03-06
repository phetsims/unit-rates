// Copyright 2016-2017, University of Colorado Boulder

/**
 * The union of view Properties used in the 'Shopping' and 'Shopping Lab' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @constructor
   */
  function ShoppingViewProperties() {

    // @public is the 'Double Number Line' accordion box expanded?
    this.doubleNumberLineExpandedProperty = new Property( true );

    // @public is the 'Questions' accordion box expanded?
    this.questionsExpandedProperty = new Property( true );

    // @public is the cost display expanded on the scale?
    this.scaleCostExpandedProperty = new Property( true );

    // @public is the 'Rate' accordion box expanded?
    this.rateExpandedProperty = new Property( true );
  }

  unitRates.register( 'ShoppingViewProperties', ShoppingViewProperties );

  return inherit( Object, ShoppingViewProperties, {

    // @public
    reset: function() {
      this.doubleNumberLineExpandedProperty.reset();
      this.questionsExpandedProperty.reset();
      this.scaleCostExpandedProperty.reset();
      this.rateExpandedProperty.reset();
    }
  } );
} );