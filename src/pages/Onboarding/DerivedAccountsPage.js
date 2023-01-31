import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BLOCKCHAINS, NetworkAccountFactory } from '4m-wallet-adapter';

import AvatarImage from '../../component-library/Image/AvatarImage';
import CardButton from '../../component-library/CardButton/CardButton';
import GlobalBackgroundImage from '../../component-library/Global/GlobalBackgroundImage';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalButton from '../../component-library/Global/GlobalButton';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import GlobalText from '../../component-library/Global/GlobalText';
import theme from '../../component-library/Global/theme';
import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import { withTranslation } from '../../hooks/useTranslations';
import { ROUTES_MAP } from '../../routes/app-routes';
import { getShortAddress } from '../../utils/wallet';
import { formatCurrency } from '../../utils/amount';

const styles = StyleSheet.create({
  titleStyle: {
    marginTop: theme.gutters.paddingNormal,
    marginLeft: theme.gutters.paddingSM,
    marginRight: theme.gutters.paddingSM,
  },
  accountsView: {
    height: 600,
  },
});

const DerivedAccountsPage = ({ t }) => {
  const navigate = useNavigation();
  const [{ activeAccount, isAdapter }, { editAccount }] =
    useContext(AppContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { ETHEREUM, SOLANA } = BLOCKCHAINS;
      const { mnemonic } = activeAccount;

      // Derived accounts with credit
      const data = await Promise.all(
        Object.values(activeAccount.networksAccounts)
          .flat()
          .filter(({ network }) =>
            [ETHEREUM, SOLANA].includes(network.blockchain),
          )
          .flatMap(({ network }) =>
            Array.from({ length: 9 }, (_, i) => ({
              network,
              mnemonic,
              index: i + 1,
            })),
          )
          .map(async params => {
            await new Promise(resolve => setTimeout(() => resolve(), 1)); // give a change to render
            const derivedAccount = await NetworkAccountFactory.create(params);
            const credit = await derivedAccount.getCredit();
            return { derivedAccount, credit };
          }),
      );
      setItems(data.filter(({ credit }, i) => credit > 0));
      setLoading(false);
    };

    load();
  }, [activeAccount]);

  const onComplete = async () => {
    setWaiting(true);
    const newDerivedAccounts = items.map(item => item.derivedAccount);
    await editAccount(activeAccount.id, { newDerivedAccounts });
    navigate(isAdapter ? ROUTES_MAP.ADAPTER : ROUTES_MAP.WALLET);
  };
  const goToWallet = () => navigate(ROUTES_MAP.WALLET);
  const goToAdapter = () => navigate(ROUTES_MAP.ADAPTER);

  return (
    <GlobalBackgroundImage>
      <View style={styles.titleStyle}>
        <GlobalBackTitle
          title={t('wallet.create.derivable_accounts')}
          nospace
        />
      </View>
      <GlobalLayout style={styles.accountsView}>
        <GlobalLayout.Header>
          {loading && <GlobalSkeleton type="DerivedAccounts" />}
          {!loading && items.length === 0 && (
            <GlobalText color="warning" center>
              {t('wallet.create.no_derivable_accounts')}
            </GlobalText>
          )}
          {!loading &&
            items.map(({ derivedAccount, credit }, i) => (
              <CardButton
                key={`account-${i}-${derivedAccount.getReceiveAddress()}`}
                title={
                  <GlobalText type="body1">
                    {getShortAddress(derivedAccount.getReceiveAddress())}
                  </GlobalText>
                }
                subtitle={derivedAccount.path}
                actions={
                  <GlobalText type="body2">
                    {formatCurrency(credit, derivedAccount.network.currency)}
                  </GlobalText>
                }
                icon={
                  <AvatarImage url={derivedAccount.network.icon} size={48} />
                }
              />
            ))}
        </GlobalLayout.Header>
        <GlobalLayout.Footer>
          <GlobalButton
            type="accent"
            wide
            title={t('wallet.create.recover')}
            onPress={() => onComplete()}
            disabled={loading || waiting || items?.length === 0}
            center
          />
          <GlobalPadding size="xs" />
          {!isAdapter && (
            <GlobalButton
              type="primary"
              wide
              title={t('wallet.create.skip')}
              onPress={goToWallet}
            />
          )}
          {isAdapter && (
            <GlobalButton
              type="primary"
              wide
              title={t('wallet.create.skip')}
              onPress={goToAdapter}
            />
          )}
        </GlobalLayout.Footer>
      </GlobalLayout>
    </GlobalBackgroundImage>
  );
};

export default withTranslation()(DerivedAccountsPage);
