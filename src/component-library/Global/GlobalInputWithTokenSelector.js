import React, { useState, useContext, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as TOKEN_ROUTES_MAP } from '../../pages/Token/routes';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { hiddenValue, showAmount } from '../../utils/amount';
import { getMediaRemoteUrl } from '../../utils/media';
import { LOGOS, getShortAddress } from '../../utils/wallet';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import CardButton from '../CardButton/CardButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalInputWithButton from './GlobalInputWithButton';

import Avatar from '../../assets/images/Avatar.png';
import GlobalButton from './GlobalButton';
import theme from './theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  containeralt: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#eee',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    height: 300,
    margin: 'auto',
    padding: 30,
    width: 300,
  },
  gap: {
    height: 10,
  },
});

const GlobalInputWithTokenSelector = ({
  params,
  value,
  setValue,
  image,
  title,
  t,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigation();
  const [loaded, setloaded] = useState(false);

  const [tokens, setTokens] = useState({});
  const [{ activeWallet, hiddenBalance }] = useContext(AppContext);

  const [searchToken, setSearchToken] = useState('');

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(),
        ),
      ]).then(([balance]) => {
        setTokens(balance.items || []);
        setloaded(true);
      });
    }
  }, [activeWallet, params]);

  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };

  const onSelect = token => {
    if (params.action === 'send') {
      navigate(TOKEN_ROUTES_MAP.TOKEN_SEND, { tokenId: token.address });
    } else if (params.action === 'receive') {
      navigate(TOKEN_ROUTES_MAP.TOKEN_RECEIVE, { tokenId: token.address });
    } else {
      navigate(TOKEN_ROUTES_MAP.TOKEN_DETAIL, { tokenId: token.address });
    }
  };

  const goToAddToken = token => {
    navigate(TOKEN_ROUTES_MAP.TOKEN_ADD, {
      action: params.action,
      walletAddress: activeWallet.getReceiveAddress(),
    });
  };

  console.log(activeWallet.chain);

  return (
    <>
      <GlobalInputWithButton
        value={value}
        setValue={setValue}
        action={
          <CardButton
            type="secondary"
            size="sm"
            title={title}
            image={
              image || (loaded && getMediaRemoteUrl(LOGOS[activeWallet.chain]))
            }
            imageSize="xs"
            actionIcon="disclose"
            onPress={() => setIsVisible(true)}
            buttonStyle={{ paddingRight: 0, paddingLeft: 6 }}
            keyboardType="numeric"
            nospace
          />
        }
        {...props}
      />

      <GlobalText>{activeWallet.token}</GlobalText>

      <Modal
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
        visible={isVisible}>
        <GlobalLayout
          fullscreen
          style={{ backgroundColor: theme.colors.bgDarken }}>
          <GlobalLayout.Header>
            <GlobalBackTitle
              onBack={() => setIsVisible(false)}
              title={t('wallet.select_token')}
            />

            {loaded && (
              <>
                <GlobalInput
                  forSearch
                  placeholder={t('actions.search_placeholder')}
                  value={searchToken}
                  setValue={setSearchToken}
                />
                <GlobalPadding />
                {tokens.map(token => (
                  <CardButton
                    key={token.mint}
                    onPress={() => onSelect(token)}
                    icon={<GlobalImage url={token.logo} size="md" circle />}
                    title={token.name}
                    actions={[
                      <GlobalText key={'amount-action'} type="body2">
                        {hiddenBalance
                          ? hiddenValue
                          : showAmount(token.usdBalance)}
                      </GlobalText>,
                    ]}
                  />
                ))}
              </>
            )}
          </GlobalLayout.Header>

          <GlobalLayout.Footer>
            <GlobalButton
              type="primary"
              wideSmall
              onPress={() => setIsVisible(false)}
              title={t('actions.close')}
            />
          </GlobalLayout.Footer>
        </GlobalLayout>
      </Modal>
    </>
  );
};

export default withTranslation()(GlobalInputWithTokenSelector);
