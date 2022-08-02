import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { ROUTES_MAP as ROUTES_SETTINGS_MAP } from './routes';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import QRImage from '../../features/QRImage';
import IconCopy from '../../assets/images/IconCopy.png';
import { getShortAddress, getWalletName } from '../../utils/wallet';
import clipboard from '../../utils/clipboard';
import { AppContext } from '../../AppProvider';

const styles = StyleSheet.create({
  qrBox: {
    padding: theme.gutters.paddingMD,
    backgroundColor: theme.staticColor.alwaysWhite,
    borderRadius: theme.borderRadius.borderRadiusNormal,
  },
});

const name = 'Name.acr';

const AccountEditAddressPage = ({ params, t }) => {
  const navigate = useNavigation();
  const [{ config }] = useContext(AppContext);
  const onBack = () =>
    navigate(ROUTES_SETTINGS_MAP.SETTINGS_ACCOUNT_EDIT, {
      address: params.address,
    });
  const onCopyAlias = () => clipboard.copy(name);
  const onCopyAddress = () => clipboard.copy(params.address);

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle
          onBack={onBack}
          title={t(`settings.wallets.edit_wallet`)}
        />

        <GlobalPadding size="md" />

        <View style={globalStyles.centered}>
          <View style={styles.qrBox}>
            <QRImage address={params.address} size={225} />
          </View>

          <GlobalPadding size="2xl" />

          <View style={globalStyles.inlineWell}>
            <GlobalText type="body2">{name}</GlobalText>

            <GlobalButton onPress={onCopyAlias} size="medium">
              <GlobalImage source={IconCopy} size="xs" />
              <GlobalText type="button">Copy</GlobalText>
            </GlobalButton>
          </View>

          <View style={globalStyles.inlineWell}>
            <GlobalText type="body2">
              {getWalletName(params.address, config)} (
              {getShortAddress(params.address)})
            </GlobalText>

            <GlobalButton onPress={onCopyAddress} size="medium">
              <GlobalImage source={IconCopy} size="xs" />
              <GlobalText type="button">Copy</GlobalText>
            </GlobalButton>
          </View>

          <GlobalPadding size="md" />

          <GlobalText type="body1" center>
            2 lines max Validation text sint occaecat cupidatat non proident
          </GlobalText>
        </View>
      </GlobalLayout.Header>
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(AccountEditAddressPage));
