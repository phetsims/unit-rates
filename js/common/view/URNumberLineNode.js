// Copyright 2016, University of Colorado Boulder

/**
 * Base class for all number line nodes in the simulation. Base functionality includes, drawing and labeling the
 * double axes managing a current list of number line markers.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URNumberLineMarkerNode = require( 'UNIT_RATES/common/view/URNumberLineMarkerNode' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var undoButtonImage = require( 'image!UNIT_RATES/undo-button.png' );

  // constants
  var EDITABLE_MARKER_X = 25; // the default X position of an editable marker
  var UNDO_BUTTON_X = 5;  // the default X position of the undo/remove button
  var ACCORDION_X_MARGIN = 5;

  /**
   * @param {URNumberLine} numberLine - model
   * @param {KeypadPanelNode} keypad - shared keypad
   * @param {Object} [options]
   * @constructor
   */
  function URNumberLineNode( numberLine, keypad, options ) {

    options = _.extend( {
      numberLineTitle: '',
      graphWidth: 700,
      graphHeight: 130,
      xAxisOffset: 10,
      yAxisOffset: 0,
      xAxisLength: 625,
      yAxisLength: 25,
      axisArrowSize: 5,
      axisLabelSpacing: 10,
      axisLabelFont: new PhetFont( 14 ),
      axisLabelMaxWidth: 75,
      markerLargeHeight: 35,
      markerSmallHeight: 18,
      markerTopPattern: '{0}',
      markerBottomPattern: '{0}',
      onEraseCallback: null
    }, options );

    var self = this;

    // @protected - all
    this.numberLine = numberLine;
    this.keypad = keypad;
    this.graphWidth = options.graphWidth;         // width of the area taken by the numberLine
    this.graphHeight = options.graphHeight;        // height of the area taken by the numberLine
    this.xAxisOffset = options.xAxisOffset;        // width between the double X-axes
    this.yAxisOffset = options.yAxisOffset;        // offset for the start of y=0
    this.xAxisLength = options.xAxisLength;        // length (pixels) of the X axis
    this.yAxisLength = options.yAxisLength;        // length (pixels) of the Y axis
    this.axisArrowSize = options.axisArrowSize;
    this.axisLabelSpacing = options.axisLabelSpacing;
    this.axisArrowSize = options.axisArrowSize;
    this.markerLargeHeight = options.markerLargeHeight;
    this.markerSmallHeight = options.markerSmallHeight;
    this.markerTopPattern = options.markerTopPattern;
    this.markerBottomPattern = options.markerBottomPattern;
    this.onEraseCallback = options.onEraseCallback;

    // @public (read-only) graph origin & bounds
    this.origin = new Vector2( this.yAxisOffset, this.graphHeight / 2 );
    this.graphBounds = new Bounds2( 0, 0, this.graphWidth, this.graphHeight );
    this.markerBounds = new Bounds2( 0, 0, this.graphWidth + this.xAxisLength + this.axisArrowSize + this.axisLabelSpacing,
      this.graphHeight );

    // Array.<NumberLineMarkerNode> - The undo/remove stack of markers which keeps track of the order of
    // marker removals for the undo button.
    // @private
    this.removableMarkerNodeList = [];

    // @protected - controls the accordion box expansion
    this.expandedProperty = new Property( true );

    // @protected - the accordion box content
    this.contentNode = new Node();

    // @protected - layer holding all the number line markers
    this.markerLayerNode = new Path( new Shape().rect( 0, 0, this.graphWidth, this.graphHeight ), {
      //stroke: 'red',  // debugging
      lineWidth: 1
    } );
    this.contentNode.addChild( this.markerLayerNode );

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    // axis lines
    this.xZeroLine = new Path( new Shape()
      .moveTo( this.yAxisOffset, this.origin.y + this.yAxisLength )
      .lineTo( this.yAxisOffset, this.origin.y - this.yAxisLength ), {
      stroke: 'black',
      lineWidth: 1.25
    } );
    this.contentNode.addChild( this.xZeroLine );

    // arrow options
    var arrowOptions = {
      headHeight: options.axisArrowSize,
      headWidth: options.axisArrowSize,
      tailWidth: .1,
      fill: 'black'
    };

    // @protected
    this.topArrowNode = new ArrowNode( 0, 0, 0, 0, arrowOptions );
    this.contentNode.addChild( this.topArrowNode );

    // @protected
    this.bottomArrowNode = new ArrowNode( 0, 0, 0, 0, arrowOptions );
    this.contentNode.addChild( this.bottomArrowNode );

    // arrow labels
    var labelOptions = { font: options.axisLabelFont, maxWidth: options.axisLabelMaxWidth };

    // @protected
    this.topArrowLabel = new Text( 'top', labelOptions );
    this.contentNode.addChild( this.topArrowLabel );

    // @protected
    this.bottomArrowLabel = new Text( 'bottom', labelOptions );
    this.contentNode.addChild( this.bottomArrowLabel );

    // undo button - it's position will change based on the marker being edited. Incorrectly/unanswered editable markers
    // will position the button on the far left side of the number line, while correct/fractional 'count' markers will
    // reposition the undo button directly under the marker.
    this.undoEditButtonNode = new RectangularPushButton( {
      visible: false,
      baseColor: '#f2f2f2',
      headWidth: 8,
      headHeight: 8,
      tailWidth: 5,
      left: UNDO_BUTTON_X,
      centerY: this.graphHeight / 2,
      content: new Image( undoButtonImage, { scale: 0.25 } ),
      listener: function() {
        self.removeEditMarker();
      }
    } );
    this.contentNode.addChild( this.undoEditButtonNode );

    // set the default Y-axis length
    this.setPixelLength( this.xAxisLength );

    // erase
    var eraserButton = new EraserButton( {
      baseColor: '#A9D8FD',
      left: this.bottomArrowLabel.right,
      top: options.graphHeight,
      listener: function() {
        self.numberLine.removeAllMarkers();
        self.removeAllMarkerNodes();
        if ( self.onEraseCallback ) {
          self.onEraseCallback.call();
        }
      }
    } );
    this.contentNode.addChild( eraserButton );


    this.markerLayerNode.moveToFront();
    this.undoEditButtonNode.moveToFront();

    AccordionBox.call( this, this.contentNode, {
      expandedProperty: this.expandedProperty,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 15,
      titleNode: new Text( options.numberLineTitle, { font: URConstants.PANEL_TITLE_FONT } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      contentAlign: 'left',
      contentXMargin: ACCORDION_X_MARGIN,
      contentYMargin: 5,
      contentYSpacing: 5
    } );

    this.mutate( options );

    this.addEditMarkerNode();
  }

  unitRates.register( 'URNumberLineNode', URNumberLineNode );

  return inherit( AccordionBox, URNumberLineNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Sets length of the number line in pixels. The idea here was that you could have the full number line area defined
     * by the bounds (this.graphBounds), but you could have shorter X-axis lengths contained within those bounds
     *
     * @param {number} length
     * @public
     */
    setPixelLength: function( length ) {

      var self = this;

      this.xAxisLength = this.yAxisOffset + this.axisArrowSize + length;

      this.topArrowNode.setTailAndTip( this.yAxisOffset, this.origin.y - this.xAxisOffset,
        this.xAxisLength, this.origin.y - this.xAxisOffset );
      this.bottomArrowNode.setTailAndTip( this.yAxisOffset, this.origin.y + this.xAxisOffset,
        this.xAxisLength, this.origin.y + this.xAxisOffset );

      this.topArrowLabel.left = this.topArrowNode.right + this.axisLabelSpacing;
      this.topArrowLabel.centerY = this.topArrowNode.centerY;

      this.bottomArrowLabel.left = this.bottomArrowNode.right + this.axisLabelSpacing;
      this.bottomArrowLabel.centerY = this.bottomArrowNode.centerY;

      // in between arrows and labels
      this.outOfRangeMarkerX = ( this.topArrowLabel.left - this.axisLabelSpacing / 2 );

      // update all markers - hide those beyond bounds, move out of range, etc.
      this.markerLayerNode.getChildren().forEach( function( node ) {

        if ( node.marker.outOfRangeProperty.value ) {
          var position = node.marker.positionProperty.value;
          node.marker.setPosition( self.outOfRangeMarkerX, position.y, false );
        }
        else {
          node.visible = ( node.marker.positionProperty.value.x <= self.xAxisLength - self.axisArrowSize );
        }
      } );

      // undo button
      this.updateUndoButton();
    },

    /**
     * Sets the top & bottom axis labels (on the far right of the number line)
     *
     * @param {string} topLabel
     * @param {string} bottomLabel
     * @public
     */
    setLineLabels: function( topLabel, bottomLabel ) {
      this.topArrowLabel.setText( topLabel );
      this.bottomArrowLabel.setText( bottomLabel );
    },

    /**
     * TODO document this
     *
     * @public
     */
    populate: function() {
      var self = this;
      this.numberLine.forEachMarker( function( marker ) {
        self.createMarkerNode( marker );
      } );
    },

    /**
     * Adds a marker to the number line
     *
     * @param {URNumberLineMarkerNode} markerNode
     * @public
     */
    addMarkerNode: function( markerNode ) {
      this.markerLayerNode.addChild( markerNode );
    },

    /**
     * Adds a marker to the number line
     *
     * @param {URNumberLineMarkerNode} markerNode
     * @public
     */
    removeMarkerNode: function( markerNode ) {
      this.numberLine.removeMarker( markerNode.marker );
      markerNode.dispose();
      this.markerLayerNode.removeChild( markerNode );
    },

    /**
     * Removes all marker nodes from the number line
     *
     * @public
     */
    removeAllMarkerNodes: function() {

      this.forEachMarkerNode( function( node ) {
        node.dispose();
      } );
      this.markerLayerNode.removeAllChildren();

      this.removableMarkerNodeList = [];

      this.updateUndoButton();
      this.addEditMarkerNode();
    },

    /**
     * Gets all the markers that are currently on the number line
     *
     * @returns {Array}.<URNumberLineMarkerNode>
     * @public
     */
    getAllMarkerNodes: function() {
      return this.markerLayerNode.getChildren();
    },

    /**
     * Applies a callback function to each marker in the number line
     * Note: Adding or deleting markers here is not allowed!
     *
     * @param callback function(item)
     * @public
     */
    forEachMarkerNode: function( callback ) {
      this.markerLayerNode.getChildren().forEach( callback );
    },

    /**
     * Adds a new editable marker to the number line (if one doesn't already exist). Editable markers have buttons
     * which allow the edit boxes to be linked to the shared keypad.
     *
     * @protected
     */
    addEditMarkerNode: function() {

      // create one if there is none
      if ( !this.numberLine.editMarkerExists() ) {

        // create a new editable item
        var editMarker = this.numberLine.createMarker( -1, -1, {
          editable: true,
          bounds: this.markerBounds,
          position: new Vector2( EDITABLE_MARKER_X, this.origin.y )
        } );

        // create a matching marker node
        this.createMarkerNode( editMarker );

        // reset the keypad
        this.keypad.hide();
        this.keypad.clear();
      }

      this.updateUndoButton();
    },

    /**
     * Removes the top marker in the undo stack from the number line.
     *
     * @private
     */
    removeEditMarker: function() {

      if ( this.removableMarkerNodeList.length > 0 ) {

        // get the last edit node added
        var editMarkerNode = this.removableMarkerNodeList.pop();

        // remove the marker
        this.numberLine.removeMarker( editMarkerNode.marker );

        // remove the node
        this.markerLayerNode.removeChild( editMarkerNode );
        editMarkerNode.dispose();

        this.addEditMarkerNode();  // if needed
      }
    },

    /**
     * Creates a new marker node based on the specified marker attributes
     *
     * @param {URNumberLineMarker} marker - the marker item
     * @return {URNumberLineMarkerNode}
     * @private
     */
    createMarkerNode: function( marker ) {

      var markerNode = null;

      // check for existing node
      var nodes = this.markerLayerNode.getChildren();
      for ( var i = 0; i < nodes.length; i++ ) {
        markerNode = nodes[ i ];
        if ( markerNode.marker === marker ) {
          return markerNode;
        }
      }

      // make marker node at a specific location
      var position = marker.positionProperty.value;
      markerNode = new URNumberLineMarkerNode( marker, position, this.keypad, this.updateMarkerNode.bind( this ), {
        draggable: false,
        centerX: position.x,
        centerY: position.y,
        color: marker.color,
        largeHeight: this.markerLargeHeight,
        smallHeight: this.markerSmallHeight,
        topPattern: this.markerTopPattern,
        bottomPattern: this.markerBottomPattern
      } );
      this.addMarkerNode( markerNode );

      return markerNode;
    },

    /**
     * This does a few things; manages the undo stack, positions it on the number line & removes duplicates
     *
     * @param {URNumberLineMarkerNode} markerNode
     * @private
     */
    updateMarkerNode: function( markerNode ) {

      var x = markerNode.marker.positionProperty.value.x;
      var y = this.origin.y;
      var nodeIndex = this.removableMarkerNodeList.indexOf( markerNode );
      var isRemovable = markerNode.marker.isRemovable();
      var topValue = markerNode.marker.topQnA.valueProperty.value;
      var bottomValue = markerNode.marker.bottomQnA.valueProperty.value;

      //
      if ( topValue >= 0 || bottomValue >= 0 ) {

        // undo stack management
        if ( ( nodeIndex < 0 ) && isRemovable ) {
          this.removableMarkerNodeList.push( markerNode );
        }
        else if ( ( nodeIndex >= 0 ) && !isRemovable ) {
          this.removableMarkerNodeList.splice( nodeIndex, 1 );
        }

        // calc X position based on the currently set value
        var xPercent = -1;
        if ( bottomValue >= 0 ) {
          xPercent = ( bottomValue / this.numberLine.bottomMaxProperty.value );
        }
        else {
          xPercent = ( topValue / this.numberLine.topMaxProperty.value );
        }

        x = ( ( 1.0 - xPercent ) * this.origin.x ) + ( this.graphBounds.maxX * xPercent );

        if ( x > ( this.graphBounds.maxX ) ) {
          x = this.outOfRangeMarkerX;
          markerNode.marker.outOfRangeProperty.set( true );
        }
        else {
          markerNode.marker.outOfRangeProperty.set( false );
        }
      }

      // check edit marker for existing markers with same values
      if ( this.numberLine.markerExists( markerNode.marker ) ) {
        this.removeMarkerNode( markerNode );
      }

      // update the position on the number line
      markerNode.marker.setPosition( x, y, markerNode.marker.editableProperty.value );

      // make sure the edit marker is on top of others
      if ( markerNode.marker.editableProperty.value ) {
        markerNode.moveToFront();
      }

      this.addEditMarkerNode();
    },

    /**
     * Handles the undo button visibility as well as it's location - to the far left or under a specific marker.
     *
     * @private
     */
    updateUndoButton: function() {

      if ( this.removableMarkerNodeList.length > 0 ) {

        // get the top marker on the undo stack
        var markerNode = this.removableMarkerNodeList[ this.removableMarkerNodeList.length - 1 ];

        // move the undo button based on the marker's 'editability'
        if ( markerNode.marker.editableProperty.value ) {
          // edit marker
          this.undoEditButtonNode.left = UNDO_BUTTON_X;
          this.undoEditButtonNode.centerY = this.graphBounds.centerY;
        }
        else {
          // position under marker node
          this.undoEditButtonNode.centerX = markerNode.centerX;
          this.undoEditButtonNode.top = markerNode.bottom - 10;
        }
      }

      // update undo button visibility
      this.undoEditButtonNode.visible = ( this.removableMarkerNodeList.length > 0 &&
                                          ( this.undoEditButtonNode.centerX <= this.xAxisLength - this.axisArrowSize ) );
    },

    // @public
    reset: function() {
      this.expandedProperty.reset();
      this.removeAllMarkerNodes();
    }

  } );  // define

} );  // inherit
