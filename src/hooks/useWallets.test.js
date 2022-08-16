import * as React from 'react';
import { render, act } from '@testing-library/react';
import useWallets from './useWallets';

const setup = () => {
  const returnVal = [];
  function TestComponent() {
    Object.assign(returnVal, useWallets());
    return null;
  }
  render(<TestComponent />);
  return returnVal;
};

test('Get empty wallets when init', async () => {
  const [state, actions] = setup();
  expect(state.wallets).toEqual([]);
  await act(async () => actions.removeAllWallets());
  expect(state.wallets).toEqual([]);
});
