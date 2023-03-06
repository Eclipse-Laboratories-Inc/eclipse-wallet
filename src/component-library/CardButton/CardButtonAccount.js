import React from 'react';

import CardButton from './CardButton';

const CardButtonAccount = ({
  account,
  imageSize,
  selected,
  active,
  onPress,
  onSecondaryPress,
  onTertiaryPress,
  buttonStyle,
  touchableStyles,
  ...props
}) => (
  <CardButton
    key={account.id}
    title={account.name}
    image={account.avatar}
    imageSize={imageSize ? imageSize : 'xl'}
    mask="lg"
    active={active}
    selected={selected}
    onPress={onPress}
    onSecondaryPress={onSecondaryPress}
    onTertiaryPress={onTertiaryPress}
    buttonStyle={buttonStyle}
    touchableStyles={touchableStyles}
    {...props}
  />
);

export default CardButtonAccount;
