// Copyright 2002-2016, University of Colorado Boulder

/**
 ***
 * NOTE: THIS IS CURRENTLY UNUSED - however, the design has not been finialized,
 ****
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var CONTAINER_LINE_WIDTH = 0.5;
  var CONTAINER_LINE_COLOR = 'rgba( 0, 0, 0, .75 )';
  var CONTAINER_LINE_DASH = [ 5, 5 ];
  var CONTAINER_FILL = 'rgba( 255, 255, 255, .75 )';
  var RED_CANDY_COLOR = 'red';
  var YELLOW_CANDY_COLOR = 'yellow';
  var GREEN_CANDY_COLOR = 'green';
  var BLUE_CANDY_COLOR = 'blue';
  var PERSPECTIVE_RADIUS = 0.10;


  /**
   * @param {number} radius
   * @param {number} height
   * @param {Object} [options]
   * @constructor
   */
  function CandyContainerNode( radius, height, options ) {

    options = _.extend( {
      pickable: true
    },  options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    // @private - all
    this.containerRadius    = radius;
    this.containerHeight    = height;
    this.containerRect      = new Bounds2( -this.containerRadius, 0, this.containerRadius, this.containerHeight );
    this.perspectiveRadius  = PERSPECTIVE_RADIUS * this.containerRadius;
    this.candyItemHeight    = this.containerHeight * 0.05;

    var containerOptions    = { pickable: true, lineWidth: CONTAINER_LINE_WIDTH, stroke: CONTAINER_LINE_COLOR, fill: CONTAINER_FILL };

    var containerTopNode    = new Path( this.getTopShape( this.containerRect.minY ), containerOptions );
    var containerBodyNode   = new Path( this.getBodyShape(  this.containerRect.minY ), containerOptions );
    var containerBottomNode = new Path( this.getBottomShape(), { lineWidth: CONTAINER_LINE_WIDTH, stroke: CONTAINER_LINE_COLOR,
      lineDash: CONTAINER_LINE_DASH } );

    var candyOptions = { pickable: true, visible: false, lineWidth: CONTAINER_LINE_WIDTH, stroke: CONTAINER_LINE_COLOR,
      fill: 'black' };
    this.candyTopNode   = new Path( null, candyOptions );
    this.candyBodyNode  = new Path( null, candyOptions );

    options.children = [ containerBodyNode, containerTopNode, containerBottomNode, this.candyTopNode, this.candyBodyNode ];

    Node.call( this, options );
  }

  unitRates.register( 'CandyContainerNode', CandyContainerNode );

  return inherit( Node, CandyContainerNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Generate the top ellipse of the candy container at a specific Y location.
     * @param {number} y
     * @private
     */
    getTopShape: function( y ) {
      return Shape.ellipse( this.containerRect.centerX, y,
      this.containerRadius, this.perspectiveRadius, 0, 0, Math.PI  / 2, false );
    },

    /**
     * Generate the main body of the candy container for a specific height.
     * @param {number} height
     * @private
     */
    getBodyShape: function( height ) {
      return new Shape()
      .moveTo( this.containerRect.minX, this.containerRect.minY )
      .ellipticalArc( this.containerRect.centerX, height, this.containerRect.width / 2, this.perspectiveRadius, 0, Math.PI, 0, true )
      .lineTo( this.containerRect.maxX, height)
      .ellipticalArc( this.containerRect.centerX, this.containerRect.maxY, this.containerRect.width / 2, this.perspectiveRadius, 0, 0, Math.PI, false )
      .close();
    },

    /**
     * Generate the bottom portion of the candy container
     * @private
     */
    getBottomShape: function() {
      return new Shape()
      .moveTo( this.containerRect.minX, this.containerRect.maxY )
      .ellipticalArc( this.containerRect.centerX, this.containerRect.maxY, this.containerRect.width / 2, this.perspectiveRadius, 0, Math.PI, 0, false );
    },

    /**
     * Fill the container with candy
     * @param {Array}.<Item> itemArray
     * @public
     */
    populate: function( itemArray ) {
      var self = this;

      // set visibility
      if( itemArray.length === 0 ) {
        this.candyTopNode.visible   = false;
        this.candyBodyNode.visible  = false;
        return;
      }

      this.candyTopNode.visible   = true;
      this.candyBodyNode.visible  = true;

      // set color
      var itemColor = 'black';
      var item = itemArray.get(0);
      switch( item.type ) {
          case ItemData.RED_CANDY.type:
            itemColor = RED_CANDY_COLOR;
            break;
          case ItemData.YELLOW_CANDY.type:
            itemColor = YELLOW_CANDY_COLOR;
            break;
          case ItemData.GREEN_CANDY.type:
            itemColor = GREEN_CANDY_COLOR;
            break;
          case ItemData.BLUE_CANDY.type:
            itemColor = BLUE_CANDY_COLOR;
            break;
          default:
            assert && assert( true, 'Candy container is populating non-candy types' );
      }
      this.candyTopNode.fill  = itemColor;
      this.candyBodyNode.fill = itemColor;

      // calc the height of the candy items
      var candyHeight = this.containerRect.maxY;
      itemArray.forEach( function( item ) {
        candyHeight -= ( item.count * self.candyItemHeight );
        itemColor = item.containerColor;
      } );

      // update shape
      this.candyTopNode.setShape( this.getTopShape( candyHeight ) );
      this.candyBodyNode.setShape( this.getBodyShape( candyHeight ) );
    },

    /**
     * Reset the container node to its initial state
     * @public
     */
    reset: function() {
      // FIXME:
    }

  } ); // inherit

} ); // define

