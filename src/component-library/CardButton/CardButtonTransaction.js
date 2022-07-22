import React from 'react';

import CardButton from './CardButton';
import GlobalText from '../Global/GlobalText';

import IconTransactionSent from '../../assets/images/IconTransactionSent.png';
import IconTransactionReceived from '../../assets/images/IconTransactionReceived.png';
import IconTransactionSwap from '../../assets/images/IconTransactionSwap.png';
import IconTransactionInteraction from '../../assets/images/IconTransactionInteraction.png';
import IconTransactionPaid from '../../assets/images/IconTransactionPaid.png';

import { getShortAddress } from '../../utils/wallet';

const CardButtonTransaction = ({
  transaction,
  address,
  amount,
  percentage,
  title,
  description,
  active,
  complete,
  goToButton,
  onPress,
  touchableStyles,
}) => {
  const getTransactionTitle = () => {
    const object = transaction;
    switch (object) {
      case 'sent':
        return 'Sent';
      case 'received':
        return 'Received';
      case 'swap':
        return 'Swap';
      case 'interaction':
        return 'Interaction';
      case 'paid':
        return 'Paid';
      default:
        return 'Sent';
    }
  };

  const getTransactionImage = () => {
    const object = transaction;
    switch (object) {
      case 'sent':
        return IconTransactionSent;
      case 'received':
        return IconTransactionReceived;
      case 'swap':
        return IconTransactionSwap;
      case 'interaction':
        return IconTransactionInteraction;
      case 'paid':
        return IconTransactionPaid;
      default:
        return IconTransactionSent;
    }
  };

  return (
    <CardButton
      transaction={transaction}
      image={getTransactionImage(transaction)}
      title={title || getTransactionTitle(transaction)}
      description={description || `To: ${getShortAddress(address)}`}
      active={active}
      complete={complete}
      goToButton={goToButton}
      actions={[
        <GlobalText key={'amount-action'} type="body2" color="positive">
          {amount}
        </GlobalText>,
        <GlobalText key={'perc-action'} type="caption" color="secondary">
          {percentage}
        </GlobalText>,
      ].filter(Boolean)}
      onPress={onPress}
    />
  );
};
export default CardButtonTransaction;
