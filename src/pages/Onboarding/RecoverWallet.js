import React from 'react';
import Box from '../../component-library/Box/Box';
import Button from '../../component-library/Button/Button';
import PageLayout from '../../component-library/Layout/PageLayout';
import TextTitle from '../../component-library/Text/TextTitle';

const RecoverWallet = () => (
  <PageLayout>
    <Box px={10} py={10}>
      <TextTitle>Recover</TextTitle>
    </Box>
    <Box px={10} py={10}>
      <Button>Recover</Button>
    </Box>
  </PageLayout>
);

export default RecoverWallet;
