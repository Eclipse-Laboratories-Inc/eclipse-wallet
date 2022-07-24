import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { GlobalLayoutForTabScreen } from '../../component-library/Global/GlobalLayout';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';

const ChangeLanguagePage = ({ t }) => {
  const navigate = useNavigation();
  const [{ selectedLanguage, languages }, { changeLanguage }] =
    useContext(AppContext);
  const onSelect = value => {
    changeLanguage(value);
  };
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);

  return (
    <GlobalLayoutForTabScreen>
      <GlobalBackTitle onBack={onBack} title={t('settings.languages.title')} />

      <GlobalPadding />

      {languages.map(code => (
        <CardButton
          key={code}
          active={code === selectedLanguage}
          complete={code === selectedLanguage}
          title={t(`settings.languages.${code}`)}
          onPress={() => onSelect(code)}
        />
      ))}
    </GlobalLayoutForTabScreen>
  );
};

export default withTranslation()(ChangeLanguagePage);
