import React from 'react';
import { StyleSheet, View } from 'react-native';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import theme, { globalStyles } from '../../../component-library/Global/theme';
import GlobalText from '../../../component-library/Global/GlobalText';
import GlobalImage from '../../../component-library/Global/GlobalImage';
import IconSolanaVector from '../../../assets/images/IconSolanaVector.png';
import IconNearVector from '../../../assets/images/IconNearVector.png';
import IconEthereumVector from '../../../assets/images/IconEthereumVector.png';
import IconBitcoinVector from '../../../assets/images/IconBitcoinVector.png';
import IconSalmon from '../../../assets/images/IconSalmon.png';

const styles = StyleSheet.create({
  select: {
    borderRadius: theme.borderRadius.borderRadiusNormal,
    backgroundColor: theme.colors.bgLight,
    height: theme.gutters.padding2XL,
    minWidth: 102,
  },
  networkLogo: {
    marginRight: theme.gutters.paddingXS,
    marginTop: theme.gutters.paddingXXS,
    width: theme.gutters.paddingSM,
  },
  menuList: {
    MenuProps: {
      MenuListProps: {
        sx: {
          backgroundColor: theme.colors.bgLight,
        },
      },
    },
  },
});

const NetworkSelector = ({ value, setValue, options, label, disabled }) => {
  const handleChange = event => {
    setValue(event.target.value);
  };
  const getNetworkIcon = id => {
    const networkName = id.split('-')[0];
    switch (networkName) {
      case 'bitcoin':
        return IconBitcoinVector;
      case 'ethereum':
        return IconEthereumVector;
      case 'solana':
        return IconSolanaVector;
      case 'near':
        return IconNearVector;
      default:
        return IconSalmon;
    }
  };
  return (
    <Select
      value={value}
      label={label}
      onChange={handleChange}
      style={styles.select}
      inputProps={styles.menuList}>
      {options.map(option => (
        <MenuItem key={`option-${option.value}`} value={option.value}>
          <View style={globalStyles.inline}>
            <GlobalImage
              source={getNetworkIcon(option.value)}
              style={styles.networkLogo}
              size="xxs"
            />
            <GlobalText
              type="body2"
              style={{ fontSize: theme.fontSize.fontSizeSM }}>
              {option.label}
            </GlobalText>
          </View>
        </MenuItem>
      ))}
    </Select>
  );
};

export default NetworkSelector;
