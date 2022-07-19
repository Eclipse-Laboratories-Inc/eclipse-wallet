import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';
import { getShortAddress } from '../../utils/wallet';

import theme from '../../component-library/Global/theme';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButtonCard from '../../component-library/Global/GlobalButtonCard';
import GlobalCollapse from '../../component-library/Global/GlobalCollapse';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalSendReceive from '../../component-library/Global/GlobalSendReceive';
import GlobalText from '../../component-library/Global/GlobalText';

import WalletBalanceCard from '../../component-library/Global/GlobalBalance';

const styles = StyleSheet.create({
  container: {
    padding: theme.gutters.paddingMD,
  },
  walletNameAddress: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletName: {
    textAlign: 'right',
    marginRight: theme.gutters.paddingXXS,
    lineHeight: theme.fontSize.fontSizeNormal + 2,
  },
  walletAddress: {
    lineHeight: theme.fontSize.fontSizeNormal + 4,
  },
  cardBox: {
    paddingVertical: theme.gutters.paddingSM,
    paddingHorizontal: theme.gutters.paddingSM,
    borderRadius: theme.borderRadius.borderRadiusMD,
    backgroundColor: theme.colors.cards,
  },
});

const TokenDetailPage = ({ params }) => {
  const navigate = useNavigation();

  const [totalBalance, setTotalBalance] = useState({});

  const [] = useContext(AppContext);

  const goToBack = () => {
    navigate(ROUTES_MAP.WALLET);
  };

  return (
    <GlobalLayoutForTabScreen>
      <GlobalBackTitle onBack={goToBack}>
        <View style={styles.walletNameAddress}>
          <GlobalText type="body2" style={styles.walletName}>
            Token Name
          </GlobalText>

          <GlobalText
            type="body1"
            color="tertiary"
            style={styles.walletAddress}>
            ({getShortAddress(params.tokenId)})
          </GlobalText>
        </View>
      </GlobalBackTitle>
      <WalletBalanceCard
        balance={totalBalance}
        neutralTotal="$8.000"
        positiveTotal="$11.10"
        messages={[]}
        actions={
          <GlobalSendReceive goToSend={() => {}} goToReceive={() => {}} />
        }
      />
      <GlobalPadding size="lg" />
      <View style={styles.cardBox}>
        <GlobalCollapse title="Chart Data Range" narrowTitle isOpen={false}>
          <GlobalPadding />
          <GlobalText type="body2">[CHART GOES HERE]</GlobalText>
          <GlobalPadding />
        </GlobalCollapse>
      </View>

      <GlobalPadding size="lg" />

      <GlobalCollapse
        title="Recent Activity"
        viewAllAction={() => {}}
        hideCollapse
        isOpen>
        <GlobalButtonCard
          transaction="sent"
          description={`To: ${getShortAddress(
            'AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S',
          )}`}
          actions={[
            <GlobalText key={'amount-action'} type="body2" color="positive">
              +1 SOL
            </GlobalText>,
            <GlobalText key={'perc-action'} type="caption" color="secondary">
              +0000%
            </GlobalText>,
          ].filter(Boolean)}
          onPress={() => {}}
        />

        <GlobalButtonCard
          transaction="received"
          description={`To: ${getShortAddress(
            'AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S',
          )}`}
          actions={[
            <GlobalText key={'amount-action'} type="body2" color="positive">
              +1 SOL
            </GlobalText>,
            <GlobalText key={'perc-action'} type="caption" color="secondary">
              +0000%
            </GlobalText>,
          ].filter(Boolean)}
          onPress={() => {}}
        />

        <GlobalButtonCard
          transaction="swap"
          description={`To: ${getShortAddress(
            'AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S',
          )}`}
          actions={[
            <GlobalText key={'amount-action'} type="body2" color="positive">
              +1 SOL
            </GlobalText>,
            <GlobalText key={'perc-action'} type="caption" color="secondary">
              +0000%
            </GlobalText>,
          ].filter(Boolean)}
          onPress={() => {}}
        />

        <GlobalButtonCard
          transaction="interaction"
          description={`To: ${getShortAddress(
            'AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S',
          )}`}
          actions={[
            <GlobalText key={'amount-action'} type="body2" color="positive">
              +1 SOL
            </GlobalText>,
            <GlobalText key={'perc-action'} type="caption" color="secondary">
              +0000%
            </GlobalText>,
          ].filter(Boolean)}
          onPress={() => {}}
        />

        <GlobalButtonCard
          transaction="paid"
          description={`To: ${getShortAddress(
            'AXNAwy7iq6bTthgtojjuUVqA279KhUmppdAbzYSfH18S',
          )}`}
          actions={[
            <GlobalText key={'amount-action'} type="body2" color="positive">
              +1 SOL
            </GlobalText>,
            <GlobalText key={'perc-action'} type="caption" color="secondary">
              +0000%
            </GlobalText>,
          ].filter(Boolean)}
          onPress={() => {}}
        />
      </GlobalCollapse>
    </GlobalLayoutForTabScreen>
  );
};

export default withParams(TokenDetailPage);