// Copyright 2017, University of Colorado Boulder

//TODO redo this without AccordionBox?
/**
 * Timer in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  var hourString = require( 'string!UNIT_RATES/hour' );
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  /**
   * @param {Property.<number>} timeProperty
   * @param {Object} [options]
   * @constructor
   */
  function RaceTimerNode( timeProperty, options ) {

    options = _.extend( {

      decimals: 2,
      titleString: '',
      font: new URFont( 14 ),

      // AccordionBox options
      fill: 'white',
      showTitleWhenExpanded: false,
      cornerRadius: 4,
      contentAlign: 'right',
      titleAlignX: 'left',
      titleXMargin: 8,
      titleYMargin: 5,
      contentXMargin: 8,
      contentYMargin: 5
    }, options );

    assert && assert( !options.titleNode, 'creates its own title node' );
    options.titleNode = new Text( options.titleString, { font: options.font } );

    var largestTimeString = StringUtils.format( valueUnitsString, '0000.00', hoursString );
    var timeDisplayNode = new Text( largestTimeString, { font: options.font } );

    AccordionBox.call( this, timeDisplayNode, options );

    // update time display
    var timeObserver = function( time ) {
      var fixedTime = Util.toFixedNumber( time, options.decimals );
      var units = ( fixedTime === 1 ) ? hourString : hoursString;
      timeDisplayNode.text = StringUtils.format( valueUnitsString, Util.toFixed( time, options.decimals ), units );
    };
    timeProperty.link( timeObserver ); // unlink in dispose

    // @private
    this.disposeRaceTimerNode = function() {
      timeProperty.unlink( timeObserver );
    };
  }

  unitRates.register( 'RaceTimerNode', RaceTimerNode );

  return inherit( AccordionBox, RaceTimerNode, {

    // @public
    dispose: function() {
      AccordionBox.prototype.dispose && AccordionBox.prototype.dispose.call( this );
      this.disposeRaceTimerNode();
    }
  } );
} );