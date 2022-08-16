import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';

const ChangeLanguagePage = ({ t }) => {
  const navigate = useNavigation();
  const [{ selectedLanguage, languages }, { changeLanguage }] =
    useContext(AppContext);
  const onSelect = value => {
    changeLanguage(value);
  };
  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t('settings.languages.title')}
        />

        {languages.map(code => (
          <CardButton
            key={code}
            active={code === selectedLanguage}
            complete={code === selectedLanguage}
            title={t(`settings.languages.${code}`)}
            onPress={() => onSelect(code)}
          />
        ))}
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withTranslation()(ChangeLanguagePage);
