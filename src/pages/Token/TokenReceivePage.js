import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { withTranslation } from '../../hooks/useTranslations';
import { getShortAddress } from '../../utils/wallet';
import clipboard from '../../utils/clipboard';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import QRImage from '../../features/QRImage';
import IconCopy from '../../assets/images/IconCopy.png';

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
  inlineWell: {
    marginBottom: theme.gutters.paddingXS,
    paddingVertical: theme.gutters.paddingXS,
    paddingHorizontal: theme.gutters.paddingSM,
    width: '100%',
    maxWidth: theme.variables.buttonMaxWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.borderRadius.borderRadiusMD,
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

  const onCopyAlias = () => clipboard.copy(token.address);

  const onCopyAddress = () => clipboard.copy(token.address);

  return (
    loaded && (
      <GlobalLayout withContainer>
        <View style={globalStyles.mainHeader}>
          <GlobalBackTitle
            onBack={goToBack}
            smallTitle={t('token.receive.title')}
          />

          <View style={styles.centered}>
            <View style={styles.qrBox}>
              <QRImage address={token.address} />
            </View>

            <GlobalPadding size="md" />

            <View style={styles.inlineWell}>
              <GlobalText type="body2">Name.acr</GlobalText>

              <GlobalButton onPress={onCopyAlias} size="medium">
                <GlobalImage source={IconCopy} size="xs" />
                <GlobalText type="button">Copy</GlobalText>
              </GlobalButton>
            </View>

            <View style={styles.inlineWell}>
              <GlobalText type="body2">
                {token.name} ({getShortAddress(token.address)})
              </GlobalText>

              <GlobalButton onPress={onCopyAddress} size="medium">
                <GlobalImage source={IconCopy} size="xs" />
                <GlobalText type="button">Copy</GlobalText>
              </GlobalButton>
            </View>

            <GlobalPadding size="md" />

            <GlobalText type="body1" center>
              2 lines max Validation text sint occaecat cupidatat non proident
            </GlobalText>
          </View>
        </View>

        <View style={globalStyles.mainFooter}>
          <GlobalButton
            type="secondary"
            wideSmall
            title={t('general.close')}
            onPress={goToBack}
          />
        </View>
      </GlobalLayout>
    )
  );
};

export default withParams(withTranslation()(TokenReceivePage));
