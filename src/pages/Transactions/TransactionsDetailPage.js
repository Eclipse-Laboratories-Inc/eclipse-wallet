import React, { useContext } from 'react';
import { View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { ROUTES_MAP } from './routes';
import { useNavigation } from '../../routes/hooks';
import {
  LOGOS,
  getShortAddress,
  getTransactionImage,
} from '../../utils/wallet';
import { getMediaRemoteUrl } from '../../utils/media';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';

const TransactionsDetailPage = () => {
  const navigate = useNavigation();

  const [{ activeWallet, wallets }, { changeActiveWallet }] =
    useContext(AppContext);

  const onBack = () => navigate(ROUTES_MAP.TRANSACTIONS_LIST);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} secondaryTitle="Transaction Detail" />

        <View style={globalStyles.centered}>
          <View style={globalStyles.floatingTransactionBox}>
            <GlobalImage
              source={getMediaRemoteUrl(LOGOS['SOLANA'])}
              size="xxl"
              style={globalStyles.bigImage}
              circle
            />
            <GlobalImage
              source={getTransactionImage('sent')}
              size="md"
              circle
              style={globalStyles.floatingTransaction}
            />
          </View>

          <GlobalText type="headline1" center>
            -0.07 SOL
          </GlobalText>

          <GlobalPadding size="sm" />

          <View style={globalStyles.inlineWell}>
            <GlobalText type="caption" color="tertiary">
              Date
            </GlobalText>

            <GlobalText type="body2">Sep 21, 2022 - 10.17 PM</GlobalText>
          </View>

          <View style={globalStyles.inlineWell}>
            <GlobalText type="caption" color="tertiary">
              Status
            </GlobalText>

            <GlobalText type="body2" color="positive">
              Confirm
            </GlobalText>
          </View>

          <View style={globalStyles.inlineWell}>
            <GlobalText type="caption" color="tertiary">
              To
            </GlobalText>

            <GlobalText type="body2" numberOfLines={1}>
              {getShortAddress('8Nb3tg9H55svmywG4NvsHVtw7GpZWdA2Wi6TbXbgTtzi')}
            </GlobalText>
          </View>
        </View>
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
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
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default TransactionsDetailPage;
