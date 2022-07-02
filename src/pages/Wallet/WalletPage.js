import React, { useContext } from 'react';
import { AppContext } from '../../AppProvider';
import { useNavigation } from '../../routes/hooks';
import RoutesBuilder from '../../routes/RoutesBuilder';
import routes, { ROUTES_MAP } from './routes';
import BottomTabsLayout from '../../component-library/Layout/BottomTabsLayout';
import { ROUTES_TYPES } from '../../routes/constants';

const WalletPage = () => {
  const navigate = useNavigation();
  const [{ activeWallet }] = useContext(AppContext);
  return (
    <BottomTabsLayout
      tabs={routes.map(r => ({
        title: r.name,
        onClick: () => navigate(r.key),
      }))}>
      <RoutesBuilder routes={routes} type={ROUTES_TYPES.TABS} />
    </BottomTabsLayout>
  );
};

export default WalletPage;
