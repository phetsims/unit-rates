// Copyright 2016-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import RacingLabScreen from './racinglab/RacingLabScreen.js';
import ShoppingScreen from './shopping/ShoppingScreen.js';
import ShoppingLabScreen from './shoppinglab/ShoppingLabScreen.js';
import unitRatesStrings from './unit-rates-strings.js';

const unitRatesTitleString = unitRatesStrings[ 'unit-rates' ].title;

const simOptions = {
  credits: {
    leadDesign: 'Amy Rouinfar',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.), Dave Schmitz (Schmitzware)',
    team: 'Amy Hanson, Amanda McGarry, Susan Miller, Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Steele Dalton, Amanda Davis, Bryce Griebenow, Ethan Johnson',
    graphicArts: 'Mariah Hermsmeyer'
  }
};

SimLauncher.launch( () => {

  const screens = [
    new ShoppingScreen(),
    new ShoppingLabScreen(),
    new RacingLabScreen()
  ];

  const sim = new Sim( unitRatesTitleString, screens, simOptions );
  sim.start();
} );