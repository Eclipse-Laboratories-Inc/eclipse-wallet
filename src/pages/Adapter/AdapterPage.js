import React, { useContext, useEffect, useState } from 'react';
import { BLOCKCHAINS, getNetworks } from '4m-wallet-adapter';

import { AppContext } from '../../AppProvider';
import AdapterSelect from './components/AdapterSelect';
import AdapterDetail from './components/AdapterDetail';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';

const AdapterPage = () => {
  const [{ activeBlockchainAccount }, { changeNetwork }] =
    useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [networks, setNetworks] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (loading) {
        const isSolana = ({ blockchain }) => blockchain === BLOCKCHAINS.SOLANA;
        const solanaNetworks = (await getNetworks()).filter(isSolana);
        setNetworks(solanaNetworks);

        if (activeBlockchainAccount) {
          if (isSolana(activeBlockchainAccount.network)) {
            setStep(2);
          } else {
            const network = solanaNetworks?.[0];
            if (network) {
              await changeNetwork(network.id);
              setStep(2);
            }
          }
        }
        setLoading(false);
      }
    };

    load();
  }, [loading, activeBlockchainAccount, changeNetwork]);

  if (loading) {
    return <GlobalSkeleton type="Generic" />;
  }

  return (
    <>
      {step === 1 && <AdapterSelect onSelected={() => setStep(2)} />}
      {step === 2 && <AdapterDetail networks={networks} />}
    </>
  );
};

export default AdapterPage;
