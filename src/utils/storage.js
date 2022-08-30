import { isExtension } from './platform';
import storageExtension from './storage.extension';
import storageWindow from './storage.window';

export default isExtension() ? storageExtension : storageWindow;
