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
  accountsView: {
    height: 600,
  },
});

const SPACE_CHAR = '\u00A0';

const formatTitle = (index, publicKey) => {
  let title = index;
  const numberOfSpaces = 4;

  for (let i = 0; i < numberOfSpaces; i++) {
    title += SPACE_CHAR;
  }

  const visiblePart = 8;

  return `${title}${publicKey.substring(
    0,
    visiblePart,
  )} ... ${publicKey.substring(publicKey.length - visiblePart)}`;
};

const ChooseDerivable = ({ accounts, balances, onComplete, goToWallet, t }) => {
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
          nospace
        />
      </View>
      <GlobalLayout style={styles.accountsView}>
        <GlobalLayout.Header>
          {accounts.map(({ index, publicKey }) => (
            <CardButton
              key={`wallet-${index}`}
              active={selected.includes(index)}
              title={
                <GlobalText type="body1">
                  {formatTitle(index, publicKey.toString())}
                </GlobalText>
              }
              actions={
                <GlobalText type="body2">
                  {balances[publicKey.toString()]?.amount ?? 0} SOL
                </GlobalText>
              }
              onPress={() => updateSelected(index, !selected.includes(index))}
              icon={<AvatarImage url={LOGOS[getDefaultChain()]} size={48} />}
            />
          ))}
        </GlobalLayout.Header>
        <View>
          <GlobalButton
            type="accent"
            wide
            title={t('wallet.create.recover')}
            onPress={() => onComplete(selected)}
          />
          <GlobalPadding size="xs" />
          <GlobalButton
            type="primary"
            wide
            title={t('wallet.create.skip')}
            onPress={goToWallet}
          />
        </View>
      </GlobalLayout>
    </GlobalBackgroundImage>
  );
};

export default withTranslation()(ChooseDerivable);
