// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var ComboBox = require( 'SUN/ComboBox' );
  var ItemType = require( 'UNIT_RATES/shopping/enum/ItemType' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // images
  var appleImage = require( 'image!UNIT_RATES/apple.png' );

  // strings

  // constants
  var FONT = new PhetFont( 18 );

  /**
   *
   * @param {Property.<ItemType>} itemTypeProperty
   * @param {Node}
   * @param {Object} [options]
   * @constructor
   */
  function ItemComboBox( itemTypeProperty, parentNode, options ) {

    options = _.extend( {
      listPosition: 'above',
      buttonCornerRadius: 5,
      listCornerRadius: 5,
      itemYMargin: 0,
      itemXMargin: 3,
      maxWidth: 600
    }, options );


    var appleNode = new Image( appleImage, {
      scale: 0.15
    } );

    var items = [
      ComboBox.createItem( createItemBox( ItemType.APPLES, appleNode ), ItemType.APPLES ),
    ];

    ComboBox.call( this, items, itemTypeProperty, parentNode, options );
  }

  /**
   * @param {string} titleString
   * @param {Node} itemNode
   * @returns {HBox}
   */
  function createItemBox( itemString, itemNode ) {

    var itemText = new Text( itemString, { font: FONT, maxWidth: 200 } );
    var hStrut = new HStrut( 50 );

    // container for one row in the legend
    return new HBox( {
      spacing: 0,
      top: 0,
      right: 0,
      align: 'center',
      children: [ itemText, hStrut, itemNode ]
    } );
  }

  unitRates.register( 'ItemComboBox', ItemComboBox );

  return inherit( ComboBox, ItemComboBox, {

  } ); // inherit

} ); // define
