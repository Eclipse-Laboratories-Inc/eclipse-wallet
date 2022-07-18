import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '../../component-library/Global/theme';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

import TextInput from '../../component-library/Input/TextInput';
import { AppContext } from '../../AppProvider';
import GlobalLayout from '../../component-library/Global/GlobalLayout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: theme.gutters.paddingSM,
    paddingVertical: 40,
    width: '100%',
    maxWidth: theme.variables.mobileWidthLG,
    minHeight: '100%',
  },
  wrapper: {
    flex: 1,
    paddingTop: 168,
    paddingBottom: theme.gutters.padding4XL,
    alignItems: 'center',
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
  const [, { unlockWallets }] = useContext(AppContext);
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const unlock = async () => {
    setError(false);
    setUnlocking(true);
    const result = await unlockWallets(pass);
    if (!result) {
      setError(true);
      setUnlocking(false);
    }
  };
  return (
    <GlobalLayout>
      <View style={styles.container}>
        <View style={styles.headerActions}>
          <GlobalPadding size="4xl" />
        </View>

        <View style={styles.inner}>
          <GlobalText type="headline2" center>
            2 lines max Enter Your Password
          </GlobalText>

          <GlobalPadding size="md" />

          <GlobalInput
            placeholder="Enter Your Password"
            value={pass}
            setValue={setPass}
            secureTextEntry
            autocomplete={false}
          />
          {error && (
            <GlobalText type="body1" color="negative">
              password error
            </GlobalText>
          )}
        </View>

        <View style={styles.footerActions}>
          <GlobalButton
            type="primary"
            wide
            title="Unlock"
            onPress={unlock}
            disabled={!pass || unlocking}
          />
        </View>
      </View>
    </GlobalLayout>
  );
};

export default LockedPage;
