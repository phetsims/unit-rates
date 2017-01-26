// Copyright 2016-2017, University of Colorado Boulder

/**
 * The union of view Properties used in the 'Shopping' and 'Shopping Lab' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingViewProperties( options ) {

    options = _.extend( {
      doubleNumberLineExpanded: true,
      questionsExpanded: true,
      scaleCostExpanded: true,
      rateExpanded: true
    }, options );

    // @public is the 'Double Number Line' accordion box expanded?
    this.doubleNumberLineExpandedProperty = new Property( options.doubleNumberLineExpanded );

    // @public is the 'Questions' accordion box expanded?
    this.questionsExpandedProperty = new Property( options.questionsExpanded );

    // @public is the cost display expanded on the scale?
    this.scaleCostExpandedProperty = new Property( options.scaleCostExpanded );

    // @public is the 'Rate' accordion box expanded?
    this.rateExpandedProperty = new Property( options.rateExpanded );
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