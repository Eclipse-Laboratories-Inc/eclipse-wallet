import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Linking } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP as NFTS_ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import { cache, CACHE_TYPES } from '../../utils/cache';
import {
  getTransactionImage,
  getWalletName,
  TRANSACTION_STATUS,
} from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';
import { TOKEN_DECIMALS, SOL_ICON } from '../Transactions/constants';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import GlobalInputWithButton from '../../component-library/Global/GlobalInputWithButton';
import CardButton from '../../component-library/CardButton/CardButton';
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

const NftsListingPage = ({ params, t }) => {
  const navigate = useNavigation();
  const isListed = params.type === 'unlist';

  const [loaded, setLoaded] = useState(false);
  const [listedLoaded, setListedLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState();
  const [step, setStep] = useState(isListed ? 2 : 1);
  const [nftDetail, setNftDetail] = useState({});
  const [transactionId, setTransactionId] = useState();
  const [error, setError] = useState(false);
  const [solBalance, setSolBalance] = useState(null);
  const [price, setPrice] = useState(null);
  const [fee, setFee] = useState(5000);
  const [{ activeWallet, hiddenValue, config }] = useContext(AppContext);

  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.NFT_SEND);

  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.BALANCE,
          () => activeWallet.getBalance(),
        ),
        cache(
          `${activeWallet.networkId}-${activeWallet.getReceiveAddress()}`,
          CACHE_TYPES.NFTS_ALL,
          () => activeWallet.getAllNfts(),
        ),
      ]).then(async ([balance, nfts]) => {
        const tks = balance.items || [];
        const nft = nfts.find(n => n.mint === params.id);
        setSolBalance(tks.length ? tks[0] : null);
        if (nft) {
          setNftDetail(nft);
        }
        const listed = await activeWallet.getListedNfts();
        setPrice(
          listed.find(l => l.token_address === params.id)?.market_place_state
            ?.price || null,
        );
        setListedLoaded(true);
        setLoaded(true);
      });
    }
  }, [activeWallet, params.id]);

  const zeroAmount = parseFloat(price) <= 0;
  const validAmount =
    parseFloat(price) * 0.01 <= solBalance?.uiAmount && parseFloat(price) > 0;

  const goToBack = () => {
    if (step === 3) {
      navigate(NFTS_ROUTES_MAP.NFTS_LIST);
    } else if (step === 1) {
      navigate(NFTS_ROUTES_MAP.NFTS_DETAIL, { id: params.id });
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
      setStep(3);
      let txId;
      isListed
        ? (txId = await activeWallet.unlistNft(nftDetail.mint))
        : (txId = await activeWallet.listNft(nftDetail.mint, price));
      setTransactionId(txId);
      setStatus(
        isListed ? TRANSACTION_STATUS.UNLISTING : TRANSACTION_STATUS.LISTING,
      );
      await activeWallet.confirmTransferTransaction(txId);
      setStatus(TRANSACTION_STATUS.SUCCESS);
      trackEvent(EVENTS_MAP.NFT_LIST_COMPLETED);
      setSending(false);
    } catch (e) {
      console.error(e);
      setStatus(TRANSACTION_STATUS.FAIL);
      trackEvent(EVENTS_MAP.NFT_LIST_FAILED);
      setStep(3);
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

            <View style={globalStyles.centered}>
              <GlobalImage source={IconExpandMoreAccent1} size="md" />
            </View>
            <View style={globalStyles.inlineFlexButtons}>
              <GlobalText type="body2">{t('nft.sell_price')}</GlobalText>
            </View>

            <GlobalPadding size="xs" />

            <GlobalInputWithButton
              value={price}
              setValue={setPrice}
              placeholder={t('swap.enter_amount')}
              hiddenValue={hiddenValue}
              invalid={!validAmount && !!price}
              number
              action={
                <CardButton
                  type="secondary"
                  size="sm"
                  title="SOL"
                  image={SOL_ICON}
                  imageSize="xs"
                  onPress={() => {}}
                  buttonStyle={{ paddingRight: 6, paddingLeft: 6 }}
                  keyboardType="numeric"
                  nospace
                />
              }
            />

            {zeroAmount && (
              <GlobalText type="body1" center color="negative">
                {t(`token.send.amount.invalid`)}
              </GlobalText>
            )}

            <GlobalPadding size="xs" />

            <GlobalText type="body1" color="tertiary">
              {showValue((price === '.' ? 0 : price) * solBalance?.usdPrice, 6)}{' '}
              {t('general.usd')}
            </GlobalText>

            {error && (
              <GlobalText type="body1" color="negative">
                {t('general.error')}
              </GlobalText>
            )}

            <GlobalPadding size="lg" />

            <View
              style={[
                globalStyles.inlineWell,
                { paddingBottom: 0, marginBottom: 0 },
              ]}>
              <GlobalText type="caption" color="tertiary">
                {t('nft.marketplace_fee')}
              </GlobalText>
              <View>
                <View
                  style={[
                    globalStyles.inlineWell,
                    { paddingBottom: 0, marginBottom: 0 },
                  ]}>
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
          </GlobalLayout.Header>

          <GlobalPadding size="lg" />

          <GlobalLayout.Footer inlineFlex>
            <GlobalButton
              type="secondary"
              flex
              title="Cancel"
              onPress={onCancel}
              style={[globalStyles.button, globalStyles.buttonLeft]}
              touchableStyles={globalStyles.buttonTouchable}
            />

            <GlobalButton
              type="primary"
              flex
              disabled={!price || zeroAmount}
              title={t('nft.preview_sell')}
              onPress={() => setStep(2)}
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

              <GlobalPadding size="xl" />

              <GlobalImage source={IconExpandMoreAccent1} size="md" />

              <GlobalPadding size="xs" />

              <View style={globalStyles.inlineWell}>
                <GlobalText type="caption" color="tertiary">
                  {t('nft.sell_price')}
                </GlobalText>
                <View>
                  <View
                    style={[
                      globalStyles.inlineWell,
                      { paddingBottom: 0, marginBottom: 0 },
                    ]}>
                    <GlobalText type="body1" nospace>
                      {price} SOL
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
                  {isListed ? t('nft.marketplace') : t('nft.marketplace_fee')}
                </GlobalText>
                <View>
                  <View
                    style={[
                      globalStyles.inlineWell,
                      { paddingBottom: 0, marginBottom: 0 },
                    ]}>
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
                  {!isListed && (
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
                  )}
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
              disabled={sending || !listedLoaded}
              type="primary"
              flex
              title={t(`general.confirm`)}
              onPress={onConfirm}
              style={[globalStyles.button, globalStyles.buttonRight]}
              touchableStyles={globalStyles.buttonTouchable}
            />
          </GlobalLayout.Footer>
        </>
      )}
      {step === 3 && (
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
                  type={
                    status === 'listing' || status === 'unlisting'
                      ? 'subtitle2'
                      : 'headline2'
                  }
                  color={
                    (status === 'listing' || status === 'unlisting') &&
                    'secondary'
                  }
                  center>
                  {t(`token.send.transaction_${status}`)}
                </GlobalText>
              )}
              {status === 'success' && (
                <>
                  <GlobalPadding size="xs" />
                  <GlobalText type="body1" center>
                    {isListed ? t(`nft.success_unlist`) : t(`nft.success_list`)}
                  </GlobalText>
                  <GlobalPadding size="xxs" />
                  <View style={globalStyles.inlineCentered}>
                    <GlobalImage
                      style={[
                        globalStyles.centeredSmall,
                        { marginRight: theme.gutters.paddingXXS },
                      ]}
                      source={IconHyperspace}
                      size="xs"
                      circle
                    />
                    <GlobalText type="body2" center>
                      {t(`nft.marketplace_name`)}
                    </GlobalText>
                  </View>
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

export default withParams(withTranslation()(NftsListingPage));
