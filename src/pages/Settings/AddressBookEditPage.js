import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP } from './routes';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalInput from '../../component-library/Global/GlobalInput';
import InputAddress from '../../features/InputAddress/InputAddress';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import { isNative } from '../../utils/platform';
import QRScan from '../../features/QRScan/QRScan';

const AddressBookEditPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [{ networkId, addressBook }, { editAddress }] = useContext(AppContext);
  const [addressLabel, setAddressLabel] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [validAddress, setValidAddress] = useState(false);
  const [addressEmpty, setAddressEmpty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [recipientName, setRecipientName] = useState(null);
  const [inputAddress, setInputAddress] = useState('');

  useEffect(() => {
    const address = addressBook.find(a => a.address === params.address);
    if (address) {
      setCurrentAddress(address.address);
      setRecipientName(address.domain);
      setInputAddress(address.address);
      setRecipientAddress(address.address);
      setAddressLabel(address.name);
    }
  }, [params.addressbook]);
  const isValid = addressLabel && validAddress;
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_ADDRESSBOOK);
  const onSave = async () => {
    setSaving(true);
    await editAddress(currentAddress, {
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
          title={t(`settings.addressbook.edit`)}
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

export default withParams(withTranslation()(AddressBookEditPage));
