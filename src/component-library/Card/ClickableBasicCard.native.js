import React from 'react';
import { Card } from 'react-native-paper';

const ClickableBasicCard = ({
  headerIcon,
  headerAction,
  headerTitle,
  headerSubtitle,
  children,
  onClick,
}) => (
  <Card onPress={onClick}>
    <Card.Title
      title={headerTitle}
      subtitle={headerSubtitle}
      {...(headerIcon ? { left: () => headerIcon } : {})}
      {...(headerAction ? { right: () => headerAction } : {})}
    />
    <Card.Content>{children}</Card.Content>
  </Card>
);

export default ClickableBasicCard;
