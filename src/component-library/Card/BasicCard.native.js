import React from 'react';
import { Card } from 'react-native-paper';

const BasicCard = ({
  headerIcon,
  headerAction,
  headerTitle,
  headerSubtitle,
  children,
  contentStyle,
  actions,
  ...props
}) => (
  <Card {...props}>
    {(headerIcon || headerAction || headerTitle || headerSubtitle) && (
      <Card.Title
        title={headerTitle}
        subtitle={headerSubtitle}
        {...(headerIcon ? { left: () => headerIcon } : {})}
        {...(headerAction ? { right: () => headerAction } : {})}
      />
    )}
    <Card.Content style={contentStyle}>{children}</Card.Content>
    {actions && <Card.Actions>{actions.map(action => action)}</Card.Actions>}
  </Card>
);

export default BasicCard;
