/* eslint-disable */
import SimLauncher from '../../joist/js/SimLauncher.js';
const image = new Image();
const unlock = SimLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;