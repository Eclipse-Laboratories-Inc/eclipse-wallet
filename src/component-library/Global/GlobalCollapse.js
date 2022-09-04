import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { withTranslation } from '../../hooks/useTranslations';

import theme from './theme';
import GlobalButton from './GlobalButton';
import GlobalText from './GlobalText';

import IconExpandMore from '../../assets/images/IconExpandMore.png';
import IconExpandLess from '../../assets/images/IconExpandLess.png';

const styles = StyleSheet.create({
  inline: {
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    textTransform: 'none',
    minHeight: 24,
  },
  titleButtonStyle: {
    minHeight: theme.lineHeight.lineHeightNormal,
    paddingHorizontal: 0,
  },
  buttonStyle: {
    minHeight: 24,
  },
  iconStyle: {
    marginRight: theme.gutters.paddingXS * -1,
    width: 24,
    height: 24,
    opacity: 0.8,
  },
  viewAllBtn: {
    paddingHorizontal: theme.gutters.paddingXXS,
  },
  viewAllBtnText: {
    fontFamily: theme.fonts.dmSansRegular,
    color: theme.colors.labelTertiary,
    fontWeight: 'normal',
    textTransform: 'none',
  },
});

const GlobalCollapse = ({
  title,
  titleStyle,
  narrowTitle,
  actionTitle,
  viewAllAction,
  actions,
  hideCollapse,
  children,
  isOpen,
  t,
}) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(isOpen);
  const toggleCollapse = t => setIsCollapseOpen(!isCollapseOpen);

  return (
    <>
      <View style={styles.inline}>
        {title && (
          <>
            {hideCollapse && (
              <GlobalText type="body2" style={titleStyle}>
                {title}
              </GlobalText>
            )}
            {!hideCollapse && (
              <GlobalButton
                type="text"
                title={title}
                transparent
                onPress={toggleCollapse}
                style={styles.titleButtonStyle}
                textStyle={styles.title}
              />
            )}
          </>
        )}

        <View style={styles.inline}>
          {viewAllAction && (
            <GlobalButton
              type="text"
              color="secondary"
              title={actionTitle ? actionTitle : t('actions.view_all')}
              style={styles.viewAllBtn}
              textStyle={styles.viewAllBtnText}
              onPress={viewAllAction}
            />
          )}

          {actions}

          {!hideCollapse && (
            <GlobalButton
              type="icon"
              transparent
              icon={isCollapseOpen ? IconExpandLess : IconExpandMore}
              onPress={toggleCollapse}
              style={narrowTitle && styles.buttonStyle}
              iconStyle={styles.iconStyle}
            />
          )}
        </View>
      </View>
      {isCollapseOpen && children}
    </>
  );
};
export default withTranslation()(GlobalCollapse);
