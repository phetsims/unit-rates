// Copyright 2017, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  var DEFAULT_BUTTON_COLOR = 'rgb( 242, 242, 242 )';

  // all values are {Color|string}, unless otherwise noted
  var URColors = {

    // buttons
    categoryButton: 'white',
    editButton: 'yellow',
    enterButton: 'yellow',
    eraserButton: 'rgb( 255, 255, 219 )', // pale yellow
    refreshButton: DEFAULT_BUTTON_COLOR,
    undoButton: DEFAULT_BUTTON_COLOR,
    resetShelfButton: DEFAULT_BUTTON_COLOR,

    // markers
    questionMarker: 'green', // markers created by answering questions
    scaleMarker: 'blue', // marker that corresponds to what's on the scale
    majorMarker: 'black', // major marker created by using editor or by putting things on the scale
    minorMarker: 'gray', // minor markers created by using editor

    // marker editor
    edit: 'yellow', // corresponding value box is filled with this color while editing

    // questions
    checkMark: 'green', // check mark for correct answers
    correctQuestion: 'green', // correct answer for other questions
    incorrectQuestion: 'red', // incorrect guess
    showAnswers: 'lightGray', // show answers in this color when 'showAnswers' query parameter is present

    // shelf
    shelf: 'rgb( 174, 129, 91 )'
  };

  unitRates.register( 'URColors', URColors );

  return URColors;
} );
