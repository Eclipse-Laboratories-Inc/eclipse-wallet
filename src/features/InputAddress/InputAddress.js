import React, { useContext, useState, useMemo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { debounce } from 'lodash';

import { AppContext } from '../../AppProvider';
import { withTranslation } from '../../hooks/useTranslations';
import IconQRCodeScanner from '../../assets/images/IconQRCodeScanner.png';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalInputWithButton from '../../component-library/Global/GlobalInputWithButton';
import theme from '../../component-library/Global/theme';
import { isNative } from '../../utils/platform';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

const styles = StyleSheet.create({
  ERROR: {
    borderColor: theme.colors.danger,
  },
  WARNING: {
    borderColor: theme.colors.warning,
  },
});
const InputAddress = ({
  t,
  address,
  publicKey,
  domain,
  onChange,
  validAddress,
  addressEmpty,
  setValidAddress,
  setPublicKey,
  setDomain,
  setAddressEmpty,
  recipient = true,
  onQR = () => {},
}) => {
  const [{ activeBlockchainAccount }] = useContext(AppContext);
  const [checkingAddress, setCheckingAddress] = useState(false);
  const [result, setResult] = useState(false);
  const [isDomain, setIsDomain] = useState(false);

  useEffect(() => {
    setDomain('');
    setPublicKey('');
    if (address && validAddress) {
      activeBlockchainAccount.getPublicKeyFromDomain(address).then(
        value => {
          setPublicKey(value);
          setDomain(address);
          setIsDomain(true);
        },
        () => {
          setPublicKey(address);
          setIsDomain(false);
        },
      );
    }
  }, [
    address,
    validAddress,
    activeBlockchainAccount,
    setDomain,
    setPublicKey,
    setIsDomain,
  ]);

  const validateAddress = useMemo(
    () =>
      debounce(async a => {
        setCheckingAddress(true);
        setValidAddress(null);
        if (a) {
          try {
            const r = await activeBlockchainAccount.validateDestinationAccount(
              a,
            );
            setCheckingAddress(false);
            setValidAddress(r.type !== 'ERROR');
            setAddressEmpty(r.code === 'EMPTY_ACCOUNT');
            setResult(r);
          } catch (error) {
            setCheckingAddress(false);
            setValidAddress(false);
            setResult({ type: 'ERROR', code: 'ERROR' });
            console.log(error);
          }
        }
      }, 500),
    [activeBlockchainAccount],
  );
  useEffect(() => {
    setResult();
    if (address) {
      validateAddress(address);
    } else {
      setValidAddress(false);
    }
  }, [address]);

  return (
    <>
      <GlobalInputWithButton
        startLabel={recipient ? t('general.to') : null}
        placeholder={
          recipient
            ? t('general.recipient_s_address', {
                token: activeBlockchainAccount.network.blockchain,
              })
            : t('general.address')
        }
        value={address}
        setValue={onChange}
        onActionPress={() => {}}
        buttonIcon={!validAddress && isNative() ? IconQRCodeScanner : undefined}
        buttonOnPress={onQR}
        editable={!checkingAddress}
        validating={checkingAddress}
        complete={validAddress}
        inputStyle={
          result && result.type !== 'SUCCESS' ? styles[result.type] : {}
        }
      />
      {result && result.type !== 'SUCCESS' && (
        <>
          <GlobalPadding size="sm" />
          <GlobalText
            type="body1"
            center
            color={result.type === 'ERROR' ? 'negative' : 'warning'}>
            {t(`general.address_validation.${result.code}`)}
          </GlobalText>
        </>
      )}
      {publicKey && isDomain && (
        <>
          <GlobalPadding size="sm" />
          <GlobalText type="caption">Public key: {publicKey}</GlobalText>
        </>
      )}
      {domain && (
        <>
          <GlobalPadding size="sm" />
          <GlobalText type="caption">Domain: {domain}</GlobalText>
        </>
      )}
    </>
  );
};

export default withTranslation()(InputAddress);
