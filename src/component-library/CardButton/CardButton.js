import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme, { globalStyles } from '../Global/theme';
import GlobalButton from '../Global/GlobalButton';
import GlobalImage from '../Global/GlobalImage';
import GlobalText from '../Global/GlobalText';

import IconChevronRight from '../../assets/images/IconChevronRight.png';
import IconExpandMore from '../../assets/images/IconExpandMore.png';
import IconInteractionRed from '../../assets/images/IconInteractionRed.png';
import IconEdit from '../../assets/images/IconEdit.png';
import IconDelete from '../../assets/images/IconDelete.png';
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
  tokenRight: {
    marginRight: theme.gutters.paddingXS,
    marginLeft: -theme.gutters.paddingXS,
    marginTop: theme.gutters.paddingNormal,
  },
  tokenTransfer: {
    marginRight: theme.gutters.paddingXS,
    marginLeft: -theme.gutters.paddingLG,
    marginTop: theme.gutters.paddingLG,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    opacity: 0.9,
  },
  chip: {
    paddingHorizontal: theme.gutters.paddingXXS,
    marginLeft: theme.gutters.paddingXXS,
    marginTop: theme.gutters.paddingXXS,
    paddingTop: 1,
    height: theme.gutters.paddingNormal - 2,
    borderRadius: theme.borderRadius.borderRadiusXS,
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
  tertiaryAction: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.gutters.responsivePadding * -0.5,
  },
  touchableActionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.gutters.paddingXXS,
  },
});

const getChipColor = type => {
  switch (type) {
    case 'ETH':
      return 'rgb(145, 165, 240)';
    case 'BSC':
      return 'rgb(245, 206, 84)';
    case 'BEP20':
      return 'rgb(245, 206, 84)';
    case 'BEP2':
      return 'rgb(245, 206, 84)';
    case 'TRX':
      return 'rgb(255, 102, 113)';
    case 'MAINNET':
      return 'rgb(87, 222, 214)';
    default:
      return 'rgb(158, 176, 197)';
  }
};

const CardButton = ({
  type,
  size,
  icon,
  image,
  tokenImg1,
  tokenImg2,
  imageSize,
  mask,
  title,
  subtitle,
  caption,
  description,
  chip,
  children,
  selected,
  active,
  complete,
  actionIcon,
  actions,
  nospace,
  onPress,
  onSecondaryPress,
  onTertiaryPress,
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

        {(!tokenImg1 || !tokenImg2) && image && (
          <GlobalImage
            source={image}
            size={imageSize || 'md'}
            style={[styles.image, styles.spaceRight, imageStyle]}
            // mask={mask}
            maskColor={selected && 'accentPrimary'}
            circle
          />
        )}

        {tokenImg1 && !tokenImg2 && image && (
          <GlobalImage
            source={tokenImg1}
            size="xxs"
            style={[styles.image, styles.tokenTransfer, imageStyle]}
            // mask={mask}
            maskColor={selected && 'accentPrimary'}
            circle
          />
        )}

        {tokenImg1 && tokenImg2 && (
          <>
            <GlobalImage
              source={tokenImg2}
              size="xs"
              style={[styles.image, imageStyle]}
              // mask={mask}
              maskColor={selected && 'accentPrimary'}
              circle
            />
            <GlobalImage
              source={tokenImg1}
              size="xs"
              style={[styles.image, styles.tokenRight, imageStyle]}
              // mask={mask}
              maskColor={selected && 'accentPrimary'}
              circle
            />
          </>
        )}

        <View style={styles.main}>
          {caption && (
            <GlobalText type="caption" color={title ? 'tertiary' : 'primary'}>
              {caption}
            </GlobalText>
          )}
          <View style={globalStyles.inline}>
            {title && (
              <GlobalText type="body2" numberOfLines={1}>
                {title}
              </GlobalText>
            )}
            {chip && (
              <View
                style={[styles.chip, { backgroundColor: getChipColor(chip) }]}>
                <GlobalText type="overline" color="primary" bold>
                  {chip}
                </GlobalText>
              </View>
            )}
          </View>

          {description && (
            <GlobalText
              type="caption"
              numberOfLines={1}
              color="secondary"
              style={styles.description}>
              {description}
            </GlobalText>
          )}

          {subtitle && (
            <GlobalText type="caption" color="warning" numberOfLines={1}>
              {subtitle}
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
            <GlobalImage source={IconEdit} size="xs" />
          </GlobalButton>
        </View>
      )}
      {onTertiaryPress && (
        <View style={styles.tertiaryAction}>
          <GlobalButton
            onPress={onTertiaryPress}
            touchableStyles={[styles.touchableActionButton, buttonSize]}
            transparent>
            <GlobalImage source={IconDelete} size="xs" />
          </GlobalButton>
        </View>
      )}
    </GlobalButton>
  );
};
export default CardButton;
