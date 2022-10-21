import React, { useContext, useEffect, useState } from 'react';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalNftList from '../../component-library/Global/GlobalNftList';
import { cache, CACHE_TYPES } from '../../utils/cache';

import { AppContext } from '../../AppProvider';

const AccountEditProfileNftsPage = ({ params, t }) => {
  const [{ activeWallet }] = useContext(AppContext);
  const [nfts, setNfts] = useState(null);

  const navigate = useNavigation();
  useEffect(() => {
    if (activeWallet) {
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
        CACHE_TYPES.NFTS_ALL,
        () => activeWallet.getAllNfts(),
      ).then(result => {
        console.log(result);
        setNfts(result);
      });
    }
  }, [activeWallet]);

  const onBack = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE, {
      address: params.address,
    });
  const onClick = nft =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE_NFTS_DETAIL, {
      address: nft.mint,
      id: nft.mint,
    });
  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.wallets.set_profile_picture`)}
        />
        <GlobalNftList nonFungibleTokens={nfts} onClick={onClick} />
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(AccountEditProfileNftsPage));
