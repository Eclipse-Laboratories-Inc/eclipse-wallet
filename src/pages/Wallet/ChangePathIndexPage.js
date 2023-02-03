import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import { getShortAddress } from '../../utils/wallet';
import GlobalText from '../../component-library/Global/GlobalText';

const ChangePathIndexPage = ({ t }) => {
  const navigate = useNavigation();
  const [{ activeAccount, networkId, pathIndex }, { changePathIndex }] =
    useContext(AppContext);

  const onSelect = async targetIndex => {
    await changePathIndex(targetIndex);
    navigate(ROUTES_MAP.WALLET_OVERVIEW);
  };

  const onBack = () => navigate(ROUTES_MAP.WALLET_OVERVIEW);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title={activeAccount.name} />
        <GlobalText type="headline3" color="tertiary" center>
          {t('wallet.select_derivable_account')}
        </GlobalText>

        {activeAccount.networksAccounts[networkId].map(
          (account, index) =>
            account && (
              <CardButton
                key={account.path}
                active={index === pathIndex}
                complete={index === pathIndex}
                title={getShortAddress(account.getReceiveAddress())}
                description={account.path}
                onPress={() => onSelect(index)}
              />
            ),
        )}
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(ChangePathIndexPage);
