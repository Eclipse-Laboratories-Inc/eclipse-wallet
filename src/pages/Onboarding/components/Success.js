import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import theme from '../../../component-library/Global/theme';
import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import SimpleDialog from '../../../component-library/Dialog/SimpleDialog';

import Logo from '../components/Logo';

const styles = StyleSheet.create({
  bigIcon: {
    width: 120,
    height: 120,
  },
  infoLink: {
    fontFamily: theme.fonts.dmSansRegular,
    fontSize: theme.fontSize.fontSizeSM,
    color: theme.colors.labelSecondary,
    fontWeight: 'normal',
    textTransform: 'none',
  },
});

const Success = ({ goToWallet, goToAdapter, goToDerived, t }) => {
  const [showDialog, setShowDialog] = useState(false);
  const toggleDialog = () => {
    setShowDialog(!showDialog);
  };

  return (
    <>
      <GlobalLayout.Header>
        <GlobalPadding size="md" />
      </GlobalLayout.Header>

      <GlobalLayout.Inner>
        <GlobalPadding size="md" />

        <Logo />

        <GlobalPadding size="xl" />

        <GlobalText type="headline2" center>
          {t('wallet.create.success_message')}
        </GlobalText>

        <GlobalText type="body1" center>
          {t('wallet.create.success_message_body')}
        </GlobalText>
      </GlobalLayout.Inner>

      <GlobalLayout.Footer>
        {goToWallet && (
          <GlobalButton
            type="primary"
            wide
            title={t('wallet.create.go_to_my_wallet')}
            onPress={goToWallet}
          />
        )}

        {goToAdapter && (
          <GlobalButton
            type="primary"
            wide
            title={t('actions.continue')}
            onPress={goToAdapter}
          />
        )}

        <GlobalPadding size="md" />

        <GlobalButton
          type="secondary"
          wide
          title={t(`wallet.create.select_derivable`)}
          onPress={goToDerived}
        />
        <GlobalButton
          type="text"
          wide
          textStyle={styles.infoLink}
          title={t(`wallet.create.derivable_info_icon`)}
          onPress={toggleDialog}
        />
        <SimpleDialog
          title={
            <GlobalText center type="headline3" numberOfLines={1}>
              {t(`wallet.create.derivable_info`)}
            </GlobalText>
          }
          onClose={toggleDialog}
          isOpen={showDialog}
          text={
            <GlobalText center type="subtitle1">
              {t(`wallet.create.derivable_description`)}
            </GlobalText>
          }
        />
      </GlobalLayout.Footer>
    </>
  );
};

export default Success;
