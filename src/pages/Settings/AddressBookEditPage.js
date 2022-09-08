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
import { getWalletChain } from '../../utils/wallet';
import { isNative } from '../../utils/platform';
import QRScan from '../../features/QRScan/QRScan';

const AddressBookEditPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [{ activeWallet, addressBook }, { editAddress }] =
    useContext(AppContext);
  const [addressLabel, setAddressLabel] = useState('');
  const [addressAddress, setAddressAddress] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentLabel, setCurrentLabel] = useState('');
  const [validAddress, setValidAddress] = useState(false);
  const [addressEmpty, setAddressEmpty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showScan, setShowScan] = useState(false);
  useEffect(() => {
    const address = addressBook.find(a => a.address === params.address);
    if (address) {
      setCurrentAddress(address.address);
      setCurrentLabel(address.name);
      setAddressAddress(address.address);
      setAddressLabel(address.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.addressbook]);
  const isValid = addressLabel && validAddress;
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_ADDRESSBOOK);
  const onSave = async () => {
    setSaving(true);
    await editAddress(
      { address: currentAddress },
      {
        address: addressAddress,
        name: addressLabel,
        chain: getWalletChain(activeWallet),
      },
    );
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
          title={t(`settings.addressbook.edit`)}
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
          addressEmpty={addressEmpty}
          setValidAddress={setValidAddress}
          setAddressEmpty={setAddressEmpty}
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

export default withParams(withTranslation()(AddressBookEditPage));
