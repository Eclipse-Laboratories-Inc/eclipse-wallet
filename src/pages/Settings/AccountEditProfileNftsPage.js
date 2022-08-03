import React from 'react';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalNftList from '../../component-library/Global/GlobalNftList';

const AccountEditProfileNftsPage = ({ params, t }) => {
  const navigate = useNavigation();
  const nftsGroup = [
    {
      mint: 'dW212',
      media:
        'https://cryptohasbullanft.com/wp-content/uploads/2022/05/logan-768x768.jpeg',
      name: 'Mock 1',
    },
    {
      mint: 'dW211',
      media:
        'https://cryptohasbullanft.com/wp-content/uploads/2022/05/WhatsApp-Image-2022-05-09-at-5.45.23-AM-768x763.jpeg',
      name: 'Mock 2',
    },
  ];

  const onBack = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE, {
      address: params.address,
    });
  const onClick = nft =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT_PROFILE_NFTS_DETAIL, {
      address: params.address,
      id: nft.mint,
    });
  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.wallets.set_profile_picture`)}
        />
        <GlobalNftList nonFungibleTokens={nftsGroup} onClick={onClick} />
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(AccountEditProfileNftsPage));
