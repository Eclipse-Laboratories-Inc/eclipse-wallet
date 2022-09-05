import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SOLANA } from '4m-wallet-adapter/constants/chains';

import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as ROUTES_MAP_ONBOARDING } from '../Onboarding/routes';
import { ROUTES_MAP } from './routes';

import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';

import { AppContext } from '../../AppProvider';
import { getDefaultEndpoint, getWalletName } from '../../utils/wallet';

const AdapterSelectPage = ({ t }) => {
  const navigate = useNavigation();
  const [
    { activeWallet, wallets, locked, config, context },
    { changeEndpoint, changeActiveWallet },
  ] = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const endpoint = useMemo(() => {
    return context.get('network') || getDefaultEndpoint('SOLANA');
  }, [context]);
  const getWalletIndex = wallet =>
    wallets.findIndex(w => w.address === wallet.address);
  const selectWallet = useCallback(
    async walletIndex => {
      await changeActiveWallet(walletIndex);
      await changeEndpoint('SOLANA', endpoint);
      navigate(ROUTES_MAP.ADAPTER_DETAIL);
    },
    [changeActiveWallet, changeEndpoint, navigate, endpoint],
  );
  const onSelectAction = async actionRoute => {
    await changeEndpoint('SOLANA', endpoint);
    navigate(actionRoute, { chainCode: 'SOLANA' });
  };
  useEffect(() => {
    if (activeWallet?.getChain() === SOLANA) {
      const address = activeWallet.getReceiveAddress();
      const walletIndex = wallets.findIndex(w => w.address === address);
      if (walletIndex >= 0) {
        selectWallet(walletIndex);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [activeWallet, wallets, selectWallet]);
  if (loading) {
    return null;
  }
  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalBackTitle title={t('adapter.select.title')} />
        {!locked &&
          wallets
            .filter(({ chain }) => chain === 'SOLANA')
            .map(wallet => (
              <CardButtonWallet
                key={wallet.address}
                title={getWalletName(wallet.address, config)}
                address={wallet.address}
                chain={wallet.chain}
                selected={activeWallet.getReceiveAddress() === wallet.address}
                onPress={() => selectWallet(getWalletIndex(wallet))}
              />
            ))}
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wide
          title={t('wallet.create_wallet')}
          onPress={() =>
            onSelectAction(ROUTES_MAP_ONBOARDING.ONBOARDING_CREATE)
          }
        />

        <GlobalPadding size="md" />

        <GlobalButton
          type="secondary"
          wide
          title={t('wallet.recover_wallet')}
          onPress={() =>
            onSelectAction(ROUTES_MAP_ONBOARDING.ONBOARDING_RECOVER)
          }
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(AdapterSelectPage);
