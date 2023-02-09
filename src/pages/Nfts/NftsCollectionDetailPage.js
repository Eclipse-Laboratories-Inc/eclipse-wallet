import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Modal } from 'react-native';

import { AppContext } from '../../AppProvider';
import { useNavigation, withParams } from '../../routes/hooks';
import { ROUTES_MAP } from './routes';
import { withTranslation } from '../../hooks/useTranslations';
import { getMediaRemoteUrl } from '../../utils/media';

import theme, { globalStyles } from '../../component-library/Global/theme';
import GlobalLayout from '../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../component-library/Global/GlobalBackTitle';
import GlobalImage from '../../component-library/Global/GlobalImage';
import GlobalText from '../../component-library/Global/GlobalText';
import GlobalPadding from '../../component-library/Global/GlobalPadding';
import GlobalNftList from '../../component-library/Global/GlobalNftList';
import GlobalSkeleton from '../../component-library/Global/GlobalSkeleton';
import CardButton from '../../component-library/CardButton/CardButton';
import Header from '../../component-library/Layout/Header';
import NftsBuyDetailPage from './NftsBuyDetailPage';

import useAnalyticsEventTracker from '../../hooks/useAnalyticsEventTracker';
import { SECTIONS_MAP } from '../../utils/tracking';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.black300,
  },
  renderItemStyle: {
    width: '49%',
    marginBottom: theme.gutters.paddingXS,
  },
  columnWrapperStyle: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nftImage: {
    width: '80%',
    margin: 'auto',
  },
  imageContainer: {
    flexGrow: 1,
    width: '100%',
  },
  hyperspaceIcon: {
    marginBottom: -3,
    marginLeft: 4,
  },
  topPriceIcon: {
    marginBottom: -3,
    marginLeft: 2,
    position: 'absolute',
    right: 8,
  },
});

const NftsCollectionDetailPage = ({ params, t }) => {
  useAnalyticsEventTracker(SECTIONS_MAP.NFT_COLLECTION_DETAIL);
  const navigate = useNavigation();
  const [{ activeBlockchainAccount }] = useContext(AppContext);
  const [loaded, setLoaded] = useState(false);
  const [collectionDetail, setCollectionDetail] = useState({});
  const [collectionItems, setCollectionItems] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(params.nftId ? true : false);
  const [selectedNft, setSelectedNft] = useState(
    params.nftId
      ? {
          project_id: params.id,
          token_address: params.nftId,
          page_number: params.pageNumber,
        }
      : {},
  );

  useEffect(() => {
    if (activeBlockchainAccount) {
      Promise.all([
        activeBlockchainAccount.getCollection(params.id),
        activeBlockchainAccount.getCollectionItems(params.id, 1),
      ]).then(async ([collDetail, collItems]) => {
        if (collDetail) {
          setCollectionDetail(collDetail?.project_stats[0]);
          setLoaded(true);
        }
        if (collItems) {
          setCollectionItems(
            collItems?.market_place_snapshots.map(v => ({
              ...v,
              page_number: 1,
            })),
          );
          setHasNextPage(collItems.pagination_info?.has_next_page);
        }
      });
    }
  }, [activeBlockchainAccount, params.id]);

  const { rank } = collectionDetail;
  const listedAmount = collectionDetail.num_of_token_listed;
  const perc = Math.round(collectionDetail.percentage_of_token_listed * 100);
  const totalSupply = Math.round(
    collectionDetail.num_of_token_listed /
      collectionDetail.percentage_of_token_listed,
  );

  const goToBack = () => {
    navigate(ROUTES_MAP.NFTS_LIST);
  };

  const onClick = nft => {
    setSelectedNft(nft);
    setIsModalOpen(!isModalOpen);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.renderItemStyle}>
        <CardButton
          key={item.title}
          caption={item.caption}
          title={item.title}
          description={item.description}
          nospace
          readonly
        />
      </View>
    );
  };

  const getPropertiesData = () => [
    {
      caption: t('nft.floor_price'),
      title: `${collectionDetail.floor_price.toFixed(2)} SOL`,
    },
    {
      caption: t('nft.unique_owners'),
      title: `${collectionDetail.num_of_token_holders}`,
    },
    {
      caption: t('nft.listed_nft'),
      title: `${collectionDetail.num_of_token_listed} of ${totalSupply}`,
      description: t('nft.perc_total_coll', {
        perc,
      }),
    },
    {
      caption: t('nft.one_day_vol'),
      title: `${collectionDetail.volume_1day} SOL`,
      description: t('nft.ranked#', {
        rank,
      }),
    },
  ];

  const onLoadMore = async () => {
    if (hasNextPage) {
      Promise.resolve(
        activeBlockchainAccount.getCollectionItems(params.id, pageNumber + 1),
      ).then(
        newItems =>
          setCollectionItems([
            ...collectionItems,
            ...newItems?.market_place_snapshots.map(v => ({
              ...v,
              page_number: pageNumber + 1,
            })),
          ]),
        setPageNumber(pageNumber + 1),
      );
    }
  };
  return loaded ? (
    <GlobalLayout fullscreen style={isModalOpen && styles.container}>
      <GlobalLayout.Header>
        <Header />
        <GlobalBackTitle
          onBack={goToBack}
          inlineTitle={
            <GlobalText type="headline2" center>
              {collectionDetail.project.display_name}
            </GlobalText>
          }
          nospace
        />

        <GlobalPadding size="xxs" />

        <View style={globalStyles.centered}>
          <GlobalPadding size="xs" />

          <View style={styles.imageContainer}>
            <GlobalImage
              source={getMediaRemoteUrl(collectionDetail.project.img_url)}
              style={styles.nftImage}
              square
              squircle
            />
          </View>

          <GlobalPadding size="lg" />
        </View>

        <GlobalPadding size="lg" />

        {/* <GlobalText type="body2">{t('nft.description')}</GlobalText>

          <GlobalPadding size="sm" />

          <GlobalText type="body1" color="secondary">
            {collectionDetail.description}
          </GlobalText>

          <GlobalPadding size="xl" /> */}

        <GlobalText type="body2">{t('nft.properties')}</GlobalText>

        <GlobalPadding size="sm" />

        <FlatList
          data={getPropertiesData()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapperStyle}
        />

        <GlobalPadding size="xl" />
        <GlobalText type="body2">
          {t('nft.listed_items', { listedAmount })}
        </GlobalText>

        <GlobalPadding size="sm" />

        <FlatList
          onEndReachedThreshold={0.1}
          onEndReached={onLoadMore}
          data={['']}
          showsVerticalScrollIndicator={false}
          renderItem={() => (
            <GlobalNftList
              columns={3}
              nonFungibleTokens={collectionItems}
              onClick={onClick}
            />
          )}
          style={{ height: 550 }}
        />

        <Modal
          transparent
          animationType="fade"
          onRequestClose={() => setIsModalOpen(false)}
          visible={isModalOpen}>
          <NftsBuyDetailPage
            id={selectedNft.project_id}
            nftId={selectedNft.token_address}
            pageNumber={selectedNft.page_number}
            setIsModalOpen={setIsModalOpen}
          />
        </Modal>
      </GlobalLayout.Header>
    </GlobalLayout>
  ) : (
    <GlobalLayout fullscreen>
      <GlobalSkeleton type="NftListScreen" />
    </GlobalLayout>
  );
};

export default withParams(withTranslation()(NftsCollectionDetailPage));
