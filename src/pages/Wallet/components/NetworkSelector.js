import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BLOCKCHAINS } from '4m-wallet-adapter';
import theme, { globalStyles } from '../../../component-library/Global/theme';
import BasicSelect from '../../../component-library/Selects/BasicSelect';
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
  label: {
    alignItems: 'center',
  },
  networkLogo: {
    marginRight: theme.gutters.paddingXS,
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

const getNetworkIcon = ({ blockchain }) => {
  switch (blockchain) {
    case BLOCKCHAINS.BITCOIN:
      return IconBitcoinVector;
    case BLOCKCHAINS.ETHEREUM:
      return IconEthereumVector;
    case BLOCKCHAINS.SOLANA:
      return IconSolanaVector;
    case BLOCKCHAINS.NEAR:
      return IconNearVector;
    default:
      return IconSalmon;
  }
};

const NetworkSelector = ({ value, setValue, networks, label, disabled }) => (
  <BasicSelect
    value={value}
    setValue={setValue}
    style={styles.select}
    inputProps={styles.menuList}
    label={label}
    disabled={disabled}
    options={networks.map(network => ({
      value: network.id,
      custom: (
        <View style={[globalStyles.inline, styles.label]}>
          <GlobalImage
            source={getNetworkIcon(network)}
            style={styles.networkLogo}
            size="xxs"
          />
          <GlobalText
            type="body2"
            style={{ fontSize: theme.fontSize.fontSizeSM }}>
            {network.name}
          </GlobalText>
        </View>
      ),
    }))}
  />
);

export default NetworkSelector;
