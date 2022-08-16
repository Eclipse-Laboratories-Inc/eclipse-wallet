import React, { useState, useContext, useEffect } from 'react';
import { View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from './routes';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { withTranslation } from '../../hooks/useTranslations';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalText from '../../component-library/Global/GlobalText';

import IconCircleAdd from '../../assets/images/IconCircleAdd.png';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

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
      <GlobalLayout fullscreen>
        <GlobalLayout.Header>
          <GlobalBackTitle
            onBack={goToBack}
            inlineTitle="Wallet Name"
            inlineAddress={activeWallet.getReceiveAddress()}
          />

          <View style={globalStyles.centered}>
            <GlobalText type="headline2">
              {t(`token.action.addToken`)}
            </GlobalText>

            <GlobalImage
              source={IconCircleAdd}
              size="xxl"
              style={globalStyles.bigImage}
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
        </GlobalLayout.Header>

        <GlobalLayout.Footer inlineFlex>
          <GlobalButton
            type="secondary"
            flex
            title="Cancel"
            onPress={goToBack}
            style={[globalStyles.button, globalStyles.buttonLeft]}
            touchableStyles={globalStyles.buttonTouchable}
          />

          <GlobalButton
            type="primary"
            flex
            title="Add Token"
            onPress={onAddToken}
            style={[globalStyles.button, globalStyles.buttonRight]}
            touchableStyles={globalStyles.buttonTouchable}
          />
        </GlobalLayout.Footer>
      </GlobalLayout>
    )
  );
};

export default withParams(withTranslation()(TokenAddPage));
