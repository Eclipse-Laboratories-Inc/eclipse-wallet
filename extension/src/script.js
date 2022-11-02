import { initialize } from 'salmon-wallet-standard';
import { SolanaProvider } from './provider';

const salmon = new SolanaProvider();

initialize(salmon);

try {
  Object.defineProperty(window, 'salmon', { value: salmon });
} catch (error) {
  console.error(error);
}
