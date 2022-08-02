import React, { useContext, useState } from 'react';
import { View } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { getWalletName } from '../../utils/wallet';

import { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalInputWithTokenSelector from '../../component-library/Global/GlobalInputWithTokenSelector';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';

import IconSwapAccent1 from '../../assets/images/IconSwapAccent1.png';

const DetailItem = ({ title, value, t }) => (
  <View style={globalStyles.inlineWell}>
    <GlobalText type="caption" color="tertiary">
      {title}
    </GlobalText>

    <GlobalText type="body2">{value}</GlobalText>
  </View>
);

const BigDetailItem = ({ title, value, t }) => (
  <View
    style={[
      globalStyles.inlineWell,
      { flexDirection: 'column', alignItems: 'flex-start' },
    ]}>
    <GlobalText type="body1" color="secondary">
      {title}
    </GlobalText>

    <GlobalText type="headline2" nospace>
      {value}
    </GlobalText>
  </View>
);

const SwapPage = ({ t }) => {
  const navigate = useNavigation();

  const [{ activeWallet, config }] = useContext(AppContext);

  const [youPayAmount, setYouPayAmount] = useState('');
  const [youReceiveAmount, setYouReceiveAmount] = useState('');

  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };

  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <GlobalBackTitle title={t('swap.swap_tokens')} />

        <GlobalPadding />

        <View style={globalStyles.inlineFlexButtons}>
          <GlobalText type="body2">{t('swap.you_send')}</GlobalText>
          <GlobalText type="body1">Max. 888888 USDC</GlobalText>
        </View>

        <GlobalPadding size="xs" />

        <GlobalInputWithTokenSelector
          value={youPayAmount}
          setValue={setYouPayAmount}
          title="USDC"
        />

        <GlobalPadding size="xs" />

        <GlobalText type="body1" color="tertiary">
          88 {t('general.usd')}
        </GlobalText>

        <GlobalPadding size="xs" />

        <View style={globalStyles.centered}>
          <GlobalImage source={IconSwapAccent1} size="md" />
        </View>

        <GlobalPadding size="xs" />

        <GlobalText type="body2">{t('swap.you_receive')}</GlobalText>

        <GlobalPadding size="xs" />

        <GlobalInputWithTokenSelector
          value={youReceiveAmount}
          setValue={setYouReceiveAmount}
          title="USDC"
        />

        <GlobalPadding size="xl" />

        <DetailItem title="Slippage" value="0000000000 %" />

        <DetailItem title="Item 2" value="0000000000 %" />

        <DetailItem title="Item 3" value="0000000000 %" />

        <GlobalPadding size="4xl" />

        <BigDetailItem title={t('swap.you_send')} value="2,780 USDC" />

        <BigDetailItem title={t('swap.you_receive')} value="2,716 USDC" />
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wideSmall
          title={t('swap.quote')}
          onPress={goToBack}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(SwapPage);
