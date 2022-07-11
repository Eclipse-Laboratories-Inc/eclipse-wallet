import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '../../component-library/Global/theme';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

import TextInput from '../../component-library/Input/TextInput';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 168,
    paddingBottom: theme.gutters.padding4XL,
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  footerActions: {
    alignItems: 'center',
  },
  tabsContainer: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inner: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.gutters.paddingNormal,
    paddingBottom: theme.gutters.padding2XL,
  },
  inputWrapper: {
    width: '90%',
  },
});

const LockedPage = () => {
  const [pass, setPass] = useState('');

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.inner}>
          <GlobalText type="headline2">
            2 lines max Enter Your Password
          </GlobalText>

          <GlobalPadding size="md" />

          <View style={styles.inputWrapper}>
            <TextInput
              label="Enter Your Password"
              value={pass}
              setValue={setPass}
            />
          </View>
        </View>
      </View>
      <View style={styles.footerActions}>
        <GlobalButton
          type="primary"
          wide
          title="Unlock"
          onPress={() => {}}
          disabled={!pass}
        />
      </View>
    </View>
  );
};

export default LockedPage;
