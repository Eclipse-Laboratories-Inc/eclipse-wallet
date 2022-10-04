import React, { useContext, useState } from 'react';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalInput from '../../component-library/Global/GlobalInput';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import { AppContext } from '../../AppProvider';
import { getWalletName } from '../../utils/wallet';

const AddressBookEditPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [{ config }, { editWalletName }] = useContext(AppContext);
  const [accountName, setAccountName] = useState(
    getWalletName(params.address, config),
  );
  const [saving, setSaving] = useState(false);
  const onBack = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT, {
      address: params.address,
    });

  const onSave = async () => {
    setSaving(true);
    await editWalletName(params.address, accountName);
    setSaving(false);
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT, {
      address: params.address,
    });
  };
  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.wallets.edit_name`)}
        />

        <GlobalPadding size="md" />

        <GlobalInput
          placeholder={t('general.name')}
          value={accountName}
          setValue={setAccountName}
          invalid={!accountName}
          autoComplete="off"
          autoFocus={true}
        />
        <GlobalPadding siz="sm" />
        <GlobalText type="caption" center>
          {t(`settings.wallets.edit_name_disclaimer`)}
        </GlobalText>
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wideSmall
          title={t('actions.save')}
          onPress={onSave}
          disabled={!accountName || saving}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(AddressBookEditPage));
