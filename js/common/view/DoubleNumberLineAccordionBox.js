// Copyright 2016-2017, University of Colorado Boulder

/**
 * Displays a double number line in an accordion box, with a marker editor, undo button and eraser button.
 * Responsibilities include:
 * - creation of markers, based on contents of the marker editor
 * - a single level of undo for markers
 * - location and animation of the marker editor
 * - location and visibility of the undo button
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var DoubleNumberLineNode = require( 'UNIT_RATES/common/view/DoubleNumberLineNode' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Marker = require( 'UNIT_RATES/common/model/Marker' );
  var MarkerEditorNode = require( 'UNIT_RATES/common/view/MarkerEditorNode' );
  var MoveTo = require( 'TWIXT/MoveTo' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var doubleNumberLineString = require( 'string!UNIT_RATES/doubleNumberLine' );

  /**
   * @param {DoubleNumberLine} doubleNumberLine
   * @param {MarkerEditor} markerEditor
   * @param {Node} keypadLayer - layer in which the (modal) keypad will be displayed
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineAccordionBox( doubleNumberLine, markerEditor, keypadLayer, options ) {

    options = _.extend( {}, URConstants.ACCORDION_BOX_OPTIONS, {

      // DoubleNumberLineAccordionBox options
      titleString: doubleNumberLineString, // {string} title displayed next to the expand/collapse button
      keypadLocation: 'below', // {string} whether the keypad is 'above' or 'below' the double number line

      // DoubleNumberLineNode options
      axisViewLength: 1000, // {number} view length of doubleNumberLine's range
      indicatorXProperty: null, // {Property.<number>|null} position of the indicator, in view coordinates. null means no indicator.
      indicatorColor: 'green' // {Color|string} color of the indicator

    }, options );

    // title on the accordion box
    assert && assert( !options.titleNode, 'creates its own title node' );
    options.titleNode = new Text( options.titleString, {
      font: URConstants.ACCORDION_BOX_TITLE_FONT,
      maxWidth: 300 // i18n, determined empirically
    } );

    // double number line
    var doubleNumberLineNode = new DoubleNumberLineNode( doubleNumberLine, {
      axisViewLength: options.axisViewLength,
      numeratorOptions: doubleNumberLine.numeratorOptions,
      denominatorOptions: doubleNumberLine.denominatorOptions,
      indicatorXProperty: options.indicatorXProperty,
      indicatorColor: options.indicatorColor
    } );

    // home positions for marker editor and undo button, to left of axes
    var markerEditorNodeHomeX = doubleNumberLineNode.left - 28;
    var undoButtonHomePosition = new Vector2( markerEditorNodeHomeX, doubleNumberLineNode.centerY );

    // when the marker editor exceeds the range of the axes, move it to the right of the axes
    var markerEditorNodeOutOfRangeX = doubleNumberLineNode.x + doubleNumberLineNode.outOfRangeXOffset;

    // marker editor
    var markerEditorNode = new MarkerEditorNode( markerEditor, this, keypadLayer, {
      numeratorOptions: doubleNumberLine.numeratorOptions,
      denominatorOptions: doubleNumberLine.denominatorOptions,
      keypadLocation: options.keypadLocation,
      x: markerEditorNodeHomeX,
      centerY: doubleNumberLineNode.centerY
    } );

    // The undo button is overloaded (bad design, imo), and can apply to either the marker editor or a marker.
    // This flag indicates whether the undo button applies to the editor (true) or a marker (false).
    var undoAppliesToEditor = true;

    // Pressing the undo button moves the marker edit back to its home position,
    // or removes the marker that was most recently added using the editor.
    var undoButton = new RectangularPushButton( {
      content: new FontAwesomeNode( 'undo', {
        scale: 0.36 // to approximately match height of marker editor buttons, determined empirically
      } ),
      visible: false,
      baseColor: URColors.undoButton,
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

    // Pressing the eraser button erases all 'erasable' markers from the double number line.
    var eraserButton = new EraserButton( {
      scale: 0.92, // to approximately match height of marker editor buttons, determined empirically
      baseColor: URColors.eraserButton,
      listener: function() {
        doubleNumberLine.erase();
      },
      right: doubleNumberLineNode.right,
      bottom: markerEditorNode.bottom
    } );
    eraserButton.touchArea = eraserButton.localBounds.dilatedXY( 5, 5 );

    // assemble the content for the accordion box
    var contentNode = new Node( {
      children: [ doubleNumberLineNode, undoButton, markerEditorNode, eraserButton ]
    } );

    AccordionBox.call( this, contentNode, options );

    // animation for marker editor
    var markerEditorNodeAnimation = null;

    // if false, move the marker editor immediately instead of animating.
    // Used to set the editor's initial position on startup.
    var markerEditorAnimationEnabled = false;

    // Observe marker editor, to position the editor and create markers.
    var markerEditorObserver = function() {

      // local vars to improve readability
      var numerator = markerEditor.numeratorProperty.value;
      var denominator = markerEditor.denominatorProperty.value;
      var maxNumerator = doubleNumberLine.getMaxNumerator();
      var maxDenominator = doubleNumberLine.getMaxDenominator();
      var axisViewLength = doubleNumberLineNode.axisViewLength;

      // {number} destination for horizontal animation of marker editor, null indicates that no animation is required
      var destinationX = null;

      // if the marker has both a numerator and denominator...
      if ( numerator !== null && denominator !== null ) {

        if ( denominator <= maxDenominator ) {

          // create a marker
          var isMajor = doubleNumberLine.isMajorMarker( numerator, denominator );
          var marker = new Marker( numerator, denominator, 'editor', {
            isMajor: isMajor,
            color: isMajor ? URColors.majorMarker : URColors.minorMarker
          } );

          // Return the marker editor to its home position.
          // Do this before adding the marker so that the undo button is associated with the marker.
          markerEditor.reset();

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
      else { // marker is not fully specified

        // undo marker is lost when we start using the editor
        if ( doubleNumberLine.undoMarkerProperty.value ) {
          doubleNumberLine.undoMarkerProperty.value = null;
        }

        if ( numerator === null && denominator === null ) {

          // both values are empty, move marker editor back to home position
          destinationX = markerEditorNodeHomeX;

          // hide undo button
          undoButton.center = undoButtonHomePosition;
          undoButton.visible = false;
        }
        else { // one of the 2 values is filled in

          if ( numerator !== null ) {

            // numerator is filled in
            if ( numerator > maxNumerator ) {

              // move marker editor to right of axis arrows
              destinationX = markerEditorNodeOutOfRangeX;
            }
            else {

              // move marker editor to position of numerator
              destinationX = doubleNumberLineNode.x +
                             doubleNumberLine.modelToViewNumerator( numerator, axisViewLength );
            }
          }
          else {
            assert && assert( denominator !== null, 'expected a valid denominator' );

            // denominator is filled in
            if ( denominator > maxDenominator ) {

              // move marker editor to right of axis arrows
              destinationX = markerEditorNodeOutOfRangeX;
            }
            else {

              // move marker editor to position of denominator
              destinationX = doubleNumberLineNode.x +
                             doubleNumberLine.modelToViewDenominator( denominator, axisViewLength );
            }
          }

          // undo button is visible to left of axes
          undoButton.center = undoButtonHomePosition;
          undoButton.visible = true;
        }
      }

      // if we need to move the marker editor...
      if ( destinationX !== null ) {

        var destination = new Vector2( destinationX, markerEditorNode.y );

        if ( !markerEditorAnimationEnabled ) {
          markerEditorNode.translation = destination;
        }
        else {

          // stop any animation that is in progress
          markerEditorNodeAnimation && markerEditorNodeAnimation.stop();

          // animate the marker editor to it's new location
          markerEditorNodeAnimation = new MoveTo( markerEditorNode, destination, {

            // controllable via query parameter
            duration: 750 / URQueryParameters.animationSpeed,

            // marker editor is not interactive while animating
            onStart: function() { markerEditorNode.pickable = false; },
            onComplete: function() { markerEditorNode.pickable = true; },
            onStop: function() { markerEditorNode.pickable = true; }
          } );
          markerEditorNodeAnimation.start();
        }
      }
    };
    markerEditor.numeratorProperty.link( markerEditorObserver ); // unlink in dispose
    markerEditor.denominatorProperty.link( markerEditorObserver ); // unlink in dispose
    markerEditorAnimationEnabled = true;

    // Observe the 'undo' marker. One level of undo is supported, and the undo button is overloaded.
    // As soon as you enter a value using the marker editor, you lose the ability to undo the previous marker.
    var undoMarkerObserver = function( marker ) {
      if ( marker ) {

        // associate the undo button with the marker
        undoAppliesToEditor = false;

        // Position the undo button below the undoable marker
        undoButton.centerX = doubleNumberLine.modelToViewDenominator( marker.denominatorProperty.value, doubleNumberLineNode.axisViewLength );
        undoButton.bottom = markerEditorNode.bottom;
        undoButton.visible = true;
      }
      else {

        // associate the undo button with the editor
        undoAppliesToEditor = true;

        // Move the undo button to its home position, invisible if the marker editor contains no values
        undoButton.center = undoButtonHomePosition;
        undoButton.visible = !markerEditor.isEmpty();
      }
    };
    doubleNumberLine.undoMarkerProperty.link( undoMarkerObserver ); // unlink in dispose

    // @private
    this.disposeDoubleNumberLineAccordionBox = function() {

      // model cleanup
      doubleNumberLine.undoMarkerProperty.unlink( undoMarkerObserver );
      markerEditor.numeratorProperty.unlink( markerEditorObserver );
      markerEditor.denominatorProperty.unlink( markerEditorObserver );

      // view cleanup
      markerEditorNodeAnimation && markerEditorNodeAnimation.stop();
      markerEditorNode.dispose();
      doubleNumberLineNode.dispose();
    };

    // @private required by prototype functions
    this.doubleNumberLineNode = doubleNumberLineNode;
  }

  unitRates.register( 'DoubleNumberLineAccordionBox', DoubleNumberLineAccordionBox );

  return inherit( AccordionBox, DoubleNumberLineAccordionBox, {

    // @public
    dispose: function() {
      this.disposeDoubleNumberLineAccordionBox();
      AccordionBox.prototype.dispose.call( this );
    },

    /**
     * Gets the origin of the double number line's origin in the global view coordinate frame.
     * This is used to line up other things (like the race track in 'Racing Lab' screen) with the double number line.
     * @returns {*}
     * @public
     */
    getGlobalOrigin: function() {
      return this.doubleNumberLineNode.parentToGlobalPoint( new Vector2( this.doubleNumberLineNode.x, this.doubleNumberLineNode.y ) );
    }
  } );
} );
