import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from './routes';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { withTranslation } from '../../hooks/useTranslations';

import theme from '../../component-library/Global/theme';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalText from '../../component-library/Global/GlobalText';

import IconCircleAdd from '../../assets/images/IconCircleAdd.png';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineFlexButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonTouchable: {
    flex: 1,
  },
  button: {
    alignSelf: 'stretch',
  },
  buttonLeft: {
    marginRight: theme.gutters.paddingXS,
  },
  buttonRight: {
    marginLeft: theme.gutters.paddingXS,
  },
});

const TokenAddPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setloaded] = useState(false);
  const [token, setToken] = useState({});

  const [{ activeWallet }] = useContext(AppContext);

  const [tokenMintAddress, setTokenMintAddress] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');

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
    navigate(TOKEN_ROUTES_MAP.TOKEN_SELECT, { action: params.action });
  };

  const onAddToken = () => {
    navigate(TOKEN_ROUTES_MAP.TOKEN_SEND, { tokenId: tokenMintAddress });
  };

  return (
    loaded && (
      <GlobalLayoutForTabScreen>
        <GlobalBackTitle
          onBack={goToBack}
          inlineTitle="Wallet Name"
          inlineAddress={activeWallet.getReceiveAddress()}
        />

        <View style={styles.centered}>
          <GlobalText type="headline2">{t(`token.action.addToken`)}</GlobalText>

          <GlobalImage
            source={IconCircleAdd}
            size="xxl"
            style={styles.bigImage}
            circle
          />

          <GlobalPadding size="md" />

          <GlobalText type="body2">This will cost 0.00204 ACR</GlobalText>

          <GlobalPadding size="md" />

          <GlobalInput
            placeholder="Mint Address"
            value={tokenMintAddress}
            setValue={setTokenMintAddress}
          />

          <GlobalPadding />

          <GlobalInput
            placeholder="Name"
            value={tokenName}
            setValue={setTokenName}
          />

          <GlobalPadding />

          <GlobalInput
            placeholder="Symbol"
            value={tokenSymbol}
            setValue={setTokenSymbol}
          />
        </View>

        <GlobalPadding size="4xl" />

        <View style={styles.inlineFlexButtons}>
          <GlobalButton
            type="secondary"
            flex
            title="Cancel"
            onPress={goToBack}
            style={[styles.button, styles.buttonLeft]}
            touchableStyles={styles.buttonTouchable}
          />

          <GlobalButton
            type="primary"
            flex
            title="Add Token"
            onPress={onAddToken}
            style={[styles.button, styles.buttonRight]}
            touchableStyles={styles.buttonTouchable}
          />
        </View>

        <GlobalPadding size="xl" />
      </GlobalLayoutForTabScreen>
    )
  );
};

export default withParams(withTranslation()(TokenAddPage));
