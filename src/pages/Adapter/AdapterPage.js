import React, { useContext, useEffect, useState } from 'react';
const SOLANA = 'solana';
import { AppContext } from '../../AppProvider';
import AdapterSelect from './components/AdapterSelect';
import AdapterDetail from './components/AdapterDetail';

const AdapterPage = () => {
  const [{ activeWallet }] = useContext(AppContext);
  const [step, setStep] = useState(activeWallet?.getChain() === SOLANA ? 2 : 1);

  useEffect(() => {
    if (activeWallet?.getChain() === SOLANA) {
      setStep(2);
    }
  }, [activeWallet]);

  return (
    <>
      {step === 1 && <AdapterSelect onSelected={() => setStep(2)} />}
      {step === 2 && <AdapterDetail />}
    </>
  );
};

export default AdapterPage;
