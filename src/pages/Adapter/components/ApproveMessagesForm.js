import React from 'react';
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
import { withTranslation } from '../../../hooks/useTranslations';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    width: '100%',
  },
  card: {
    paddingBottom: theme.gutters.paddingXXS,
    width: '100%',
  },
});

const ApproveMessagesForm = ({
  t,
  messages = [],
  origin,
  name,
  icon,
  onApprove,
  onReject,
}) => (
  <GlobalLayout fullscreen>
    <GlobalLayout.Header>
      <ActiveWalletCard />
      <GlobalBackTitle title={t('adapter.detail.message.title')} nospace />
      <GlobalPadding size="xl" />
      <DAppCard name={name} icon={icon} origin={origin} />
    </GlobalLayout.Header>
    <GlobalLayout.Inner>
      <View style={styles.container}>
        <GlobalText type="body1" color="secondary">
          {`${t(messages.length > 1 ? 'Messages' : 'Message')}:`}
        </GlobalText>
        <ScrollView style={styles.card}>
          {messages.map((message, i) => (
            <BasicCard key={`msg-${i}`}>
              <GlobalText type="body1" color="primary" italic>
                {message}
              </GlobalText>
            </BasicCard>
          ))}
        </ScrollView>
      </View>
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
          onPress={onApprove}
          style={[globalStyles.button, globalStyles.buttonRight]}
          touchableStyles={globalStyles.buttonTouchable}
        />
      </View>
    </GlobalLayout.Footer>
  </GlobalLayout>
);

export default withTranslation()(ApproveMessagesForm);
