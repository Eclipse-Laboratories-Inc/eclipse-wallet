import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '../Global/theme';
import GlobalButton from '../Global/GlobalButton';
import GlobalImage from '../Global/GlobalImage';
import GlobalText from '../Global/GlobalText';

import IconChevronRight from '../../assets/images/IconChevronRight.png';
import IconInteractionRed from '../../assets/images/IconInteractionRed.png';
import IconEdit from '../../assets/images/IconEdit.png';

const styles = StyleSheet.create({
  touchable: {
    marginBottom: theme.gutters.paddingNormal,
  },
  buttonCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonCardLG: {
    minHeight: 80,
  },
  buttonCardXL: {
    minHeight: 94,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    backgroundColor: theme.colors.bgPrimary,
  },
  spaceRight: {
    marginRight: theme.gutters.paddingSM,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    opacity: 0.9,
  },
  cardActions: {
    alignItems: 'flex-end',
  },
  onEditButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.gutters.responsivePadding * -0.5,
    marginLeft: theme.gutters.paddingXS,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.labelPrimary,
  },
  touchableActionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.gutters.paddingXXS,
  },
});

const CardButton = ({
  type,
  icon,
  image,
  imageSize,
  mask,
  title,
  description,
  children,
  selected,
  active,
  actionIcon,
  actions,
  onPress,
  onSecondaryPress,
  touchableStyles,
  buttonStyle,
}) => {
  const buttonSize = {
    ...(title && description && styles.buttonCardLG),
    ...(type === 'xl' && styles.buttonCardXL),
  };

  return (
    <GlobalButton
      type="card"
      title={!children ? title : null}
      selected={selected}
      active={active}
      onPress={onPress}
      style={[styles.buttonCard, buttonSize, buttonStyle]}
      touchableStyles={[touchableStyles, styles.touchable]}>
      <View style={styles.cardContent}>
        {icon && <View style={styles.spaceRight}>{icon}</View>}

        {image && (
          <GlobalImage
            source={image}
            size={imageSize}
            style={[styles.image, styles.spaceRight]}
            mask={mask}
            maskColor={selected && 'accentPrimary'}
          />
        )}

        <View style={styles.main}>
          {title && (
            <GlobalText type="body2" numberOfLines={1}>
              {title}
            </GlobalText>
          )}

          {description && (
            <GlobalText
              type="caption"
              numberOfLines={1}
              style={styles.description}>
              {description}
            </GlobalText>
          )}
        </View>
      </View>

      {actions && <View style={styles.cardActions}>{actions}</View>}

      {actionIcon === 'right' && (
        <GlobalImage source={IconChevronRight} size="sm" />
      )}

      {actionIcon === 'complete' && (
        <GlobalImage source={IconInteractionRed} size="sm" />
      )}

      {children && <View>{children}</View>}

      {onSecondaryPress && (
        <View style={styles.onEditButtonBox}>
          <GlobalButton
            onPress={onSecondaryPress}
            style={styles.onEditButton}
            touchableStyles={[styles.touchableActionButton, buttonSize]}
            transparent>
            <GlobalImage source={IconEdit} size="sm" />
          </GlobalButton>
        </View>
      )}
    </GlobalButton>
  );
};
export default CardButton;
