import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import { getShortAddress } from '../../utils/wallet';

const ChangePathIndexPage = ({ t }) => {
  const navigate = useNavigation();
  const [{ activeAccount, networkId, pathIndex }, { changePathIndex }] =
    useContext(AppContext);
  const onSelect = targetIndex => changePathIndex(targetIndex);

  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.change_path_index`)}
        />

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
