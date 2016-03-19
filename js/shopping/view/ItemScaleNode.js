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
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'SUN/Panel' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // images
  var scaleImage = require( 'mipmap!UNIT_RATES/scale.png' );

  // constants
  var SCALE_WIDTH = 275; // This is the width Aspect Ratio will control height
  var DISPLAY_SIZE = new Dimension2( 80, 50 );
  var DISPLAY_BOTTOM_OFFSET = 32;
  var DISPLAY_SPACING = 10;  // space beteen mutliple displays
  var DISPLAY_FONT = new PhetFont( 20 );

  /**
   * FIXME: Add cost/weight readouts
   *
   * @param {Object} [options]
   * @constructor
   */
  function ItemScaleNode( model, options ) {

    options = options || {};

    Node.call( this, options );

    // This is Loading the scale image and scaling it to desired width and adding to the node
    var weighScaleImage = new Image( scaleImage );
    weighScaleImage.scale( SCALE_WIDTH / weighScaleImage.width );
    this.addChild( weighScaleImage );

    // cost of items display, always visible
    var costDisplayNode = new ValueDisplayNode( {
      centerX: this.centerX - ( DISPLAY_SIZE.width / 2 ) - DISPLAY_SPACING,
      centerY: this.bottom - DISPLAY_BOTTOM_OFFSET
    } );
    this.addChild( costDisplayNode );

    // weight of items display, visibility changes
    var weightDisplayNode = new ValueDisplayNode( {
      centerX: this.centerX + ( DISPLAY_SIZE.width / 2 ) + DISPLAY_SPACING,
      centerY: this.bottom - DISPLAY_BOTTOM_OFFSET
    } );
    this.addChild( weightDisplayNode );
  }

  /**
   *
   * @param {Object} [options]
   * @returns {Panel}
   * @private
   */
  function ValueDisplayNode( options ) {

    options = _.extend( {
      minWidth: DISPLAY_SIZE.width,
      minHeight: DISPLAY_SIZE.height,
      resize: false,
      cornerRadius: 5,
      lineWidth: 0,
      align: 'center'
    }, options );

    var valueText = new Text( '-', {
      font: DISPLAY_FONT,
      maxWidth: 0.9 * DISPLAY_SIZE.width,
      maxHeight: 0.9 * DISPLAY_SIZE.height
    } );

    return new Panel( valueText, options);
  }

  unitRates.register( 'ItemScaleNode', ItemScaleNode );

  return inherit( Node, ItemScaleNode, {

    /**
     * Reset the  scale node to its initial state
     */
    reset: function() {
    }

  } ); // inherit

} ); // define


