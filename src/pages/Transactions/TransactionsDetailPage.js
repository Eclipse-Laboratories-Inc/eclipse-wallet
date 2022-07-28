import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import {
  LOGOS,
  getShortAddress,
  getTransactionImage,
} from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';

import theme from '../../component-library/Global/theme';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingTransactionBox: {
    marginVertical: theme.gutters.paddingXL,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  floatingTransaction: {
    position: 'absolute',
    right: -10,
    bottom: -10,
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

const TransactionsDetailPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet, wallets }, { changeActiveWallet }] =
    useContext(AppContext);
  const onBack = () => navigate(ROUTES_MAP.TRANSACTIONS_LIST);

  return (
    <GlobalLayoutForTabScreen>
      <GlobalBackTitle onBack={onBack} smallTitle="Transaction Detail" />

      <View style={styles.centered}>
        <View style={styles.floatingTransactionBox}>
          <GlobalImage
            source={getMediaRemoteUrl(LOGOS['SOLANA'])}
            size="xxl"
            style={styles.bigImage}
            circle
          />
          <GlobalImage
            source={getTransactionImage('sent')}
            size="md"
            circle
            style={styles.floatingTransaction}
          />
        </View>

        <GlobalText type="headline1" center>
          -0.07 SOL
        </GlobalText>

        <GlobalPadding size="sm" />

        <View style={styles.inlineWell}>
          <GlobalText type="caption" color="tertiary">
            Date
          </GlobalText>

          <GlobalText type="body2">Sep 21, 2022 - 10.17 PM</GlobalText>
        </View>

        <View style={styles.inlineWell}>
          <GlobalText type="caption" color="tertiary">
            Status
          </GlobalText>

          <GlobalText type="body2" color="positive">
            Confirm
          </GlobalText>
        </View>

        <View style={styles.inlineWell}>
          <GlobalText type="caption" color="tertiary">
            To
          </GlobalText>

          <GlobalText type="body2" numberOfLines={1}>
            {getShortAddress('8Nb3tg9H55svmywG4NvsHVtw7GpZWdA2Wi6TbXbgTtzi')}
          </GlobalText>
        </View>

        <GlobalPadding size="2xl" />

        <GlobalButton
          type="secondary"
          wideSmall
          title="GO TO SOLSCAN"
          onPress={() => {}}
        />

        <GlobalPadding />

        <GlobalButton
          type="primary"
          wideSmall
          title="Back to Wallet"
          onPress={onBack}
        />

        <GlobalPadding size="xl" />
      </View>
    </GlobalLayoutForTabScreen>
  );
};

export default TransactionsDetailPage;
