// Copyright 2017-2023, University of Colorado Boulder

/**
 * Displays a value in a panel, with an optional expand/collapse button.
 * When expanded, it displays the right-justified Node.
 * When collapsed, it displays a left-justified title.
 *
 * NOTE: While this seems like a good application for AccordionBox,
 * I ran into problems related to justifying and i18n.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import unitRates from '../../unitRates.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';

// constants
const BACKGROUND_RECTANGLE_STROKE = ( phet.chipper.queryParameters.dev ? 'red' : null );

type SelfOptions = {
  panelWidth?: number; // contents are scaled to fit, height depends on contents
  panelMinHeight?: number; // minimum panel height
  expandedProperty?: Property<boolean> | null; // expand/collapse button, null indicates no expand/collapse button
  titleStringProperty?: TReadOnlyProperty<string>; // string displayed when the panel is collapsed
  titleFont?: PhetFont; // font for the title
  xSpacing?: number; // space between expand/collapse button and title
};

type ValuePanelOptions = SelfOptions;

export default class ValuePanel extends Panel {

  private readonly disposeValuePanel: () => void;

  public constructor( valueNode: Node, providedOptions?: ValuePanelOptions ) {

    const options = optionize<ValuePanelOptions, SelfOptions, PanelOptions>()( {

      // SelfOptions
      panelWidth: 100,
      panelMinHeight: 0,
      expandedProperty: null,
      titleStringProperty: new Property( '' ),
      titleFont: new PhetFont( 20 ),
      xSpacing: 8,

      // PanelOptions
      cornerRadius: 4,
      xMargin: 8,
      yMargin: 4
    }, providedOptions );

    const contentNode = new Node();
    contentNode.addChild( valueNode );

    // width of panel content
    const contentWidth = options.panelWidth - ( 2 * options.xMargin );
    const minContentHeight = Math.max( 0, options.panelMinHeight - ( 2 * options.yMargin ) );

    // invisible rectangle whose size is equivalent to the size of the panel's content, used for right justifying valueNode
    let backgroundNode: Node;

    let contentHeight = 0; // computed below
    let expandCollapseButton: ExpandCollapseButton;
    let expandedObserver: ( expanded: boolean ) => void;
    if ( !options.expandedProperty ) {

      // limit valueNode width
      valueNode.maxWidth = contentWidth;

      contentHeight = Math.max( minContentHeight, valueNode.height );

      backgroundNode = new Rectangle( 0, 0, contentWidth, contentHeight, { stroke: BACKGROUND_RECTANGLE_STROKE } );
      contentNode.addChild( backgroundNode );
    }
    else {

      // expand/collapse button, dispose required
      expandCollapseButton = new ExpandCollapseButton( options.expandedProperty, {
        sideLength: 15,
        touchAreaXDilation: 8,
        touchAreaYDilation: 10,
        touchAreaYShift: -4,
        mouseAreaXDilation: 5,
        mouseAreaYDilation: 5
      } );
      contentNode.addChild( expandCollapseButton );

      // space to right of button
      const maxExpandedWidth = contentWidth - expandCollapseButton.width - options.xSpacing;

      // title, displayed when collapsed
      const titleText = new Text( options.titleStringProperty, {
        font: options.titleFont,
        maxWidth: maxExpandedWidth
      } );
      contentNode.addChild( titleText );

      // limit valueNode width
      valueNode.maxWidth = maxExpandedWidth;

      contentHeight = Math.max( minContentHeight,
        _.maxBy( [ titleText, valueNode, expandCollapseButton ], node => node.height )!.height );
      backgroundNode = new Rectangle( 0, 0, contentWidth, contentHeight, { stroke: BACKGROUND_RECTANGLE_STROKE } );
      contentNode.addChild( backgroundNode );

      // layout
      expandCollapseButton.left = backgroundNode.left;
      expandCollapseButton.centerY = backgroundNode.centerY;
      titleText.left = expandCollapseButton.right + options.xSpacing;
      titleText.centerY = backgroundNode.centerY;

      // expand/collapse
      expandedObserver = ( expanded: boolean ) => {
        valueNode.visible = expanded;
        titleText.visible = !expanded;
      };
      options.expandedProperty.link( expandedObserver ); // unlink in dispose
    }

    backgroundNode.moveToBack();
    valueNode.right = backgroundNode.right;
    valueNode.centerY = backgroundNode.centerY;

    super( contentNode, options );

    // right justify valueNode when its bounds change
    const boundsListener = () => {
      valueNode.right = backgroundNode.right;
      valueNode.centerY = backgroundNode.centerY;
    };
    valueNode.boundsProperty.lazyLink( boundsListener ); // off in dispose

    this.disposeValuePanel = () => {
      expandCollapseButton && expandCollapseButton.dispose();
      options.expandedProperty && options.expandedProperty.unlink( expandedObserver );
      valueNode.boundsProperty.unlink( boundsListener );
    };
  }

  public override dispose(): void {
    this.disposeValuePanel();
    super.dispose();
  }
}

unitRates.register( 'ValuePanel', ValuePanel );