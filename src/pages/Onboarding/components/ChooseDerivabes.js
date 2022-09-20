import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { withTranslation } from '../../../hooks/useTranslations';
import { getDefaultChain, LOGOS } from '../../../utils/wallet';

import theme from '../../../component-library/Global/theme';
import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import CardButton from '../../../component-library/CardButton/CardButton';
import GlobalBackgroundImage from '../../../component-library/Global/GlobalBackgroundImage';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';

import AvatarImage from '../../../component-library/Image/AvatarImage';

const styles = StyleSheet.create({
  titleStyle: {
    marginTop: theme.gutters.paddingNormal,
    marginLeft: theme.gutters.paddingSM,
    marginRight: theme.gutters.paddingSM,
  },
  recoverBtnContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
  },
});

const ChooseDerivabes = ({ accounts, onComplete, goToWallet, t }) => {
  const [selected, setSelected] = useState([]);
  const updateSelected = (index, status) => {
    if (status) {
      setSelected([...selected, index]);
    } else {
      setSelected([...selected.filter(s => s !== index)]);
    }
  };
  return (
    <GlobalBackgroundImage>
      <View style={styles.titleStyle}>
        <GlobalBackTitle
          title={t('wallet.create.derivable_accounts')}
          tertiaryTitle="m/44'/501'/0'"
        />
      </View>
      <GlobalLayout>
        <GlobalLayout.Header>
          {accounts.map(({ index }) => (
            <CardButton
              key={`wallet-${index}`}
              active={selected.includes(index)}
              title="Public Key"
              description="0.0000.00"
              actions={<GlobalText type="body2">$0.000.000</GlobalText>}
              onPress={() => updateSelected(index, !selected.includes(index))}
              icon={<AvatarImage url={LOGOS[getDefaultChain()]} size={48} />}
            />
          ))}
        </GlobalLayout.Header>
      </GlobalLayout>
      <View style={styles.recoverBtnContainer}>
        <GlobalButton
          type="accent"
          wide
          title={t('wallet.create.recover')}
          onPress={() => onComplete(selected)}
        />
        <GlobalPadding size="sm" />
        <GlobalButton
          type="primary"
          wide
          title={t('wallet.create.skip')}
          onPress={goToWallet}
        />
      </View>
    </GlobalBackgroundImage>
  );
};

export default withTranslation()(ChooseDerivabes);
