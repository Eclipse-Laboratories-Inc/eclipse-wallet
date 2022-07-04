import React, { useContext } from 'react';
import { AppContext } from '../../AppProvider';
import Box from '../../component-library/Box/Box';
import SelectableCard from '../../component-library/Card/SelectableCard';
import PageLayout from '../../component-library/Layout/PageLayout';
import ENDPOINTS from '../../config/endpoints';
import { getDefaultChain } from '../../utils/wallet';

const ChangeNetworkPage = () => {
  const [{ selectedEndpoints }, { changeEndpoint }] = useContext(AppContext);
  const onSelect = value => {
    changeEndpoint(getDefaultChain(), value);
  };
  return (
    <PageLayout>
      <Box px={10} py={10}>
        {Object.keys(ENDPOINTS[getDefaultChain()]).map(label => (
          <SelectableCard
            key={label}
            selected={
              selectedEndpoints[getDefaultChain()] ===
              ENDPOINTS[getDefaultChain()][label]
            }
            onSelect={() => onSelect(ENDPOINTS[getDefaultChain()][label])}
            headerTitle={label}
            headerSubtitle={ENDPOINTS[getDefaultChain()][label]}
          />
        ))}
      </Box>
    </PageLayout>
  );
};

export default ChangeNetworkPage;
