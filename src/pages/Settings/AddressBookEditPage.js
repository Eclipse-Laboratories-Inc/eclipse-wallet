import React, { useContext, useState } from 'react';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalInputWithButton from '../../component-library/Global/GlobalInputWithButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

const AddressBookEditPage = ({ t }) => {
  const navigate = useNavigation();

  const [{ activeWallet, wallets }, { changeActiveWallet }] =
    useContext(AppContext);

  const onBack = () => navigate(ROUTES_MAP.SETTINGS_ADDRESSBOOK);

  const [addressLabel, setAddressLabel] = useState('');
  const [addressAddress, setAddressAddress] = useState('');

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title="Edit Address" />

        <GlobalPadding size="md" />

        <GlobalInput
          placeholder={t('settings.addressbook.label')}
          value={addressLabel}
          setValue={setAddressLabel}
          invalid={false}
          autoComplete="off"
        />

        <GlobalPadding size="md" />

        <GlobalInputWithButton
          placeholder={t('settings.addressbook.add')}
          value={addressAddress}
          setValue={setAddressAddress}
          buttonLabel="Paste"
          buttonOnPress={() => {}}
        />
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wideSmall
          title={t('settings.addressbook.save')}
          onPress={onBack}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(AddressBookEditPage);
