import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../../AppProvider';

import theme from '../../component-library/Global/theme';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import SimpleDialog from '../../component-library/Dialog/SimpleDialog';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import { withTranslation } from '../../hooks/useTranslations';
import Logo from '../Onboarding/components/Logo';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP, EVENTS_MAP } from '../../utils/tracking';

const LockedPage = ({ t }) => {
  const navigate = useNavigate();
  const [, { unlockWallets, logout }] = useContext(AppContext);
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const ONBOARDING_ROUTE = '/onboarding';

  const { trackEvent } = useAnalyticsEventTracker(SECTIONS_MAP.UNLOCK_WALLET);

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
  const handleLogout = () => {
    logout();
    trackEvent(EVENTS_MAP.PASSWORD_FORGOT);
    navigate(ONBOARDING_ROUTE);
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
          autoFocus={true}
          onEnter={unlock}
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

        <GlobalPadding size="lg" />
        <GlobalButton
          type="text"
          textStyle={{
            fontFamily: theme.fonts.dmSansMedium,
            textTransform: 'none',
          }}
          size="medium"
          title={t('lock.forgot')}
          onPress={() => setShowDialog(true)}
        />
        <SimpleDialog
          title={
            <GlobalText center type="headline3" numberOfLines={1}>
              {t('lock.forgotten')}
            </GlobalText>
          }
          type="danger"
          btn1Title={t('lock.clear_confirm')}
          btn2Title={t('actions.cancel')}
          onClose={() => setShowDialog(false)}
          isOpen={showDialog}
          action={handleLogout}
          text={
            <GlobalText
              center
              onPress={handleLogout}
              type="subtitle1"
              numberOfLines={12}>
              {t('lock.forgot_content')}
            </GlobalText>
          }
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(LockedPage);
