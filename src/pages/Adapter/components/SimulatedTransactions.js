import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import BasicCard from '../../../component-library/Card/BasicCard';
import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalText from '../../../component-library/Global/GlobalText';
import theme, { globalStyles } from '../../../component-library/Global/theme';

import { ActiveWalletCard } from './ActiveWalletCard';
import { DAppCard } from './DAppCard';
import VerifiedByBlowfish from './VerifiedByBlowfish';
import { withTranslation } from '../../../hooks/useTranslations';
import GlobalAlert from '../../../component-library/Global/GlobalAlert';

const styles = StyleSheet.create({
  detail: {
    width: '100%',
  },
  cardContainer: {
    marginTop: theme.gutters.paddingMD,
  },
  cardContent: {
    padding: theme.gutters.paddingXS,
  },
  fee: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const Warning = ({ severity, kind, message }) => (
  <>
    <GlobalAlert
      text={message}
      type={severity === 'CRITICAL' ? 'error' : 'warning'}
    />
    <GlobalPadding size="sm" />
  </>
);

const formatNumber = (digits, decimals) => {
  if (decimals < 0) {
    return `${digits}`.padEnd(-decimals, '0');
  }
  if (decimals > 0) {
    const s = `${digits}`.padStart(decimals + 1, '0');
    const i = s.length - decimals;
    return (s.substring(0, i) + '.' + s.substring(i)).replace(/\.{0,1}0+$/, '');
  }
  return `${digits}`;
};

const StateChange = ({
  humanReadableDiff,
  suggestedColor,
  rawInfo: { kind, data },
}) => {
  const value = useMemo(() => {
    let text = '';
    const digits = data?.diff?.digits;
    if (digits) {
      const sign = data?.diff?.sign;
      if (sign === 'MINUS') {
        text += '-';
      }
      if (sign === 'PLUS') {
        text += '+';
      }
      const decimals = data?.decimals || 0;
      text += formatNumber(digits, decimals);
      const symbol = data?.symbol;
      if (symbol) {
        text += ` ${symbol}`;
      }
    }
    return text;
  }, [data]);

  return (
    <BasicCard style={styles.cardContainer} contentStyle={styles.cardContent}>
      <View>
        <GlobalText
          type="subtitle1"
          nospace
          {...(data?.diff?.sign === 'PLUS' ? { color: 'positive' } : {})}
          {...(data?.diff?.sign === 'MINUS' ? { color: 'negativeLight' } : {})}>
          {value}
        </GlobalText>
        <GlobalText type="caption" nospace color="primary">
          {humanReadableDiff}
        </GlobalText>
      </View>
    </BasicCard>
  );
};

const SimulatedTransactions = ({
  t,
  simulation,
  fee,
  origin,
  name,
  icon,
  onApprove,
  onReject,
}) => (
  <GlobalLayout fullscreen>
    <GlobalLayout.Header>
      <ActiveWalletCard />
      <GlobalBackTitle title={t('adapter.detail.transaction.title')} nospace />
      <GlobalPadding size="xl" />
      <DAppCard name={name} icon={icon} origin={origin} />
    </GlobalLayout.Header>
    <GlobalLayout.Inner>
      <ScrollView style={styles.detail}>
        <GlobalPadding size="sm" />
        {simulation.warnings?.map((warning, i) => (
          <Warning key={`warn-${i}`} {...warning} />
        ))}
        <GlobalPadding size="sm" />
        <GlobalText type="caption" uppercase>
          {t('adapter.detail.transaction.detail')}:
        </GlobalText>
        {simulation.simulationResults.expectedStateChanges.map((change, i) => (
          <StateChange key={`change-${i}`} {...change} />
        ))}
        <BasicCard
          style={styles.cardContainer}
          contentStyle={styles.cardContent}>
          <View style={styles.fee}>
            <GlobalText type="caption" color="secondary">
              {t('adapter.detail.transaction.fee')}
            </GlobalText>
            <GlobalText>
              {fee != null ? `${formatNumber(fee, 9)} SOL` : '?'}
            </GlobalText>
          </View>
        </BasicCard>
      </ScrollView>
      <GlobalPadding size="lg" />
      <VerifiedByBlowfish />
    </GlobalLayout.Inner>
    <GlobalLayout.Footer>
      <View style={globalStyles.inlineFlexButtons}>
        <GlobalButton
          type="secondary"
          flex
          title={t('actions.cancel')}
          onPress={onReject}
          style={[globalStyles.button, globalStyles.buttonLeft]}
          touchableStyles={globalStyles.buttonTouchable}
        />
        <GlobalButton
          type="primary"
          flex
          title={t('actions.confirm')}
          onPress={() => onApprove()}
          style={[globalStyles.button, globalStyles.buttonRight]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      </View>
    </GlobalLayout.Footer>
  </GlobalLayout>
);

export default withTranslation()(SimulatedTransactions);
