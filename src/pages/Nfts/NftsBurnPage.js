import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { Message } from '@solana/web3.js';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
import { getWalletName, getTransactionImage } from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';
import { TOKEN_DECIMALS } from '../Transactions/constants';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';

import { getWalletChain } from '../../utils/wallet';
import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import useUserConfig from '../../hooks/useUserConfig';
import { SECTIONS_MAP } from '../../utils/tracking';

const styles = StyleSheet.create({
  mediumSizeImage: {
    width: 234,
    height: 234,
  },
  titleStyle: {
    color: theme.colors.labelTertiary,
  },
  viewTxLink: {
    fontFamily: theme.fonts.dmSansRegular,
    color: theme.colors.accentPrimary,
    fontWeight: 'normal',
    textTransform: 'none',
  },
  creatingTx: {
    fontFamily: theme.fonts.dmSansRegular,
    color: theme.colors.labelSecondary,
    fontWeight: 'normal',
    textTransform: 'none',
  },
});

const NftsBurnPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState();
  const [step, setStep] = useState(1);
  const [nftDetail, setNftDetail] = useState({});
  const [burnTransaction, setBurnTransaction] = useState();
  const [transactionId, setTransactionId] = useState(null);
  const [burnFee, setBurnFee] = useState(null);
  const [{ activeWallet, config }] = useContext(AppContext);
  const { explorer } = useUserConfig(
    getWalletChain(activeWallet, activeWallet.networkId),
  );
  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.NFT_SEND);

  const openTransaction = async () => {
    const url = `${explorer.url}/tx/${transactionId}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`UNSUPPORTED LINK ${url}`);
    }
  };

  useEffect(() => {
    if (activeWallet) {
      cache(
        `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}-${
          params.id
        }`,
        CACHE_TYPES.SINGLE_NFT,
        () => activeWallet.getNft(params.id),
      ).then(nft => {
        if (nft) {
          setNftDetail(nft ?? {});
        } else {
          activeWallet.getAllNftsGrouped().then(nfts => {
            setNftDetail(nfts.find(n => n.mint === params.id) ?? {});
          });
        }

        setLoaded(true);
      });
    }
  }, [activeWallet, params.id]);

  useEffect(() => {
    if (activeWallet && nftDetail && Object.keys(nftDetail).length > 0) {
      activeWallet.createNftBurnTx(nftDetail).then(tx => {
        setBurnTransaction(tx);
        activeWallet
          .estimateTransactionsFee([Message.from(tx.serializeMessage())])
          .then(fee => setBurnFee(fee));
      });

      setLoaded(true);
    }
  }, [activeWallet, nftDetail]);

  const goToBack = () => {
    if (step === 1) {
      navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, { id: params.id });
    } else {
      setStep(step - 1);
    }
  };

  const close = () => {
    navigate(NFTS_ROUTES_MAP.NFTS_LIST, { id: params.id });
  };

  const onCancel = () =>
    navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, { id: params.id });

  const onConfirmBurn = async () => {
    try {
      setStep(3);
      setStatus('burning');
      const txId = await activeWallet.confirmNftBurn(burnTransaction);

      setTransactionId(txId);
      setStatus('success');
    } catch (error) {
      console.log(error);
      setStatus('fail');
    }
  };

  return loaded ? (
    <GlobalLayout fullscreen>
      {step === 1 && (
        <>
          <GlobalLayout.Header>
            <GlobalBackTitle
              onBack={goToBack}
              inlineTitle={getWalletName(
                activeWallet.getReceiveAddress(),
                config,
              )}
              inlineAddress={activeWallet.getReceiveAddress()}
            />

            <GlobalText type="headline2" center>
              {nftDetail.name || nftDetail.symbol}
            </GlobalText>

            <View style={globalStyles.centered}>
              <View style={[globalStyles.squareRatio, styles.mediumSizeImage]}>
                <GlobalImage
                  source={getMediaRemoteUrl(nftDetail.media)}
                  style={globalStyles.bigImage}
                  square
                  squircle
                />
              </View>
            </View>

            <GlobalPadding size="xl" />

            <GlobalText type="headline3" center>
              Are you sure you want to burn this NFT?
            </GlobalText>
          </GlobalLayout.Header>

          {burnFee && (
            <View style={globalStyles.inlineWell}>
              <GlobalText type="caption" color="tertiary">
                Network Fee
              </GlobalText>
              <GlobalText type="body2">
                {burnFee / TOKEN_DECIMALS.SOLANA} SOL
              </GlobalText>
            </View>
          )}

          <GlobalLayout.Footer inlineFlex>
            <GlobalButton
              type="primary"
              flex
              title="Cancel"
              onPress={onCancel}
              style={[globalStyles.button, globalStyles.buttonLeft]}
              touchableStyles={globalStyles.buttonTouchable}
            />

            <GlobalButton
              type="secondary"
              flex
              title={t('actions.confirm')}
              onPress={onConfirmBurn}
              style={[globalStyles.button, globalStyles.buttonRight]}
              touchableStyles={globalStyles.buttonTouchable}
            />
          </GlobalLayout.Footer>
        </>
      )}
      {step === 2 && (
        <>
          <GlobalLayout.Header>
            <GlobalBackTitle
              onBack={goToBack}
              inlineTitle={getWalletName(
                activeWallet.getReceiveAddress(),
                config,
              )}
              inlineAddress={activeWallet.getReceiveAddress()}
            />

            <GlobalText type="headline2" center>
              {nftDetail.name || nftDetail.symbol}
            </GlobalText>

            <View style={globalStyles.centered}>
              <View style={[globalStyles.squareRatio, styles.mediumSizeImage]}>
                <GlobalImage
                  source={getMediaRemoteUrl(nftDetail.media)}
                  style={globalStyles.bigImage}
                  square
                  squircle
                />
              </View>

              {burnFee && (
                <View style={globalStyles.inlineWell}>
                  <GlobalText type="caption" color="tertiary">
                    Network Fee
                  </GlobalText>
                  <GlobalText type="body2">
                    {burnFee / TOKEN_DECIMALS.SOLANA} SOL
                  </GlobalText>
                </View>
              )}
            </View>
          </GlobalLayout.Header>
        </>
      )}
      {step === 3 && (
        <>
          <GlobalLayout.Header>
            <GlobalPadding size="4xl" />
            <GlobalPadding size="4xl" />
            <View style={globalStyles.centeredSmall}>
              <GlobalImage
                source={getTransactionImage(status)}
                size="3xl"
                circle
              />
              <GlobalPadding />
              <GlobalText type="headline2">Burning</GlobalText>
              <GlobalPadding />
              <View style={globalStyles.inlineCentered}>
                <GlobalButton
                  type="text"
                  wide
                  textStyle={styles.viewTxLink}
                  title={t(`general.open_explorer`)}
                  readonly={false}
                  onPress={() => openTransaction(transactionId)}
                />
              </View>
            </View>
          </GlobalLayout.Header>
          <GlobalLayout.Footer>
            {status && (
              <GlobalButton
                type="secondary"
                title={t(`general.close`)}
                wide
                onPress={close}
                style={globalStyles.button}
                touchableStyles={globalStyles.buttonTouchable}
              />
            )}
          </GlobalLayout.Footer>
        </>
      )}
    </GlobalLayout>
  ) : (
    <GlobalSkeleton type="NftDetail" />
  );
};

export default withParams(withTranslation()(NftsBurnPage));
