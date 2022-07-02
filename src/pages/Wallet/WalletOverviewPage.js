import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../AppProvider';
import Box from '../../component-library/Box/Box';
import Button from '../../component-library/Button/Button';
import PageLayout from '../../component-library/Layout/PageLayout';
import TextTitle from '../../component-library/Text/TextTitle';
import TokenList from '../../features/TokenList/TokenList';
import NtfsList from '../../features/NtfsList/NtfsList';
import WalletBalanceCard from '../../features/WalletBalanceCard/WalletBalanceCard';
import { useNavigation } from '../../routes/hooks';
import { ROUTES_MAP } from '../../routes/app-routes';

const WalletOverviewPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet }] = useContext(AppContext);
  const [totalBalance, setTotalBalance] = useState({});
  const [tokenList, setTokenList] = useState([]);
  const [ntfsList, setNtfsList] = useState([]);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (activeWallet) {
      Promise.all([
        activeWallet.getBalance(),
        activeWallet.getTokens(),
        activeWallet.getAllNfts(),
      ]).then(([balance, tokens, ntfs]) => {
        setTotalBalance(balance);
        setTokenList(tokens);
        setNtfsList(ntfs);
        setLoaded(true);
      });
    }
  }, [activeWallet]);
  const goToSend = () => {};
  const goToReceive = () => {};
  const goToTokenDetail = t =>
    navigate(ROUTES_MAP.TOKEN_DETAIL, { tokenId: t.address });
  return (
    loaded && (
      <PageLayout>
        <WalletBalanceCard
          balance={totalBalance}
          messages={[]}
          actions={[
            <Button key={'send-button'} onClick={goToSend}>
              Send
            </Button>,
            <Button key={'receive-button'} onClick={goToReceive}>
              Receive
            </Button>,
          ]}
        />
        <Box>
          <TextTitle>Tokens</TextTitle>
          <TokenList tokens={tokenList} onDetail={goToTokenDetail} />
        </Box>
        <Box>
          <TextTitle>NTF's</TextTitle>
          <NtfsList ntfs={ntfsList} />
        </Box>
      </PageLayout>
    )
  );
};

export default WalletOverviewPage;
