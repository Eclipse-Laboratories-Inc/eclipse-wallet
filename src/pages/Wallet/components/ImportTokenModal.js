import React, { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet } from 'react-native';

import { withTranslation } from '../../../hooks/useTranslations';

import GlobalLayout from '../../../component-library/Global/GlobalLayout';
import GlobalBackTitle from '../../../component-library/Global/GlobalBackTitle';
import CardButton from '../../../component-library/CardButton/CardButton';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import GlobalInput from '../../../component-library/Global/GlobalInput';
import GlobalPadding from '../../../component-library/Global/GlobalPadding';
import GlobalButton from '../../../component-library/Global/GlobalButton';
import theme, { globalStyles } from '../../../component-library/Global/theme';
import { getShortAddress } from '../../../utils/wallet';
import { isNative } from '../../../utils/platform';

const MAX_PAG = 20;
const getFilterItems = (items, search) =>
  search.length >= 3
    ? items.filter(
        t =>
          (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
          (t.symbol || '').toLowerCase().includes(search.toLowerCase()),
      )
    : items;

const styles = StyleSheet.create({
  importTokenBtn: {
    fontFamily: theme.fonts.dmSansRegular,
    color: theme.colors.accentTertiary,
    fontWeight: 'normal',
    textTransform: 'none',
  },
});

const ImportTokenModal = ({ t, tokens, onChange = () => {} }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchToken, setSearchToken] = useState('');
  const [drawedList, setDrawedList] = useState([]);
  const filteredTokens = useMemo(
    () => getFilterItems(tokens, searchToken),
    [tokens, searchToken],
  );
  useEffect(() => {
    if (filteredTokens.length > MAX_PAG) {
      setDrawedList(filteredTokens.slice(0, MAX_PAG));
    } else {
      setDrawedList(filteredTokens);
    }
  }, [filteredTokens]);
  const onSelect = token => {
    onChange(token);
    setIsVisible(false);
  };
  const onViewMore = () => {
    setDrawedList([
      ...drawedList,
      ...filteredTokens.slice(drawedList.length, drawedList.length + MAX_PAG),
    ]);
  };
  return (
    <>
      <GlobalButton
        type="text"
        title={t('wallet.import_tokens')}
        onPress={() => setIsVisible(true)}
        textStyle={styles.importTokenBtn}
        touchableStyles={globalStyles.buttonTouchable}
        transparent
      />

      <Modal
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
        visible={isVisible}>
        <GlobalLayout
          fullscreen
          style={{ backgroundColor: theme.colors.bgDarken }}>
          <GlobalLayout.Header>
            <GlobalBackTitle
              onBack={() => setIsVisible(false)}
              title={t('wallet.select_token')}
            />
            <GlobalInput
              forSearch
              placeholder={t('actions.search_placeholder')}
              value={searchToken}
              setValue={setSearchToken}
            />
            <GlobalPadding />
            <GlobalPadding />
            {drawedList.map(token => (
              <CardButton
                key={token.mint || token.address || token.symbol}
                onPress={() => onSelect(token)}
                icon={<GlobalImage url={token.logo} size="md" circle />}
                title={
                  token.name || getShortAddress(token.mint || token.address)
                }
                description={token.symbol}
              />
            ))}
          </GlobalLayout.Header>

          <GlobalLayout.Footer>
            {tokens.length > MAX_PAG && (
              <>
                <GlobalButton
                  type="default"
                  wideSmall
                  onPress={onViewMore}
                  title={t('actions.view_more')}
                  disabled={filteredTokens.length <= drawedList.length}
                />
                <GlobalPadding size="xs" />
              </>
            )}
            <GlobalButton
              type="primary"
              wideSmall
              onPress={() => setIsVisible(false)}
              title={t('actions.close')}
            />
          </GlobalLayout.Footer>
        </GlobalLayout>
      </Modal>
    </>
  );
};

export default withTranslation()(ImportTokenModal);
