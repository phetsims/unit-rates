// Copyright 2016, University of Colorado Boulder

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
      buttonTouchAreaYDilation: 5,
      horizontalAxisLength: 575
    }, options );

    var doubleNumberLineNode = new DoubleNumberLineNode( doubleNumberLine, {
      horizontalAxisLength: options.horizontalAxisLength,
      numeratorOptions: doubleNumberLine.numeratorOptions,
      denominatorOptions: doubleNumberLine.denominatorOptions,
      x: 0,
      y: 0
    } );

    var markerEditorHomeX = doubleNumberLineNode.left - 40;
    var undoButtonHomePosition = new Vector2( markerEditorHomeX, doubleNumberLineNode.centerY );

    var markerEditor = new MarkerEditor( doubleNumberLine.unitRateProperty, this, keypadLayer, {
      numeratorOptions: doubleNumberLine.numeratorOptions,
      denominatorOptions: doubleNumberLine.denominatorOptions,
      x: markerEditorHomeX,
      centerY: doubleNumberLineNode.centerY
    } );

    var undoButton = new FontAwesomeButton( 'undo', {
      visible: false,
      baseColor: 'rgb( 242, 242, 242 )',
      iconScale: 0.5,
      listener: function() {
        markerEditor.reset();
        undoButton.visible = false;
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

    // Observe marker editor, to position the editor and create markers.
    var markerEditorObserver = function() {

      var destinationX = null; // destination for horizontal animation of marker editor

      if ( markerEditor.isValidMarker() ) {

        if ( markerEditor.denominatorProperty.value <= doubleNumberLine.denominatorOptions.axisRange.max ) {

          // create a marker on the double number line
          doubleNumberLine.undoMarkerProperty.value = markerEditor.denominatorProperty.value;

          // return the marker editor to its home position
          markerEditor.reset();

          //TODO move undo button below new marker and make it visible
          undoButton.visible = false;
        }
        else {

          // marker is out of range, move editor to right of axis arrows
          destinationX = doubleNumberLineNode.x + options.horizontalAxisLength + 5;
        }
      }
      else { // marker is invalid

        if ( markerEditor.numeratorProperty.value === null && markerEditor.denominatorProperty.value === null ) {

          // both values are empty, move marker editor back to home position
          destinationX = markerEditorHomeX;
        }
        else {

          // one value is empty, move marker to position of the non-empty value
          var denominator = markerEditor.getValidDenominator();
          assert && assert( denominator >= 0, 'invalid denominator: ' + denominator );

          if ( denominator > doubleNumberLine.denominatorOptions.axisRange.max ) {

            // move marker editor to right of axis arrows
            destinationX = doubleNumberLineNode.x + options.horizontalAxisLength + 5;
          }
          else {
            destinationX = doubleNumberLineNode.x + doubleNumberLine.modelToView( denominator );
          }

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

    // @private
    this.disposeDoubleNumberLineAccordionBox = function() {
      markerEditorAnimation && markerEditorAnimation.stop();
      markerEditor.numeratorProperty.unlink( markerEditorObserver );
      markerEditor.denominatorProperty.unlink( markerEditorObserver );
      markerEditor.dispose();
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
