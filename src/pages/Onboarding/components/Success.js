import React from 'react';

import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import IconInteractionGreen from '../../../assets/images/IconInteractionGreen.png';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  bigIcon: {
    width: 120,
    height: 120,
  },
});

const Success = ({ goToWallet, goToDerived }) => (
  <>
    <GlobalLayout.Header>
      <GlobalPadding size="md" />
    </GlobalLayout.Header>

    <GlobalLayout.Inner>
      <GlobalPadding size="md" />

      <GlobalImage source={IconInteractionGreen} style={styles.bigIcon} />

      <GlobalPadding size="xl" />

      <GlobalText type="headline2" center>
        Success Message
      </GlobalText>

      <GlobalText type="body1" center>
        3 lines max Excepteur sint occaecat cupidatat non proident, sunt ?
      </GlobalText>
    </GlobalLayout.Inner>

    <GlobalLayout.Footer>
      <GlobalButton
        type="primary"
        wide
        title="Go to my Wallet"
        onPress={goToWallet}
      />

      <GlobalPadding size="md" />

      <GlobalButton
        type="secondary"
        wide
        title="Select Derivable"
        onPress={goToDerived}
      />
    </GlobalLayout.Footer>
  </>
);

export default Success;
