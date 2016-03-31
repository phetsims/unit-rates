// Copyright 2002-2016, University of Colorado Boulder

/**
 * All the items currently on the number line
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var DoubleNumberLine = require( 'UNIT_RATES/common/model/DoubleNumberLine' );

  /**
   *
   * @constructor
   */
  function NumberLine( itemDataProperty ) {

    // @public (all)
    DoubleNumberLine.call( this, itemDataProperty, {
    } );

    var self = this;

    // update value text
    itemDataProperty.link( function( value, oldValue ) {
    } );

    // refresh on item additions/removals
    this.addListeners( function( item, observableArray ) {
      console.log( 'DoubleNumberLine: ' + observableArray.length );
    },
    function( item, observableArray ) {
      console.log( 'DoubleNumberLine: ' + observableArray.length );
    } );

  }

  unitRates.register( 'NumberLine', NumberLine );

  return inherit( DoubleNumberLine, NumberLine, {

    /**
     * @public
     */
    reset: function() {
      DoubleNumberLine.prototype.reset.call( this );
    }

  } );

} );
