import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalSpinner from '../../../component-library/Global/GlobalSpinner';
import GlobalText from '../../../component-library/Global/GlobalText';
import { globalStyles } from '../../../component-library/Global/theme';

import AdapterModule from '../../../native/AdapterModule';
import { AppContext } from '../../../AppProvider';
import { DAppCard } from './DAppCard';
import { getWalletName } from '../../../utils/wallet';
import { withTranslation } from '../../../hooks/useTranslations';
import { ActiveWalletCard } from './ActiveWalletCard';
import IconFailed from '../../../assets/images/IconFailed.png';
import IconSuccess from '../../../assets/images/IconSuccessGreen.png';
import IconWarning from '../../../assets/images/IconAlertWarningYellow.png';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
  },
  icon: {
    marginRight: 5,
  },
});

const ApproveConnectionForm = ({
  t,
  origin,
  name,
  icon,
  onApprove,
  onReject,
}) => {
  const [{ activeWallet, config }] = useContext(AppContext);

  const [scope, setScope] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const verification = await AdapterModule.verifyAuthorizationSource(
          origin,
        );

        setScope(verification.scope);
        setResult(verification.result);
      } catch (e) {
        console.error(e);
      }
    };

    verify();
  }, [origin]);

  const connect = useCallback(async () => {
    await onApprove();

    const publicKey = activeWallet.publicKey.toBuffer().toString('base64');
    const walletName = getWalletName(activeWallet.getReceiveAddress(), config);
    const uri = 'https://salmonwallet.io/adapter';

    AdapterModule.completeWithAuthorize(publicKey, walletName, uri, scope);
  }, [activeWallet, config, onApprove, scope]);

  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <ActiveWalletCard />
      </GlobalLayout.Header>
      <GlobalLayout.Inner>
        <GlobalText type="headline2" center>
          {t('adapter.detail.connection.title')}
        </GlobalText>
        <GlobalPadding size="xl" />
        <DAppCard name={name} icon={icon} origin={origin} />
        <GlobalPadding size="xl" />
        <GlobalText type="subtitle" color="warning" center>
          {t('adapter.detail.connection.advice')}
        </GlobalText>
        <GlobalPadding size="md" />
        <GlobalText type="subtitle" color="warning" center>
          {t('adapter.detail.connection.advice2')}
        </GlobalText>
        <GlobalPadding size="2xl" />
        <View style={[globalStyles.inlineWell, styles.center]}>
          {result === null && <GlobalSpinner />}
          {result === 'SUCCEEDED' && (
            <>
              <GlobalImage
                source={IconSuccess}
                size="xxs"
                style={styles.icon}
              />
              <GlobalText type="subtitle" color="positive">
                {t('adapter.detail.connection.verification.succeeded')}
              </GlobalText>
            </>
          )}
          {result === 'FAILED' && (
            <>
              <GlobalImage source={IconFailed} size="xxs" style={styles.icon} />
              <GlobalText type="subtitle" color="negative">
                {t('adapter.detail.connection.verification.failed')}
              </GlobalText>
            </>
          )}
          {result === 'NOT_VERIFIABLE' && (
            <>
              <GlobalImage
                source={IconWarning}
                size="xxs"
                style={styles.icon}
              />
              <GlobalText type="subtitle" color="warning">
                {t('adapter.detail.connection.verification.notVerifiable')}
              </GlobalText>
            </>
          )}
        </View>
      </GlobalLayout.Inner>
      <GlobalLayout.Footer>
        <View style={globalStyles.inlineFlexButtons}>
          <GlobalButton
            type="secondary"
            flex
            title={t('actions.deny')}
            onPress={() => onReject()}
            style={[globalStyles.button, globalStyles.buttonLeft]}
            touchableStyles={globalStyles.buttonTouchable}
          />
          <GlobalButton
            type="primary"
            flex
            title={t('actions.connect')}
            onPress={() => connect()}
            style={[globalStyles.button, globalStyles.buttonRight]}
            touchableStyles={globalStyles.buttonTouchable}
            disabled={!scope}
          />
        </View>
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(ApproveConnectionForm);
