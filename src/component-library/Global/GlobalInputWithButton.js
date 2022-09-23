import React from 'react';
import { StyleSheet, View } from 'react-native';

import GlobalButton from './GlobalButton';
import GlobalImage from './GlobalImage';
import GlobalInput from './GlobalInput';
import GlobalText from './GlobalText';

import IconQRCodeScanner from '../../assets/images/IconQRCodeScanner.png';
import IconEdit from '../../assets/images/IconEdit.png';
import IconCopy from '../../assets/images/IconCopy.png';
import IconVisibilityShow from '../../assets/images/IconVisibilityShow.png';
import IconVisibilityHidden from '../../assets/images/IconVisibilityHidden.png';

import theme from './theme';

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: 'row',
    width: '100%',
  },
  secondaryAction: {
    position: 'absolute',
    top: 0,
    right: theme.gutters.paddingXS,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // borderLeftWidth: 1,
    // borderLeftColor: theme.colors.btnBrandLight,
  },
  touchableActionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 1,
  },
  inputStyle: {
    paddingRight: 20,
  },
  inputStyleWithIcon: {
    paddingRight: 50,
  },
  inputStyleWithButton: {
    paddingRight: 72,
  },
  buttonLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const GlobalInputWithButton = ({
  placeholder,
  forSearch,
  startLabel,
  value,
  setValue,
  invalid,
  complete,
  inputStyle,
  numberOfLines,
  actionIcon,
  buttonLabel,
  buttonIcon,
  onActionPress,
  buttonOnPress,
  validating,
  ...props
}) => {
  // console.log('Test');

  return (
    <View style={styles.inputGroup}>
      <GlobalInput
        placeholder={placeholder}
        forSearch={forSearch}
        startLabel={startLabel}
        value={value}
        setValue={setValue}
        invalid={invalid}
        complete={complete}
        style={[
          styles.inputStyle,
          (actionIcon || complete) && styles.inputStyleWithIcon,
          buttonOnPress &&
            (buttonLabel || buttonIcon) &&
            styles.inputStyleWithButton,
          inputStyle,
        ]}
        numberOfLines={1}
        validating={validating}
        {...props}
      />

      {actionIcon && onActionPress && (
        <View style={styles.secondaryAction}>
          <GlobalButton
            onPress={onActionPress}
            touchableStyles={styles.touchableActionButton}
            transparent>
            {actionIcon === 'qr' && (
              <GlobalImage source={IconQRCodeScanner} size="xs" />
            )}
            {actionIcon === 'edit' && (
              <GlobalImage source={IconEdit} size="xs" />
            )}
            {actionIcon === 'copy' && (
              <GlobalImage source={IconCopy} size="xs" />
            )}
            {actionIcon === 'show' && (
              <GlobalImage source={IconVisibilityShow} size="xs" />
            )}
            {actionIcon === 'hide' && (
              <GlobalImage source={IconVisibilityHidden} size="xs" />
            )}
            {actionIcon === 'sendmax' && (
              <GlobalText type="button" color="primary">
                Max
              </GlobalText>
            )}
          </GlobalButton>
        </View>
      )}

      {buttonOnPress && (buttonLabel || buttonIcon) && (
        <View style={styles.secondaryAction}>
          <GlobalButton
            onPress={buttonOnPress}
            size="medium"
            title={buttonLabel}
            icon={buttonIcon}
          />
        </View>
      )}
    </View>
  );
};

export default GlobalInputWithButton;
