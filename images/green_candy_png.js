/* eslint-disable */
import SimLauncher from '../../joist/js/SimLauncher.js';
const image = new Image();
const unlock = SimLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;