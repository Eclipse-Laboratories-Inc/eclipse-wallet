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
import InputAddress from '../../features/InputAddress/InputAddress';
import { isNative } from '../../utils/platform';
import QRScan from '../../features/QRScan/QRScan';

const AddressBookAddPage = ({ t }) => {
  const navigate = useNavigation();
  const [saving, setSaving] = useState(false);
  const [{ networkId }, { addAddress }] = useContext(AppContext);
  const [addressLabel, setAddressLabel] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [validAddress, setValidAddress] = useState(false);
  const [addressEmpty, setAddressEmpty] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [recipientName, setRecipientName] = useState(null);
  const [inputAddress, setInputAddress] = useState('');

  const isValid = addressLabel && validAddress;
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_ADDRESSBOOK);
  const onSave = async () => {
    setSaving(true);
    // check valid address and non existent
    await addAddress({
      address: recipientAddress,
      name: addressLabel,
      domain: recipientName,
      networkId,
    });
    setSaving(false);
    navigate(ROUTES_MAP.SETTINGS_ADDRESSBOOK);
  };
  const toggleScan = () => {
    setShowScan(!showScan);
  };
  const onRead = qr => {
    const data = qr;
    setRecipientAddress(data.data);
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
          autoFocus={true}
        />

        <GlobalPadding size="md" />

        <InputAddress
          address={inputAddress}
          publicKey={recipientAddress}
          domain={recipientName}
          validAddress={validAddress}
          addressEmpty={addressEmpty}
          onChange={setInputAddress}
          setValidAddress={setValidAddress}
          setDomain={setRecipientName}
          setAddressEmpty={setAddressEmpty}
          setPublicKey={setRecipientAddress}
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
