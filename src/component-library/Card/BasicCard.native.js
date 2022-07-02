import React from 'react';
import { Card } from 'react-native-paper';

const BasicCard = ({
  headerIcon,
  headerAction,
  headerTitle,
  headerSubtitle,
  children,
  actions,
}) => (
  <Card>
    <Card.Title
      title={headerTitle}
      subtitle={headerSubtitle}
      {...(headerIcon ? { left: () => headerIcon } : {})}
      {...(headerAction ? { right: () => headerAction } : {})}
    />
    <Card.Content>{children}</Card.Content>
    <Card.Actions>{actions && actions.map(action => action)}</Card.Actions>
  </Card>
);

export default BasicCard;
