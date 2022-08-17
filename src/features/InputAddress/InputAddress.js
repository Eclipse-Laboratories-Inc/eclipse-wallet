import React, { useContext, useState, useMemo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import debounce from 'lodash/debounce';

import { AppContext } from '../../AppProvider';
import { withTranslation } from '../../hooks/useTranslations';
import IconQRCodeScanner from '../../assets/images/IconQRCodeScanner.png';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalInputWithButton from '../../component-library/Global/GlobalInputWithButton';
import theme from '../../component-library/Global/theme';
import { isNative } from '../../utils/platform';

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
  onChange,
  validAddress,
  setValidAddress,
  recipient = true,
  onQR = () => {},
}) => {
  const [{ activeWallet }] = useContext(AppContext);
  const [checkingAddress, setCheckingAddress] = useState(false);
  const [result, setResult] = useState(false);
  const validateAddress = useMemo(
    () =>
      debounce(async a => {
        setCheckingAddress(true);
        try {
          const r = await activeWallet.validateDestinationAccount(a);
          setCheckingAddress(false);
          setValidAddress(r.type !== 'ERROR');
          setResult(r);
        } catch (error) {
          setCheckingAddress(false);
          setValidAddress(false);
          setResult({ type: 'ERROR', code: 'ERROR' });
          console.log(error);
        }
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeWallet],
  );
  useEffect(() => {
    setValidAddress(false);
    if (address) {
      validateAddress(address);
    } else {
      setResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <>
      <GlobalInputWithButton
        startLabel={recipient ? t('general.to') : null}
        placeholder={
          recipient
            ? t('general.recipient_s_address', {
                token: activeWallet.chain,
              })
            : t('general.address')
        }
        value={address}
        setValue={onChange}
        onActionPress={() => {}}
        buttonIcon={!validAddress && isNative() ? IconQRCodeScanner : undefined}
        buttonOnPress={onQR}
        disabled={checkingAddress}
        complete={validAddress}
        inputStyle={
          result && result.type !== 'SUCCESS' ? styles[result.type] : {}
        }
      />
      {result && result.type !== 'SUCCESS' && (
        <GlobalText
          type="body1"
          center
          color={result.type === 'ERROR' ? 'negative' : 'warning'}>
          {t(`general.address_validation.${result.code}`)}
        </GlobalText>
      )}
    </>
  );
};

export default withTranslation()(InputAddress);
