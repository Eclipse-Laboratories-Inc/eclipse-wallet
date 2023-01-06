import React from 'react';
import CardButton from '../../../component-library/CardButton/CardButton';
import { StyleSheet, View } from 'react-native';
import { LOGOS } from '../../../utils/wallet';
import theme from '../../../component-library/Global/theme';
import AvatarImage from '../../../component-library/Image/AvatarImage';

const styles = StyleSheet.create({
  touchable: {
    maxWidth: theme.variables.buttonMaxWidth,
  },
  disabledAvatar: {
    backgroundColor: '#999',
    opacity: 0.5,
    borderRadius: 50,
  },
});

const COMING_SOON = 'coming soon';

export const ChainCard = ({ enabled, chain, onNext, onComingSoon }) => {
  let card;

  if (enabled) {
    card = (
      <CardButton
        key={chain}
        onPress={() => onNext(chain)}
        icon={<AvatarImage url={LOGOS[chain]} size={48} />}
        title={chain}
        touchableStyles={styles.touchable}
      />
    );
  } else {
    card = (
      <CardButton
        key={chain}
        onPress={() => onComingSoon(chain)}
        icon={
          <View style={styles.disabledAvatar}>
            <AvatarImage url={LOGOS[chain]} size={48} />
          </View>
        }
        title={chain}
        description={COMING_SOON}
        touchableStyles={styles.touchable}
      />
    );
  }

  return card;
};
