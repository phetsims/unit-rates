// Copyright 2017-2023, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import unitRates from '../unitRates.js';
import { ProfileColorProperty } from '../../../scenery/js/imports.js';

// constants
const DEFAULT_BUTTON_COLOR = 'rgb( 242, 242, 242 )';

// all values are {Color|string} and read-only, unless otherwise noted
const URColors = {

  // screens
  shoppingScreenBackgroundColorProperty: new ProfileColorProperty( unitRates, 'shoppingScreenBackgroundColor', {
    default: 'rgb( 226, 255, 249 )'
  } ),
  racingLabScreenBackgroundColorProperty: new ProfileColorProperty( unitRates, 'racingLabScreenBackgroundColor', {
    default: 'rgb( 233, 242, 254 )'
  } ),

  // buttons
  categoryButton: 'white',
  editButton: 'yellow',
  enterButton: 'yellow',
  eraserButton: DEFAULT_BUTTON_COLOR,
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
  shelfColorProperty: new ProfileColorProperty( unitRates, 'shelfColor', {
    default: 'rgb( 232, 201, 166 )' // light brown
  } ),

  // scale
  scaleTopLightColorProperty: new ProfileColorProperty( unitRates, 'scaleTopLightColor', {
    default: 'white'
  } ),
  scaleTopDarkColorProperty: new ProfileColorProperty( unitRates, 'scaleTopDarkColor', {
    default: 'rgb( 220, 220, 220 )'
  } ),
  scaleBodyColorProperty: new ProfileColorProperty( unitRates, 'scaleBodyColor', {
    default: 'rgb( 113, 148, 152 )'
  } ),

  // race cars
  car1: 'rgb( 236, 22, 44 )',  // red car, must match redCar.png
  car2: 'rgb( 0, 143, 204 )' // blue car, must match blueCar.png
};

unitRates.register( 'URColors', URColors );

export default URColors;