import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatAmount } from '4m-wallet-adapter';

import theme from '../Global/theme';
import GlobalImage from '../Global/GlobalImage';
import GlobalText from '../Global/GlobalText';
import CardButton from './CardButton';

import {
  TRANSACTION_TYPE,
  TRANSACTION_STATUS,
} from '../../pages/Transactions/constants';
import { AppContext } from '../../AppProvider';
import { hiddenValue } from '../../utils/amount';
import { getTransactionImage, getShortAddress } from '../../utils/wallet';
import IconFailed from '../../assets/images/IconFailed.png';
import { withTranslation } from '../../hooks/useTranslations';

const styles = StyleSheet.create({
  imageStyle: {
    borderRadius: theme.borderRadius.borderRadiusPill,
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const CardButtonTransaction = ({ t, transaction, onPress }) => {
  const { id, type, status, inputs, outputs } = transaction;

  const [{ hiddenBalance }] = useContext(AppContext);

  let image, description, tokenImg1, tokenImg2;

  if (type === TRANSACTION_TYPE.SEND) {
    image = getTransactionImage('sent');
    tokenImg1 = outputs?.[0]?.logo;
    if (outputs?.[0]?.destination) {
      description = t('transactions.toAddress', {
        address: getShortAddress(outputs[0].destination),
      });
    }
  } else if (type === TRANSACTION_TYPE.RECEIVE) {
    image = getTransactionImage('received');
    tokenImg1 = inputs?.[0]?.logo;
    if (inputs?.[0]?.source) {
      description = t('transactions.fromAddress', {
        address: getShortAddress(inputs[0].source),
      });
    }
  } else if (type === TRANSACTION_TYPE.SWAP) {
    image = getTransactionImage('swap');
    if (inputs?.[0]?.name && outputs?.[0]?.name) {
      description = `${inputs[0].name} → ${outputs[0].name}`;
    }
    if (inputs?.[0]?.logo && outputs?.[0]?.logo) {
      tokenImg1 = inputs[0].logo;
      tokenImg2 = outputs[0].logo;
    }
  } else if (type === TRANSACTION_TYPE.INTERACTION) {
    image = getTransactionImage('interaction');
  } else {
    image = getTransactionImage('unknown');
  }

  let actions;
  if (status === TRANSACTION_STATUS.COMPLETED) {
    const mapAction = (sign, { amount, decimals, symbol, name }, i) => {
      const unit = symbol || name || '';
      let amountUi;
      if (hiddenBalance) {
        amountUi = `${hiddenValue} ${unit}`;
      } else {
        amountUi = `${sign} ${formatAmount(amount, decimals)} ${unit}`;
      }
      const color = sign === '-' ? 'negativeLight' : 'positive';
      const kind = sign === '-' ? 'output' : 'input';

      return (
        <View style={styles.inline} key={`${id}-${kind}-${i}`}>
          <GlobalText key="amount-action" type="body1" color={color}>
            {amountUi}
          </GlobalText>
        </View>
      );
    };

    const outputActions = outputs.map((output, i) => mapAction('-', output, i));
    const inputActions = inputs.map((input, i) => mapAction('+', input, i));

    actions = outputActions.concat(inputActions);
  } else {
    actions = [
      <View style={styles.inline} key={id}>
        <GlobalImage source={IconFailed} size="xxs" />
      </View>,
    ];
  }

  return (
    <CardButton
      title={t(`transactions.${type}`)}
      description={description}
      image={image}
      imageSize="normal"
      imageStyle={styles.imageStyle}
      tokenImg1={tokenImg1}
      tokenImg2={tokenImg2}
      actions={actions}
      onPress={onPress}
    />
  );
};
export default withTranslation()(CardButtonTransaction);
