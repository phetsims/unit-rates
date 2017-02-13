// Copyright 2017, University of Colorado Boulder

/**
 * Timer in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var Util = require( 'DOT/Util' );

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  /**
   * @param {Property.<number>} timeProperty
   * @param {Property.<boolean>} expandedProperty
   * @param {Object} [options]
   * @constructor
   */
  function RaceTimerNode( timeProperty, expandedProperty, options ) {

    options = _.extend( {
      decimals: 2,
      titleString: '',
      font: new URFont( 14 ),
      fill: 'white',
      cornerRadius: 4,
      xMargin: 8,
      yMargin: 4,
      xSpacing: 4
    }, options );

    // title, displayed when the timer is collapsed
    var titleNode = new Text( options.titleString, {
      font: options.font,
      maxWidth: 95 // i18n, determined empirically
    } );

    // anything longer than this will be scaled down via maxWidth
    var largestTimeString = StringUtils.format( valueUnitsString, '0000.00', hoursString );
    
    // time, displayed when the timer is expanded
    var timeNode = new Text( largestTimeString, {
      font: options.font,
      maxWidth: 95 // i18n, determined empirically
    } );

    // dispose required
    var expandCollapseButton = new ExpandCollapseButton( expandedProperty, {
      sideLength: 15,
      touchAreaXDilation: 30,
      touchAreaYDilation: 30
    } );

    // background rectangle
    var maxWidth = _.maxBy( [ titleNode, timeNode ], function( node ) {
      return node.width;
    } ).width;
    var maxHeight = _.maxBy( [ titleNode, timeNode, expandCollapseButton ], function( node ) {
      return node.height;
    } ).height;
    var backgroundWith = maxWidth + expandCollapseButton.width + options.xSpacing + ( 2 * options.xMargin );
    var backgroundHeight = maxHeight + ( 2 * options.yMargin );
    var backgroundNode = new Rectangle( 0, 0, backgroundWith, backgroundHeight, {
      cornerRadius: options.cornerRadius,
      fill: options.fill,
      stroke: 'black'
    } );

    // layout
    expandCollapseButton.left = backgroundNode.left + options.xMargin;
    expandCollapseButton.centerY = backgroundNode.centerY;
    titleNode.left = expandCollapseButton.right + options.xSpacing;
    titleNode.centerY = backgroundNode.centerY;
    // timeNode layout is handled by timeObserver

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ backgroundNode, expandCollapseButton, titleNode, timeNode ];

    Node.call( this, options );

    // expand/collapse
    var expandedObserver = function( expanded ) {
      timeNode.visible = expanded;
      titleNode.visible = !expanded;
    };
    expandedProperty.link( expandedObserver ); // unlink in dispose

    // update time display
    var timeObserver = function( time ) {
      timeNode.text = StringUtils.format( valueUnitsString, Util.toFixed( time, options.decimals ), hoursString );
      timeNode.right = backgroundNode.right - options.xMargin;
      timeNode.centerY = backgroundNode.centerY;
    };
    timeProperty.link( timeObserver ); // unlink in dispose

    // @private
    this.disposeRaceTimerNode = function() {
      expandCollapseButton.dispose();
      expandedProperty.unlink( expandedObserver );
      timeProperty.unlink( timeObserver );
    };
  }

  unitRates.register( 'RaceTimerNode', RaceTimerNode );

  return inherit( Node, RaceTimerNode, {

    // @public
    dispose: function() {
      this.disposeRaceTimerNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
