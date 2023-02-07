import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP as APP_ROUTES_MAP } from '../../routes/app-routes';
import { ROUTES_MAP } from './routes';
import theme from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import AvatarImage from '../../component-library/Image/AvatarImage';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalText from '../../component-library/Global/GlobalText';
import Header from '../../component-library/Layout/Header';
import IconBridge from '../../assets/images/IconBridge.png';

const styles = StyleSheet.create({
  cardBtn: {
    backgroundColor: theme.colors.bgLight,
  },
});

const ExchangeSection = ({ t }) => {
  const navigate = useNavigation();
  const [{ activeBlockchainAccount }, {}] = useContext(AppContext);
  const [optSelected, setOptSelected] = useState(0);

  const goToBack = () => {
    navigate(APP_ROUTES_MAP.WALLET);
  };

  const goToSwapRoute = type =>
    type === 0
      ? navigate(ROUTES_MAP.WALLET_SWAP)
      : navigate(ROUTES_MAP.WALLET_BRIDGE);
  return (
    <GlobalLayout>
      <GlobalLayout.Header>
        <Header />
        <GlobalBackTitle title={t('swap.swap_tokens')} />
        <GlobalPadding />
        <GlobalText type="body2" color="secondary" center>
          {t('swap.choose_type')}
        </GlobalText>
        <GlobalPadding size="xl" />
        <CardButton
          buttonStyle={styles.cardBtn}
          onPress={() => setOptSelected(0)}
          title={t('swap.same_blockchain')}
          active={optSelected === 0}
          actions={[
            <AvatarImage
              url={activeBlockchainAccount.network.icon}
              size={30}
            />,
          ]}
        />
        <GlobalPadding size="xxs" />
        <CardButton
          buttonStyle={styles.cardBtn}
          onPress={() => setOptSelected(1)}
          title={t('swap.other_blockchain')}
          active={optSelected === 1}
          actions={[<AvatarImage url={IconBridge} size={30} />]}
        />
      </GlobalLayout.Header>

      <GlobalLayout.Footer>
        <GlobalButton
          type="primary"
          wideSmall
          title={t('actions.next')}
          onPress={() => goToSwapRoute(optSelected)}
        />
      </GlobalLayout.Footer>
    </GlobalLayout>
  );
};

export default withTranslation()(ExchangeSection);
