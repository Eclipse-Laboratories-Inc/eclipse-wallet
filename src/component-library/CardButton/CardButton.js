import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '../Global/theme';
import GlobalButton from '../Global/GlobalButton';
import GlobalImage from '../Global/GlobalImage';
import GlobalText from '../Global/GlobalText';

import IconChevronRight from '../../assets/images/IconChevronRight.png';
import IconExpandMore from '../../assets/images/IconExpandMore.png';
import IconInteractionRed from '../../assets/images/IconInteractionRed.png';
import IconEdit from '../../assets/images/IconEdit.png';
import ToggleOn from '../../assets/images/ToggleOn.png';
import ToggleOff from '../../assets/images/ToggleOff.png';

const styles = StyleSheet.create({
  touchable: {
    marginBottom: theme.gutters.paddingSM,
    width: '100%',
  },
  nospace: {
    marginBottom: 0,
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
  buttonCardSM: {
    minHeight: 32,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    backgroundColor: theme.colors.bgPrimary,
  },
  spaceRight: {
    marginRight: theme.gutters.paddingXS,
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
  secondaryAction: {
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
  size,
  icon,
  image,
  imageSize,
  mask,
  title,
  caption,
  description,
  children,
  selected,
  active,
  complete,
  actionIcon,
  actions,
  nospace,
  onPress,
  onSecondaryPress,
  touchableStyles,
  buttonStyle,
  imageStyle,
  ...props
}) => {
  const buttonSize = {
    ...(title && description && styles.buttonCardLG),
    ...(size === 'sm' && styles.buttonCardSM),
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
      touchableStyles={[
        styles.touchable,
        touchableStyles,
        nospace && styles.nospace,
      ]}
      {...props}>
      <View style={styles.cardContent}>
        {icon && <View style={styles.spaceRight}>{icon}</View>}

        {image && (
          <GlobalImage
            source={image}
            size={imageSize || 'md'}
            style={[styles.image, styles.spaceRight, imageStyle]}
            // mask={mask}
            maskColor={selected && 'accentPrimary'}
            circle
          />
        )}

        <View style={styles.main}>
          {caption && (
            <GlobalText type="caption" color="tertiary">
              {caption}
            </GlobalText>
          )}

          {title && (
            <GlobalText type="body2" numberOfLines={1}>
              {title}
            </GlobalText>
          )}

          {description && (
            <GlobalText
              type="caption"
              numberOfLines={1}
              color="secondary"
              style={styles.description}>
              {description}
            </GlobalText>
          )}
        </View>
      </View>

      {actions && <View style={styles.cardActions}>{actions}</View>}

      {children && <View>{children}</View>}

      {actionIcon === 'right' && (
        <GlobalImage
          source={IconChevronRight}
          size="sm"
          style={{ opacity: 0.5 }}
        />
      )}

      {actionIcon === 'disclose' && (
        <GlobalImage
          source={IconExpandMore}
          size="sm"
          style={{ opacity: 0.5 }}
        />
      )}

      {actionIcon === 'ToggleOn' && <GlobalImage source={ToggleOn} size="md" />}

      {actionIcon === 'ToggleOff' && (
        <GlobalImage source={ToggleOff} size="md" />
      )}

      {(complete || actionIcon === 'complete') && (
        <GlobalImage source={IconInteractionRed} size="sm" />
      )}

      {onSecondaryPress && (
        <View style={styles.secondaryAction}>
          <GlobalButton
            onPress={onSecondaryPress}
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
