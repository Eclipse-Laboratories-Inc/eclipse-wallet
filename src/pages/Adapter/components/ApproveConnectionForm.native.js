import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';

import BasicCard from '../../../component-library/Card/BasicCard';
import GlobalButton from '../../../component-library/Global/GlobalButton';
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

const ApproveConnectionForm = ({
  t,
  origin,
  name,
  icon,
  config,
  onApprove,
  onReject,
}) => {
  const [{ activeWallet }] = useContext(AppContext);

  const [scope, setScope] = useState('app'); // TODO
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
    const uri = 'https://app.salmonwallet.io/adapter';

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
        <GlobalPadding size="md" />
        <ScrollView style={{ width: '100%' }}>
          <BasicCard
            contentStyle={{
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 4,
              margin: 4,
            }}>
            <GlobalText type="body1">Verification:</GlobalText>
            <GlobalPadding size="md" />
            {result === null && <GlobalSpinner />}
            {result === 'SUCCEEDED' && (
              <GlobalText color="positive" type="body1" center>
                SUCCEEDED
              </GlobalText>
            )}
            {result === 'FAILED' && (
              <GlobalText color="negative" type="body1" center>
                FAILED
              </GlobalText>
            )}
            {result === 'NOT_VERIFIABLE' && (
              <GlobalText color="warning" type="body1" center>
                NOT_VERIFIABLE
              </GlobalText>
            )}
          </BasicCard>
        </ScrollView>
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
          />
        </View>
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(ApproveConnectionForm);
