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
import { getWalletChain } from '../../utils/wallet';

const AddressBookAddPage = ({ t }) => {
  const navigate = useNavigation();
  const [saving, setSaving] = useState(false);
  const [{ activeWallet, addressBook }, { addAddress }] =
    useContext(AppContext);

  const onBack = () => navigate(ROUTES_MAP.SETTINGS_ADDRESSBOOK);
  const onSave = async () => {
    setSaving(true);
    // check valid address and non existant
    await addAddress({
      address: addressAddress,
      name: addressLabel,
      chain: getWalletChain(activeWallet),
    });
    setSaving(false);
    navigate(ROUTES_MAP.SETTINGS_ADDRESSBOOK);
  };
  const [addressLabel, setAddressLabel] = useState('');
  const [addressAddress, setAddressAddress] = useState('');

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t('settings.addressbook.add')}
        />
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
          onPress={onSave}
          disabled={saving}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(AddressBookAddPage);
