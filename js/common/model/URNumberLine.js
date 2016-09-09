// Copyright 2002-2016, University of Colorado Boulder

/**
 * Holds the items currently on the number line
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URNumberLineItem = require( 'UNIT_RATES/common/model/URNumberLineItem' );

  /**
   * @constructor
   */
  function URNumberLine() {
    var self = this;

    this.markers = [];
  }

  unitRates.register( 'URNumberLine', URNumberLine );

  return inherit( Object, URNumberLine, {

    // @public
    dispose: function() {
    }

  } ); // inherit

} ); // define
