import React, { useState, useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import { getWalletChain } from '../../utils/wallet';
import InputAddress from '../../features/InputAddress/InputAddress';
import { isNative } from '../../utils/platform';
import QRScan from '../../features/QRScan/QRScan';

const AddressBookAddPage = ({ t }) => {
  const navigate = useNavigation();
  const [saving, setSaving] = useState(false);
  const [{ activeWallet }, { addAddress }] = useContext(AppContext);
  const [addressLabel, setAddressLabel] = useState('');
  const [addressAddress, setAddressAddress] = useState('');
  const [validAddress, setValidAddress] = useState(false);
  const [showScan, setShowScan] = useState(false);

  const isValid = addressLabel && validAddress;
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
  const toggleScan = () => {
    setShowScan(!showScan);
  };
  const onRead = qr => {
    const data = qr;
    setAddressAddress(data.data);
    setShowScan(false);
  };
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

        <InputAddress
          address={addressAddress}
          onChange={setAddressAddress}
          validAddress={validAddress}
          setValidAddress={setValidAddress}
          recipient={false}
          onQR={toggleScan}
        />
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wideSmall
          title={t('settings.addressbook.save')}
          onPress={onSave}
          disabled={saving || !isValid}
        />
      </GlobalLayout.Footer>
      {isNative() && (
        <QRScan active={showScan} onClose={toggleScan} onRead={onRead} />
      )}
    </GlobalLayout>
  );
};

export default withTranslation()(AddressBookAddPage);
