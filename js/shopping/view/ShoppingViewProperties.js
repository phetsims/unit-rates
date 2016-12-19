// Copyright 2016, University of Colorado Boulder

/**
 * Properties specific to the 'Shopping' screen view.
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
      questionsExpanded: true
    }, options );

    // @public is the 'Double Number Line' accordion box expanded?
    this.doubleNumberLineExpandedProperty = new Property( options.doubleNumberLineExpanded );

    // @public is the 'Questions' accordion box expanded?
    this.questionsExpandedProperty = new Property( options.questionsExpanded );
  }

  unitRates.register( 'ShoppingViewProperties', ShoppingViewProperties );

  return inherit( Object, ShoppingViewProperties, {

    // @public
    reset: function() {
      this.doubleNumberLineExpandedProperty.reset();
      this.questionsExpandedProperty.reset();
    }
  } );
} );