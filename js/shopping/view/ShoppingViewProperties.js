// Copyright 2016-2019, University of Colorado Boulder

/**
 * The union of view Properties used in the 'Shopping' and 'Shopping Lab' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @constructor
   */
  function ShoppingViewProperties() {

    // @public is the 'Double Number Line' accordion box expanded?
    this.doubleNumberLineExpandedProperty = new BooleanProperty( true );

    // @public is the 'Questions' accordion box expanded?
    this.questionsExpandedProperty = new BooleanProperty( true );

    // @public is the cost display expanded on the scale?
    this.scaleCostExpandedProperty = new BooleanProperty( true );

    // @public is the 'Rate' accordion box expanded?
    this.rateExpandedProperty = new BooleanProperty( true );
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