import React from 'react';
import Button from '../../component-library/Button/Button';
import BasicCard from '../../component-library/Card/BasicCard';
import AvatarImage from '../../component-library/Image/AvatarImage';
import PageLayout from '../../component-library/Layout/PageLayout';
import TextParagraph from '../../component-library/Text/TextParagraph';

const WalletPage = () => (
  <PageLayout>
    <>
      {[{id: 1}, {id: 2}].map(({id}) => (
        <BasicCard
          key={`card-${id}`}
          actions={[
            <Button key="btn-send" onClick={() => {}}>
              Send
            </Button>,
            <Button key="btn-receive" onClick={() => {}}>
              Receive
            </Button>,
          ]}
          headerAction={<TextParagraph>$0.00</TextParagraph>}
          headerIcon={
            <AvatarImage
              url="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png"
              size={48}
            />
          }
          headerTitle="SOLANA"
          headerSubtitle="100"
        />
      ))}
    </>
  </PageLayout>
);

export default WalletPage;
