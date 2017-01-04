// Copyright 2016-2017, University of Colorado Boulder

/**
 * Displays a double number line in an accordion box, with a marker editor and eraser button.
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
  var MarkerEditor = require( 'UNIT_RATES/common/view/MarkerEditor' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

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

    // home locations of UI components that move around
    var markerEditorHomeX = doubleNumberLineNode.left - 40;
    var undoButtonHomePosition = new Vector2( markerEditorHomeX, doubleNumberLineNode.centerY );

    var markerEditor = new MarkerEditor( doubleNumberLine.unitRateProperty, this, keypadLayer, {
      numeratorOptions: doubleNumberLine.numeratorOptions,
      denominatorOptions: doubleNumberLine.denominatorOptions,
      x: markerEditorHomeX,
      centerY: doubleNumberLineNode.centerY
    } );

    // The undo button is overloaded (bad design, imo), and can apply to either the marker editor or a marker.
    // This flag indicates whether the undo button applies to the editor (true) or a marker (false).
    var undoAppliesToEditor = true;

    // pressing the undo button moves the marker edit back to its home position,
    // or removes the marker that was most recently added using the editor
    var undoButton = new FontAwesomeButton( 'undo', {
      visible: false,
      baseColor: 'rgb( 242, 242, 242 )',
      iconScale: 0.45,
      listener: function() {
        if ( undoAppliesToEditor ) {
          markerEditor.reset();
        }
        else {
          doubleNumberLine.undo();
        }
      },
      center: undoButtonHomePosition
    } );
    undoButton.touchArea = undoButton.localBounds.dilatedXY( 5, 5 );

    var eraserButton = new EraserButton( {
      baseColor: 'rgb( 242, 242, 242 )',
      listener: function() {
        markerEditor.reset();
        doubleNumberLine.erase();
      }
    } );
    eraserButton.touchArea = eraserButton.localBounds.dilatedXY( 5, 5 );

    var contentNode = new VBox( {
      resize: false,
      align: 'right',
      spacing: 5,
      children: [
        new Node( { children: [ doubleNumberLineNode, undoButton, markerEditor ] } ),
        eraserButton
      ]
    } );

    AccordionBox.call( this, contentNode, options );

    // animation for marker editor
    var markerEditorAnimation = null;

    // when the marker editor exceeds the range of the axes, move it to the right of the axes
    var markerEditorOutOfRangeX = doubleNumberLineNode.x + doubleNumberLine.horizontalAxisLength + 5;

    // Observe marker editor, to position the editor and create markers.
    var markerEditorObserver = function() {

      var destinationX = null; // destination for horizontal animation of marker editor

      if ( markerEditor.isValidMarker() ) {

        if ( markerEditor.denominatorProperty.value <= doubleNumberLine.denominatorOptions.axisRange.max ) {

          // create a marker on the double number line
          var marker = markerEditor.createMarker();

          // Return the marker editor to its home position.
          // Do this before adding the marker so that the undo button is associated with the marker.
          markerEditor.reset();

          // add marker to double number line
          doubleNumberLine.markers.add( marker );

          // allow the new marker to be undone
          doubleNumberLine.undoMarkerProperty.value = marker;
        }
        else {

          // marker is out of range, move editor to right of axis arrows
          destinationX = markerEditorOutOfRangeX;

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

        if ( markerEditor.numeratorProperty.value === null && markerEditor.denominatorProperty.value === null ) {

          // both values are empty, move marker editor back to home position
          destinationX = markerEditorHomeX;

          // hide undo button if it's associated with the editor
          undoButton.center = undoButtonHomePosition;
          undoButton.visible = false;
        }
        else {

          // one value is empty, move marker to position of the non-empty value
          var denominator = markerEditor.getValidDenominator();
          assert && assert( denominator >= 0, 'invalid denominator: ' + denominator );

          if ( denominator > doubleNumberLine.denominatorOptions.axisRange.max ) {

            // move marker editor to right of axis arrows
            destinationX = markerEditorOutOfRangeX;
          }
          else {
            destinationX = doubleNumberLineNode.x + doubleNumberLine.modelToView( denominator );
          }

          // undo button is visible to left of axes
          undoButton.center = undoButtonHomePosition;
          undoButton.visible = true;
        }
      }

      if ( destinationX !== null ) {

        // stop any animation that is in progress
        markerEditorAnimation && markerEditorAnimation.stop();

        markerEditorAnimation = new MoveTo( markerEditor, new Vector2( destinationX, markerEditor.y ), {

          // animation duration is controllable via query parameter
          duration: URQueryParameters.animationDuration,

          // marker editor is not interactive while animating
          onStart: function() { markerEditor.pickable = false; },
          onComplete: function() { markerEditor.pickable = true; },
          onStop: function() { markerEditor.pickable = true; }
        } );
        markerEditorAnimation.start();
      }
    };
    markerEditor.numeratorProperty.link( markerEditorObserver );
    markerEditor.denominatorProperty.link( markerEditorObserver );

    var undoMarkerObserver = function( marker ) {
      if ( marker ) {

        // associate the undo button with the marker
        undoAppliesToEditor = false;

        // Position the undo button below the undoable marker
        undoButton.centerX = doubleNumberLine.modelToView( marker.denominator );
        undoButton.top = doubleNumberLineNode.bottom + 3;
        undoButton.visible = true;
      }
      else {

        // associate the undo button with the editor
        undoAppliesToEditor = true;

        // Move the undo button to its home position
        undoButton.center = undoButtonHomePosition;
        undoButton.visible = ( markerEditor.centerX !== markerEditorHomeX );
      }
    };
    doubleNumberLine.undoMarkerProperty.link( undoMarkerObserver );

    // @private
    this.disposeDoubleNumberLineAccordionBox = function() {
      markerEditorAnimation && markerEditorAnimation.stop();
      markerEditor.numeratorProperty.unlink( markerEditorObserver );
      markerEditor.denominatorProperty.unlink( markerEditorObserver );
      markerEditor.dispose();
      doubleNumberLine.undoMarkerProperty.unlink( undoMarkerObserver );
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
