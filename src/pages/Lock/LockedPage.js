import React, { useContext, useState } from 'react';

import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalPadding from '../../component-library/Global/GlobalPadding';

import { AppContext } from '../../AppProvider';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import { withTranslation } from '../../hooks/useTranslations';
import Logo from '../Onboarding/components/Logo';

const LockedPage = ({ t }) => {
  const [, { unlockWallets }] = useContext(AppContext);
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const onChange = v => {
    setError(false);
    setPass(v);
  };
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
    <GlobalLayout fullscreen>
      <GlobalLayout.Header>
        <GlobalPadding size="4xl" />
      </GlobalLayout.Header>

      <GlobalLayout.Inner>
        <Logo />
        <GlobalPadding size="2xl" />
        <GlobalText type="headline2" center>
          {t('lock.title')}
        </GlobalText>

        <GlobalPadding size="md" />

        <GlobalInput
          placeholder={t('lock.placeholder')}
          value={pass}
          setValue={onChange}
          secureTextEntry
          autocomplete={false}
          invalid={error}
        />
        {error && (
          <GlobalText type="body1" color="negative">
            {t('lock.error')}
          </GlobalText>
        )}
      </GlobalLayout.Inner>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wide
          title={unlocking ? t('lock.buttonChecking') : t('lock.buttonUnlock')}
          onPress={unlock}
          disabled={!pass || unlocking}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(LockedPage);
