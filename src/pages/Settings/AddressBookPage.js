import React, { useContext } from 'react';

import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';

import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import CardButtonWallet from '../../component-library/CardButton/CardButtonWallet';
import GlobalText from '../../component-library/Global/GlobalText';

const AddressBookPage = ({ t }) => {
  const navigate = useNavigation();

  const [{ addressBook }] = useContext(AppContext);

  const onBack = () => navigate(ROUTES_MAP.SETTINGS_OPTIONS);

  const goToAddNewAddressBook = () =>
    navigate(ROUTES_MAP.SETTINGS_ADDRESSBOOK_ADD);

  const onEditAddressBook = ({ address }) =>
    navigate(ROUTES_MAP.SETTINGS_ADDRESSBOOK_EDIT, { address });

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle onBack={onBack} title={t('settings.address_book')} />

        {addressBook.length === 0 && (
          <GlobalText center type="body1">
            {t(`settings.addressbook.empty`)}
          </GlobalText>
        )}

        {addressBook.map(addressBookItem => (
          <CardButtonWallet
            key={addressBookItem.address}
            title={addressBookItem.name}
            subtitle={
              addressBookItem.domain
                ? `domain: ${addressBookItem.domain}`
                : null
            }
            address={addressBookItem.address}
            chain={addressBookItem.chain}
            imageSize="md"
            onPress={() => onEditAddressBook(addressBookItem)}
          />
        ))}
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wideSmall
          title={t('settings.addressbook.addnew')}
          onPress={goToAddNewAddressBook}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(AddressBookPage);
