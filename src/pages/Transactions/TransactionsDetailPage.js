import React, { useContext, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Linking, TouchableOpacity } from 'react-native';
import { formatAmount } from '4m-wallet-adapter';
import moment from 'moment';

import theme from '../../component-library/Global/theme';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalToast from '../../component-library/Global/GlobalToast';

import { AppContext } from '../../AppProvider';
import { TRANSACTION_TYPE, TRANSACTION_STATUS } from './constants';
import { ROUTES_MAP } from './routes';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { useNavigation, withParams } from '../../routes/hooks';

import { hiddenValue } from '../../utils/amount';
import clipboard from '../../utils/clipboard.native';
import { SECTIONS_MAP } from '../../utils/tracking';
import { getShortAddress, getTransactionImage } from '../../utils/wallet';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import useUserConfig from '../../hooks/useUserConfig';
import { withTranslation } from '../../hooks/useTranslations';

import IconCopy from '../../assets/images/IconCopy.png';

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingTransactionBox: {
    marginVertical: theme.gutters.paddingXL,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  floatingTransaction: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  floatingSwap: {
    position: 'absolute',
    zIndex: 1,
    right: 55,
    bottom: -5,
  },
  addressCopyIcon: {
    marginLeft: theme.gutters.paddingXXS,
    marginBottom: -1,
  },
  bigImage: {
    backgroundColor: theme.colors.bgLight,
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

const IconsBanner = ({ type, status, inputs, outputs }) => {
  const success = status === TRANSACTION_STATUS.COMPLETED;

  if (type === TRANSACTION_TYPE.SWAP) {
    if (success) {
      return (
        <View style={styles.floatingTransactionBox}>
          <GlobalImage
            source={outputs?.[0].logo}
            size="xl"
            style={styles.bigImage}
            circle
          />
          <GlobalImage
            source={getTransactionImage('swap')}
            size="sm"
            style={styles.floatingSwap}
          />
          <GlobalImage
            source={inputs?.[0]?.logo}
            size="xl"
            style={styles.bigImage}
            circle
          />
        </View>
      );
    } else {
      return (
        <View style={styles.floatingTransactionBox}>
          <GlobalImage
            source={getTransactionImage('swap')}
            size="xxl"
            style={styles.bigImage}
            circle
          />
          <GlobalImage
            source={getTransactionImage('fail')}
            size="sm"
            style={styles.floatingTransaction}
          />
        </View>
      );
    }
  }
  if (type === TRANSACTION_TYPE.SEND) {
    return (
      <View style={styles.floatingTransactionBox}>
        <GlobalImage
          source={outputs?.[0]?.logo}
          size="xxl"
          style={styles.bigImage}
          circle
        />
        <GlobalImage
          source={getTransactionImage(success ? 'sent' : 'fail')}
          size="md"
          circle
          style={styles.floatingTransaction}
        />
      </View>
    );
  }

  if (type === TRANSACTION_TYPE.RECEIVE) {
    return (
      <View style={styles.floatingTransactionBox}>
        <GlobalImage
          source={inputs?.[0]?.logo}
          size="xxl"
          style={styles.bigImage}
          circle
        />
        <GlobalImage
          source={getTransactionImage(success ? 'received' : 'fail')}
          size="md"
          circle
          style={styles.floatingTransaction}
        />
      </View>
    );
  }

  if (type === TRANSACTION_TYPE.INTERACTION) {
    return (
      <View style={styles.floatingTransactionBox}>
        <GlobalImage
          source={getTransactionImage('interaction')}
          size="xxl"
          style={styles.bigImage}
          circle
        />
        {!success && (
          <GlobalImage
            source={getTransactionImage('fail')}
            size="md"
            circle
            style={styles.floatingTransaction}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.floatingTransactionBox}>
      <GlobalImage
        source={getTransactionImage('unknown')}
        size="xxl"
        style={styles.bigImage}
        circle
      />
      {!success && (
        <GlobalImage
          source={getTransactionImage('fail')}
          size="md"
          circle
          style={styles.floatingTransaction}
        />
      )}
    </View>
  );
};

const TransactionDetail = ({
  t,
  transaction,
  explorer,
  goToWallet,
  onCopy,
}) => {
  const { id, type, timestamp, status, fee, inputs, outputs } = transaction;

  const [{ hiddenBalance }] = useContext(AppContext);

  const mapAmount = (sign, { amount, decimals, symbol, name }) => {
    const unit = symbol || name || '';
    if (hiddenBalance) {
      return `${hiddenValue} ${unit}`;
    } else {
      return `${sign} ${formatAmount(amount, decimals)} ${unit}`;
    }
  };

  const outputAmounts = outputs.map(output => mapAmount('-', output));
  const inputAmounts = inputs.map(input => mapAmount('+', input));
  const amounts = outputAmounts.concat(inputAmounts);

  let from;
  if (type === TRANSACTION_TYPE.RECEIVE) {
    from = inputs?.[0]?.source;
  }
  let to;
  if (type === TRANSACTION_TYPE.SEND) {
    to = outputs?.[0]?.destination;
  }

  return (
    <View style={styles.centered}>
      <IconsBanner {...transaction} />
      {amounts.map((amount, i) => (
        <GlobalText type="headline2" key={`amount-${i}`} center>
          {amount}
        </GlobalText>
      ))}
      <View style={styles.inlineWell}>
        <GlobalText type="caption" color="tertiary">
          {t('transactions.date')}
        </GlobalText>
        <GlobalText type="body2">
          {moment.unix(timestamp).format('MMM D, YYYY - h.mm A')}
        </GlobalText>
      </View>
      <View style={styles.inlineWell}>
        <GlobalText type="caption" color="tertiary">
          {t('transactions.type')}
        </GlobalText>
        <GlobalText type="body2">{t(`transactions.${type}`)}</GlobalText>
      </View>
      <View style={styles.inlineWell}>
        <GlobalText type="caption" color="tertiary">
          {t('transactions.id')}
        </GlobalText>
        <TouchableOpacity onPress={() => onCopy(id)}>
          <GlobalText type="body2">
            {getShortAddress(id)}
            <GlobalImage
              source={IconCopy}
              style={styles.addressCopyIcon}
              size="xxs"
            />
          </GlobalText>
        </TouchableOpacity>
      </View>
      <View style={styles.inlineWell}>
        <GlobalText type="caption" color="tertiary">
          {t('transactions.status')}
        </GlobalText>
        <GlobalText
          type="body2"
          color={
            status === TRANSACTION_STATUS.FAILED ? 'negative' : 'positive'
          }>
          {t(`transactions.${status}`)}
        </GlobalText>
      </View>
      {from && (
        <View style={styles.inlineWell}>
          <GlobalText type="caption" color="tertiary">
            {t('transactions.from')}
          </GlobalText>
          <TouchableOpacity onPress={() => onCopy(from)}>
            <GlobalText type="body2">
              {getShortAddress(from)}
              <GlobalImage
                source={IconCopy}
                style={styles.addressCopyIcon}
                size="xxs"
              />
            </GlobalText>
          </TouchableOpacity>
        </View>
      )}
      {to && (
        <View style={styles.inlineWell}>
          <GlobalText type="caption" color="tertiary">
            {t('transactions.to')}
          </GlobalText>
          <TouchableOpacity onPress={() => onCopy(to)}>
            <GlobalText type="body2">
              {getShortAddress(to)}
              <GlobalImage
                source={IconCopy}
                style={styles.addressCopyIcon}
                size="xxs"
              />
            </GlobalText>
          </TouchableOpacity>
        </View>
      )}
      {fee && (
        <View style={styles.inlineWell}>
          <GlobalText type="caption" color="tertiary">
            {t('transactions.fee')}
          </GlobalText>
          <GlobalText type="body2">
            {`${formatAmount(fee.amount, fee.decimals)} ${fee.symbol || ''}`}
          </GlobalText>
        </View>
      )}
      <GlobalPadding size="2xl" />
      <GlobalButton
        type="secondary"
        wideSmall
        title={t(`token.send.goto_explorer`)}
        onPress={() => Linking.openURL(`${explorer.url}/${id}`)}
      />
      <GlobalPadding />
      <GlobalButton
        type="primary"
        wideSmall
        title={t(`transactions.detail_back`)}
        onPress={goToWallet}
      />
      <GlobalPadding size="xl" />
    </View>
  );
};

const TransactionsDetailPage = ({ t, params }) => {
  const navigate = useNavigation();
  const [{ activeBlockchainAccount }] = useContext(AppContext);
  const [transaction, setTransaction] = useState();
  const [loaded, setLoaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { explorer } = useUserConfig();

  useAnalyticsEventTracker(SECTIONS_MAP.TRANSACTIONS_LIST);

  const onBack = useCallback(
    () => navigate(ROUTES_MAP.TRANSACTIONS_LIST),
    [navigate],
  );

  const goToWallet = () => navigate(APP_ROUTES_MAP.WALLET);

  const onCopy = value => {
    clipboard.copy(value);
    setShowToast(true);
  };

  useEffect(() => {
    const load = async () => {
      const { data } = await activeBlockchainAccount.getRecentTransactions({
        pageSize: 8,
      });

      let tx = data.find(({ id }) => id === params.id);
      if (!tx) {
        tx = await activeBlockchainAccount.getTransaction(params.id);
      }
      if (tx) {
        setTransaction(tx);
        setLoaded(true);
      } else {
        onBack();
      }
    };

    load();
  }, [activeBlockchainAccount, onBack, params]);

  return (
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t('transactions.transaction_detail')}
          nospace
        />
        {!loaded && <GlobalSkeleton type="TransactionDetail" />}
        {loaded && (
          <TransactionDetail
            transaction={transaction}
            explorer={explorer}
            goToWallet={goToWallet}
            onCopy={onCopy}
            t={t}
          />
        )}
      </GlobalLayout.Header>
      <GlobalToast
        message={t('wallet.copied')}
        open={showToast}
        setOpen={setShowToast}
      />
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(TransactionsDetailPage));
