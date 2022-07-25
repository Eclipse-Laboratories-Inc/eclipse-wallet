import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { withTranslation } from '../../hooks/useTranslations';
import { getShortAddress } from '../../utils/wallet';
import clipboard from '../../utils/clipboard';

import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import QRImage from '../../features/QRImage';
import theme from '../../component-library/Global/theme';

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrBox: {
    padding: theme.gutters.paddingMD,
    backgroundColor: theme.staticColor.alwaysWhite,
    borderRadius: theme.borderRadius.borderRadiusNormal,
  },
});

const TokenReceivePage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setloaded] = useState(false);
  const [token, setToken] = useState({});

  const [{ activeWallet }] = useContext(AppContext);

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(),
        ),
      ]).then(([balance]) => {
        const tokenSelected = (balance.items || []).find(
          i => i.address === params.tokenId,
        );
        setToken(tokenSelected || {});
        setloaded(true);
      });
    }
  }, [activeWallet, params]);

  const goToBack = () => {
    navigate(ROUTES_MAP.WALLET);
  };

  const onCopy = () => clipboard.copy(token.address);

  return (
    loaded && (
      <GlobalLayoutForTabScreen>
        <GlobalBackTitle
          onBack={goToBack}
          smallTitle={t('token.receive.title')}
        />

        <View style={styles.centered}>
          <View style={styles.qrBox}>
            <QRImage address={token.address} />
          </View>

          <GlobalPadding size="md" />

          <GlobalText type="body1" center>
            {token.name} ({getShortAddress(token.address)})
          </GlobalText>

          <GlobalPadding size="md" />

          <GlobalButton
            type="secondary"
            title={t('general.copy')}
            onPress={onCopy}
          />

          <GlobalPadding size="md" />

          <GlobalText type="body1" center>
            2 lines max Validation text sint occaecat cupidatat non proident
          </GlobalText>

          <GlobalPadding size="4xl" />

          <GlobalButton
            type="secondary"
            wideSmall
            title={t('general.close')}
            onPress={goToBack}
          />
        </View>
      </GlobalLayoutForTabScreen>
    )
  );
};

export default withParams(withTranslation()(TokenReceivePage));
