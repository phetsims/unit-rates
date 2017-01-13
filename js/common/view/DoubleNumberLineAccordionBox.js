// Copyright 2016-2017, University of Colorado Boulder

/**
 * Displays a double number line in an accordion box, with a marker editor, undo button and eraser button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MoveTo = require( 'TWIXT/MoveTo' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // sim modules
  var DoubleNumberLineNode = require( 'UNIT_RATES/common/view/DoubleNumberLineNode' );
  var FontAwesomeButton = require( 'UNIT_RATES/common/view/FontAwesomeButton' );
  var Marker = require( 'UNIT_RATES/common/model/Marker' );
  var MarkerEditorNode = require( 'UNIT_RATES/common/view/MarkerEditorNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

  // strings
  var doubleNumberLineString = require( 'string!UNIT_RATES/doubleNumberLine' );

  /**
   * @param {DoubleNumberLine} doubleNumberLine
   * @param {Node} keypadLayer - layer in which the (modal) keypad will be displayed
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineAccordionBox( doubleNumberLine, keypadLayer, options ) {

    options = _.extend( {

      // AccordionBox options
      expandedProperty: new Property( true ),
      titleNode: new Text( doubleNumberLineString, { font: new URFont( 18 ), maxWidth: 300 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 10,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5
    }, options );

    var doubleNumberLineNode = new DoubleNumberLineNode( doubleNumberLine, {
      numeratorOptions: doubleNumberLine.numeratorOptions,
      denominatorOptions: doubleNumberLine.denominatorOptions,
      x: 0,
      y: 0
    } );

    // home positions for marker editor and undo button, to left of axes
    var markerEditorNodeHomeX = doubleNumberLineNode.left - 40;
    var undoButtonHomePosition = new Vector2( markerEditorNodeHomeX, doubleNumberLineNode.centerY );

    var markerEditorNode = new MarkerEditorNode( doubleNumberLine.unitRateProperty, this, keypadLayer, {
      numeratorOptions: doubleNumberLine.numeratorOptions,
      denominatorOptions: doubleNumberLine.denominatorOptions,
      x: markerEditorNodeHomeX,
      centerY: doubleNumberLineNode.centerY
    } );

    // The undo button is overloaded (bad design, imo), and can apply to either the marker editor or a marker.
    // This flag indicates whether the undo button applies to the editor (true) or a marker (false).
    var undoAppliesToEditor = true;

    // pressing the undo button moves the marker edit back to its home position,
    // or removes the marker that was most recently added using the editor
    var undoButton = new FontAwesomeButton( 'undo', {
      iconScale: 0.45,
      visible: false,
      baseColor: URColors.undoButton,
      listener: function() {
        if ( undoAppliesToEditor ) {
          markerEditorNode.reset();
        }
        else {
          doubleNumberLine.undo();
        }
      },
      center: undoButtonHomePosition
    } );
    undoButton.touchArea = undoButton.localBounds.dilatedXY( 5, 5 );

    var eraserButton = new EraserButton( {
      baseColor: URColors.eraserButton,
      listener: function() {
        doubleNumberLine.erase();
      }
    } );
    eraserButton.touchArea = eraserButton.localBounds.dilatedXY( 5, 5 );

    var contentNode = new VBox( {
      resize: false,
      align: 'right',
      spacing: 5,
      children: [
        new Node( { children: [ doubleNumberLineNode, undoButton, markerEditorNode ] } ),
        eraserButton
      ]
    } );

    AccordionBox.call( this, contentNode, options );

    // animation for marker editor
    var markerEditorNodeAnimation = null;

    // when the marker editor exceeds the range of the axes, move it to the right of the axes
    var markerEditorNodeOutOfRangeX = doubleNumberLineNode.x + doubleNumberLineNode.outOfRangeXOffset;

    // Observe marker editor, to position the editor and create markers.
    var markerEditorNodeObserver = function() {

      var destinationX = null; // destination for horizontal animation of marker editor

      if ( markerEditorNode.isValidMarker() ) {

        if ( markerEditorNode.denominatorProperty.value <= doubleNumberLine.denominatorOptions.axisRange.max ) {

          // create a marker
          var isMajor = ( URUtil.decimalPlaces( markerEditorNode.denominatorProperty.value ) <= doubleNumberLine.denominatorOptions.majorMarkerDecimals );
          var marker = new Marker( markerEditorNode.numeratorProperty.value, markerEditorNode.denominatorProperty.value, 'editor', {
            isMajor: isMajor,
            color: isMajor ? URColors.majorMarker : URColors.minorMarker
          } );

          // Return the marker editor to its home position.
          // Do this before adding the marker so that the undo button is associated with the marker.
          markerEditorNode.reset();

          // add marker to double number line
          if ( doubleNumberLine.addMarker( marker ) ) {

            // allow the new marker to be undone
            doubleNumberLine.undoMarkerProperty.value = marker;
          }
        }
        else {

          // marker is out of range, move editor to right of axis arrows
          destinationX = markerEditorNodeOutOfRangeX;

          // undo button is visible to left of axes
          if ( undoAppliesToEditor ) {
            undoButton.center = undoButtonHomePosition;
            undoButton.visible = true;
          }
        }
      }
      else { // marker is invalid

        // undo marker is lost when we start using the editor
        if ( doubleNumberLine.undoMarkerProperty.value ) {
          doubleNumberLine.undoMarkerProperty.value = null;
        }

        if ( markerEditorNode.numeratorProperty.value === null && markerEditorNode.denominatorProperty.value === null ) {

          // both values are empty, move marker editor back to home position
          destinationX = markerEditorNodeHomeX;

          // hide undo button if it's associated with the editor
          undoButton.center = undoButtonHomePosition;
          undoButton.visible = false;
        }
        else {

          // one value is empty, move marker to position of the non-empty value
          var denominator = markerEditorNode.getValidDenominator();
          assert && assert( denominator >= 0, 'invalid denominator: ' + denominator );

          if ( denominator > doubleNumberLine.denominatorOptions.axisRange.max ) {

            // move marker editor to right of axis arrows
            destinationX = markerEditorNodeOutOfRangeX;
          }
          else {
            destinationX = doubleNumberLineNode.x + doubleNumberLineNode.modelToView( denominator );
          }

          // undo button is visible to left of axes
          undoButton.center = undoButtonHomePosition;
          undoButton.visible = true;
        }
      }

      if ( destinationX !== null ) {

        // stop any animation that is in progress
        markerEditorNodeAnimation && markerEditorNodeAnimation.stop();

        markerEditorNodeAnimation = new MoveTo( markerEditorNode, new Vector2( destinationX, markerEditorNode.y ), {

          // animation duration is controllable via query parameter
          duration: URQueryParameters.animationDuration,

          // marker editor is not interactive while animating
          onStart: function() { markerEditorNode.pickable = false; },
          onComplete: function() { markerEditorNode.pickable = true; },
          onStop: function() { markerEditorNode.pickable = true; }
        } );
        markerEditorNodeAnimation.start();
      }
    };
    markerEditorNode.numeratorProperty.lazyLink( markerEditorNodeObserver ); // unlink in dispose
    markerEditorNode.denominatorProperty.lazyLink( markerEditorNodeObserver ); // unlink in dispose

    // Observe the 'undo' marker. One level of undo is supported, and the undo button is overloaded.
    // As soon as you enter a value using the marker editor, you lose the ability to undo the previous marker.
    var undoMarkerObserver = function( marker ) {
      if ( marker ) {

        // associate the undo button with the marker
        undoAppliesToEditor = false;

        // Position the undo button below the undoable marker
        undoButton.centerX = doubleNumberLineNode.modelToView( marker.denominator );
        undoButton.bottom = markerEditorNode.bottom;
        undoButton.visible = true;
      }
      else {

        // associate the undo button with the editor
        undoAppliesToEditor = true;

        // Move the undo button to its home position
        undoButton.center = undoButtonHomePosition;
        undoButton.visible = ( markerEditorNode.centerX !== markerEditorNodeHomeX );
      }
    };
    doubleNumberLine.undoMarkerProperty.link( undoMarkerObserver ); // unlink in dispose

    //TODO test this in context of ShoppingLabScreen
    // When the unit rate changes, cancel any edit that is in progress
    var unitRateObserver = function( unitRate ) {
      markerEditorNode.reset();
    };
    doubleNumberLine.unitRateProperty.link( unitRateObserver ); // unlink in dispose

    // @private
    this.disposeDoubleNumberLineAccordionBox = function() {

      // model cleanup
      doubleNumberLine.unitRateProperty.unlink( unitRateObserver );
      doubleNumberLine.undoMarkerProperty.unlink( undoMarkerObserver );

      // view cleanup
      markerEditorNodeAnimation && markerEditorNodeAnimation.stop();
      markerEditorNode.numeratorProperty.unlink( markerEditorNodeObserver );
      markerEditorNode.denominatorProperty.unlink( markerEditorNodeObserver );
      markerEditorNode.dispose();
      doubleNumberLineNode.dispose();
    };
  }

  unitRates.register( 'DoubleNumberLineAccordionBox', DoubleNumberLineAccordionBox );

  return inherit( AccordionBox, DoubleNumberLineAccordionBox, {

    // @public
    dispose: function() {
      AccordionBox.prototype.dispose.call( this );
      this.disposeDoubleNumberLineAccordionBox();
    }
  } );
} );
