import { isExtension } from './platform';
import stashExtension from './stash.extension';
import stashWindow from './stash.window';

export default isExtension() ? stashExtension : stashWindow;
