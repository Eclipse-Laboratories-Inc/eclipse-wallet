import React, { useContext, useState } from 'react';

import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

import { AppContext } from '../../AppProvider';
import GlobalLayout from '../../component-library/Global/GlobalLayout';

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
      <GlobalLayout.Header>
        <GlobalPadding size="4xl" />
      </GlobalLayout.Header>

      <GlobalLayout.Inner>
        <GlobalText type="headline2" center>
          Enter Your Password
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
      </GlobalLayout.Inner>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wide
          title="Unlock"
          onPress={unlock}
          disabled={!pass || unlocking}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default LockedPage;
