import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Linking } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import {
  getTransactionImage,
  getWalletName,
  TRANSACTION_STATUS,
} from '../../utils/wallet';
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
import IconExpandMoreAccent1 from '../../assets/images/IconExpandMoreAccent1.png';
import IconHyperspace from '../../assets/images/IconHyperspace.jpeg';
import { isNative } from '../../utils/platform';
import { showValue } from '../../utils/amount';
import QRScan from '../../features/QRScan/QRScan';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';

const styles = StyleSheet.create({
  mediumSizeImage: {
    width: 234,
    height: 234,
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
  insufficientBtn: {
    fontSize: theme.fontSize.fontSizeSM,
    lineHeight: theme.lineHeight.lineHeightSM,
  },
  zeroMargin: {
    paddingBottom: 0,
    marginBottom: 0,
  },
});

const NftsBuyingPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState();
  const [step, setStep] = useState(1);
  const [nftDetail, setNftDetail] = useState({});
  const [transactionId, setTransactionId] = useState();
  const [error, setError] = useState(false);
  const [solBalance, setSolBalance] = useState(null);
  const [price, setPrice] = useState(null);
  const [fee, setFee] = useState(5000);
  const [{ activeWallet, config }] = useContext(AppContext);

  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.NFT_BUY);

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        activeWallet.getBalance(),
        activeWallet.getCollectionItems(params.id, params.pageNumber),
      ]).then(async ([balance, nfts]) => {
        const tks = balance.items || [];
        const nft = nfts.market_place_snapshots.find(
          n => n.token_address === params.nftId,
        );
        setSolBalance(tks.length ? tks[0] : null);
        if (nft) {
          setNftDetail(nft);
          setPrice(nft.lowest_listing_mpa?.price);
        }
        setLoaded(true);
      });
    }
  }, [activeWallet, params.id, params.nftId, params.pageNumber]);

  const insufficientFunds =
    solBalance?.uiAmount < price * 0.01 + price + fee / TOKEN_DECIMALS.SOLANA;

  const goToBack = () => {
    if (step === 2) {
      navigate(NFTS_ROUTES_MAP.NFTS_LIST);
    } else if (step === 1) {
      navigate(NFTS_ROUTES_MAP.NFTS_COLLECTION_DETAIL_PARAMS, {
        id: params.id,
        nftId: params.nftId,
        pageNumber: params.pageNumber,
      });
    }
    setStep(step - 1);
  };

  const onCancel = () => {
    trackEvent(EVENTS_MAP.cancelled);
    navigate(NFTS_ROUTES_MAP.NFTS_LIST);
  };

  const onConfirm = async () => {
    setSending(true);
    try {
      setStatus(TRANSACTION_STATUS.CREATING);
      setStep(2);
      const txId = await activeWallet.buyNft(nftDetail.token_address, price);
      setTransactionId(txId);
      setStatus(TRANSACTION_STATUS.BUYING);
      await activeWallet.confirmTransferTransaction(txId);
      setStatus(TRANSACTION_STATUS.SUCCESS);
      trackEvent(EVENTS_MAP.NFT_BUY_COMPLETED);
      setSending(false);
    } catch (e) {
      console.error(e);
      setStatus(TRANSACTION_STATUS.FAIL);
      trackEvent(EVENTS_MAP.NFT_BUY_FAILED);
      setStep(2);
      setSending(false);
    }
  };

  const openTransaction = async () => {
    const url = `https://solscan.io/tx/${transactionId}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`UNSUPPORTED LINK ${url}`);
    }
  };

  const openMarketplace = async () => {
    const url = `https://hyperspace.xyz/account/${activeWallet.getReceiveAddress()}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`UNSUPPORTED LINK ${url}`);
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
              {nftDetail.name}
            </GlobalText>

            <View style={globalStyles.centered}>
              <View style={[globalStyles.squareRatio, styles.mediumSizeImage]}>
                <GlobalImage
                  source={getMediaRemoteUrl(nftDetail.meta_data_img)}
                  style={globalStyles.bigImage}
                  square
                  squircle
                />
              </View>

              <GlobalPadding size="xl" />

              <GlobalImage source={IconExpandMoreAccent1} size="md" />

              <GlobalPadding size="xs" />

              <View style={globalStyles.inlineWell}>
                <GlobalText type="caption" color="tertiary">
                  {t('nft.sell_price')}
                </GlobalText>
                <View>
                  <View style={[globalStyles.inlineWell, styles.zeroMargin]}>
                    <GlobalText type="body1" nospace>
                      {price?.toFixed(2)} SOL
                    </GlobalText>
                  </View>
                  <GlobalText
                    type="caption"
                    color="tertiary"
                    style={[
                      globalStyles.alignEnd,
                      {
                        marginBottom: theme.gutters.paddingSM,
                        // paddingVertical: theme.gutters.paddingXS,
                        paddingHorizontal: theme.gutters.paddingSM,
                      },
                    ]}>
                    {showValue(price * solBalance?.usdPrice, 2)}{' '}
                    {t('general.usd')}
                  </GlobalText>
                </View>
              </View>

              <View style={globalStyles.inlineWell}>
                <GlobalText type="caption" color="tertiary">
                  {t('nft.marketplace_fee')}
                </GlobalText>
                <View>
                  <View style={[globalStyles.inlineWell, styles.zeroMargin]}>
                    <GlobalImage
                      style={[
                        globalStyles.centeredSmall,
                        { marginRight: theme.gutters.paddingXXS },
                      ]}
                      source={IconHyperspace}
                      size="xs"
                      circle
                    />
                    <GlobalText type="body1" nospace>
                      {t('nft.marketplace_name')}
                    </GlobalText>
                  </View>
                  <GlobalText
                    type="caption"
                    color="tertiary"
                    style={[
                      globalStyles.alignEnd,
                      {
                        marginBottom: theme.gutters.paddingSM,
                        // paddingVertical: theme.gutters.paddingXS,
                        paddingHorizontal: theme.gutters.paddingSM,
                      },
                    ]}>
                    {t('nft.marketplace_fee_perc')}
                  </GlobalText>
                </View>
              </View>

              {fee && (
                <View style={globalStyles.inlineWell}>
                  <GlobalText type="caption" color="tertiary">
                    {t('adapter.detail.transaction.fee')}
                  </GlobalText>
                  <GlobalText type="body2">
                    {fee / TOKEN_DECIMALS.SOLANA} SOL
                  </GlobalText>
                </View>
              )}
              {/* {addressEmpty && (
                <GlobalText type="caption" center color={'warning'}>
                  {t(`token.send.empty_account_fee`)}
                </GlobalText>
              )} */}
            </View>
          </GlobalLayout.Header>

          <GlobalLayout.Footer inlineFlex>
            <GlobalButton
              type="secondary"
              flex
              title={t(`actions.cancel`)}
              onPress={onCancel}
              style={[globalStyles.button, globalStyles.buttonLeft]}
              touchableStyles={globalStyles.buttonTouchable}
            />

            <GlobalButton
              disabled={sending || insufficientFunds}
              type="primary"
              flex
              title={
                insufficientFunds
                  ? t(`token.send.amount.insufficient`)
                  : t(`general.confirm`)
              }
              onPress={onConfirm}
              textStyle={insufficientFunds && styles.insufficientBtn}
              style={[globalStyles.button, globalStyles.buttonRight]}
              touchableStyles={globalStyles.buttonTouchable}
            />
          </GlobalLayout.Footer>
        </>
      )}
      {step === 2 && (
        <>
          <GlobalLayout.Header>
            <GlobalPadding size="4xl" />
            <GlobalPadding size="4xl" />
            <GlobalPadding size="4xl" />

            {(status === 'creating' || status === 'sending') && (
              <>
                <GlobalPadding size="4xl" />
                <GlobalPadding size="4xl" />
              </>
            )}

            <View style={globalStyles.centeredSmall}>
              <GlobalImage
                source={getTransactionImage(status)}
                size="3xl"
                circle
              />
              <GlobalPadding />
              {status !== 'creating' && (
                <GlobalText
                  type={status === 'buying' ? 'subtitle2' : 'headline2'}
                  color={status === 'buying' && 'secondary'}
                  center>
                  {t(`token.send.transaction_${status}`)}
                </GlobalText>
              )}
              {status === 'success' && (
                <>
                  <GlobalPadding size="xs" />
                  <GlobalText type="body1" center>
                    {t(`nft.success_buying`, { price })}
                  </GlobalText>
                  <GlobalPadding size="xxs" />
                </>
              )}
            </View>
          </GlobalLayout.Header>

          <GlobalLayout.Footer>
            {status === 'success' || status === 'fail' ? (
              <>
                {status === 'success' && (
                  <>
                    <GlobalButton
                      type="primary"
                      wide
                      title={t(`nft.goto_marketplace`)}
                      onPress={openMarketplace}
                      style={globalStyles.button}
                      touchableStyles={globalStyles.buttonTouchable}
                    />
                    <GlobalPadding size="md" />
                  </>
                )}

                <GlobalButton
                  type="primary"
                  wide
                  title={t(`token.send.goto_explorer`)}
                  onPress={openTransaction}
                  style={globalStyles.button}
                  touchableStyles={globalStyles.buttonTouchable}
                />

                <GlobalPadding size="md" />

                <GlobalButton
                  type="secondary"
                  title={t(`general.close`)}
                  wide
                  onPress={goToBack}
                  style={globalStyles.button}
                  touchableStyles={globalStyles.buttonTouchable}
                />
              </>
            ) : (
              <GlobalButton
                type="text"
                wide
                textStyle={
                  status === 'creating' ? styles.creatingTx : styles.viewTxLink
                }
                title={
                  status === 'creating'
                    ? t(`token.send.transaction_creating`)
                    : t(`token.send.view_transaction`)
                }
                readonly={status === 'creating'}
                onPress={openTransaction}
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

export default withParams(withTranslation()(NftsBuyingPage));
